import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { loadingManager } from "../utils/loadingManager";

// Import tokenManager - use dynamic import to avoid circular dependency
let getToken: () => string | null = () => localStorage.getItem("durian_token");

// Set the token getter after userService is loaded
export const setTokenGetter = (getter: () => string | null) => {
	getToken = getter;
};

// Create axios instance with base URL
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "/api",
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor - add auth token
api.interceptors.request.use(
	(config) => {
		const token = getToken();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - handle errors
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle 401 Unauthorized - clear token and redirect
		if (error.response?.status === 401) {
			localStorage.removeItem("durian_token");
			localStorage.removeItem("durian_user");
			// Optionally redirect to login
			// window.location.href = '/login';
		}

		return Promise.reject(error);
	}
);

// Types for API options
export interface ApiOptions {
	skipGlobalLoading?: boolean;
}

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<{ message?: string }>;

		// Server responded with error
		if (axiosError.response?.data?.message) {
			return axiosError.response.data.message;
		}

		// Network error
		if (axiosError.code === "ECONNABORTED") {
			return "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง";
		}

		if (!axiosError.response) {
			return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
		}

		// HTTP status errors
		switch (axiosError.response.status) {
			case 400:
				return "คำขอไม่ถูกต้อง";
			case 401:
				return "กรุณาเข้าสู่ระบบใหม่";
			case 403:
				return "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
			case 404:
				return "ไม่พบข้อมูลที่ต้องการ";
			case 500:
				return "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
			default:
				return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
};

// Wrapper function for API calls with loading management
export async function apiRequest<T>(
	requestFn: () => Promise<AxiosResponse<T>>,
	options?: ApiOptions
): Promise<T> {
	const showLoading = !options?.skipGlobalLoading;

	try {
		if (showLoading) {
			loadingManager.show();
		}

		const response = await requestFn();

		return response.data;
	} finally {
		if (showLoading) {
			loadingManager.hide();
		}
	}
}

// Export typed HTTP methods
export const apiClient = {
	get: <T>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config),

	post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		api.post<T>(url, data, config),

	put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		api.put<T>(url, data, config),

	delete: <T>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config),

	// For file uploads
	postForm: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
		api.post<T>(url, formData, {
			...config,
			headers: {
				...config?.headers,
				"Content-Type": "multipart/form-data",
			},
		}),
};

export default api;
