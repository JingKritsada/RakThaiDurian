import { User } from "../interface/userInterface";

import { apiClient, apiRequest, ApiOptions, setTokenGetter } from "./api";

import { AuthResponse, UserProfileResponse } from "@/interface/responseInterface";

// Token manager for handling token storage with fallback
let memoryToken: string | null = null;

export const tokenManager = {
	setToken: (token: string | null) => {
		memoryToken = token;
		if (token) {
			try {
				localStorage.setItem("durian_token", token);
			} catch (e) {
				console.warn("Failed to save token to localStorage:", e);
			}
		} else {
			try {
				localStorage.removeItem("durian_token");
			} catch (e) {
				console.warn("Failed to remove token from localStorage:", e);
			}
		}
	},
	getToken: (): string | null => {
		// Prioritize memory token, fallback to localStorage
		if (memoryToken) {
			return memoryToken;
		}
		try {
			const storedToken = localStorage.getItem("durian_token");

			if (storedToken) {
				memoryToken = storedToken; // Sync to memory

				return storedToken;
			}
		} catch (e) {
			console.warn("Failed to get token from localStorage:", e);
		}

		return null;
	},
	clearToken: () => {
		memoryToken = null;
		try {
			localStorage.removeItem("durian_token");
		} catch (e) {
			console.warn("Failed to remove token from localStorage:", e);
		}
	},
};

// Wire up tokenManager to api interceptor
setTokenGetter(tokenManager.getToken);

export const userService = {
	/**
	 * Register new user
	 * POST /auth/register
	 */
	register: async (
		data: { username: string; password: string; email?: string; name?: string },
		options?: ApiOptions
	): Promise<User> => {
		const response = await apiRequest<AuthResponse>(
			() => apiClient.post<AuthResponse>("/auth/register", data),
			options
		);

		// Extract and store token
		const token =
			response.token || (response as unknown as { data?: { token?: string } }).data?.token;

		if (token) {
			tokenManager.setToken(token);
		}

		// Fetch user profile after registration
		const profile = await userService.getProfile({ skipGlobalLoading: true });

		return profile;
	},

	/**
	 * Login with username/password
	 * POST /auth/login
	 */
	login: async (
		username: string,
		password: string,
		options?: ApiOptions
	): Promise<{ user: User; token: string }> => {
		const response = await apiRequest<AuthResponse>(
			() => apiClient.post<AuthResponse>("/auth/login", { username, password }),
			options
		);

		// Extract token - handle both possible response structures
		// API might return token at root level or inside data
		const token =
			response.token || (response as unknown as { data?: { token?: string } }).data?.token;

		const responseUsername =
			response.data?.username ||
			(response as unknown as { data?: { username?: string } }).data?.username;

		if (!token) {
			throw new Error("ไม่พบ token ในการตอบกลับจากเซิร์ฟเวอร์");
		}

		// Store token using tokenManager
		tokenManager.setToken(token);

		// Fetch user profile after login
		const profile = await userService.getProfile({ skipGlobalLoading: true });

		return { user: { ...profile, username: responseUsername }, token };
	},

	/**
	 * Get current user profile
	 * GET /auth/profile
	 */
	getProfile: async (options?: ApiOptions): Promise<User> => {
		const response = await apiRequest<UserProfileResponse>(
			() => apiClient.get<UserProfileResponse>("/auth/profile"),
			options
		);

		const user: User = {
			id: response.data.id,
			email: response.data.email,
			name: response.data.name,
			role: response.data.role,
		};

		// Cache user data
		localStorage.setItem("durian_user", JSON.stringify(user));

		return user;
	},

	/**
	 * Logout - clear local storage
	 */
	// TODO: Should backend have logout endpoint?
	logout: async (options?: ApiOptions): Promise<void> => {
		// Note: Backend doesn't have logout endpoint, just clear local storage
		await apiRequest<void>(
			() =>
				new Promise((resolve) => {
					tokenManager.clearToken();
					try {
						localStorage.removeItem("durian_user");
					} catch (e) {
						console.warn("Failed to remove user from localStorage:", e);
					}
					resolve({ data: undefined } as never);
				}),
			options
		);
	},

	/**
	 * Get cached current user from localStorage
	 */
	getCurrentUser: (): User | null => {
		const userStr = localStorage.getItem("durian_user");

		try {
			return userStr ? JSON.parse(userStr) : null;
		} catch {
			localStorage.removeItem("durian_user");

			return null;
		}
	},

	/**
	 * Check if user has valid token
	 */
	isAuthenticated: (): boolean => {
		return !!tokenManager.getToken();
	},
};
