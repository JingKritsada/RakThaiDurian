import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

import { User } from "../interface/userInterface";
import { userService, tokenManager } from "../services/userService";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	token: string | null;
	login: (
		username: string,
		password: string,
		options?: { skipGlobalLoading?: boolean }
	) => Promise<void>;
	logout: (options?: { skipGlobalLoading?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(() => userService.getCurrentUser());
	const [isLoading] = useState(false);

	// Use state to store token as fallback when localStorage fails
	const [memoryToken, setMemoryToken] = useState<string | null>(() => tokenManager.getToken());

	// Memoized token value - prioritize memory, fallback to localStorage
	const token = useMemo(() => {
		return memoryToken || tokenManager.getToken();
	}, [memoryToken]);

	const login = useCallback(
		async (username: string, password: string, options?: { skipGlobalLoading?: boolean }) => {
			const { user: loggedInUser, token: authToken } = await userService.login(
				username,
				password,
				options
			);

			// Store token in memory as fallback
			setMemoryToken(authToken);
			setUser(loggedInUser);
		},
		[]
	);

	const logout = useCallback(async (options?: { skipGlobalLoading?: boolean }) => {
		await userService.logout(options);
		setMemoryToken(null);
		setUser(null);
	}, []);

	const value = useMemo(
		() => ({
			user,
			isLoading,
			token,
			login,
			logout,
		}),
		[user, isLoading, token, login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error("useAuth must be used within a AuthProvider");

	return context;
};
