import { Orchard } from "./orchardInterface";
import { User } from "./userInterface";

export interface UserProfileResponse {
	success: boolean;
	code: number;
	message: string;
	error?: string | null;
	data: User;
	token: string;
}

// Types for API responses based on swagger
export interface ApiResponse<T> {
	success: boolean;
	code: number;
	message?: string;
	error?: string | null;
	data?: T;
}

export interface AuthResponse {
	success: boolean;
	code: number;
	message: string;
	error?: string | null;
	data: User;
	token: string;
}

// API response types based on swagger
export interface OrchardsListResponse {
	success: boolean;
	code: number;
	message: string;
	error: string | null;
	data: Orchard[];
}

export interface OrchardResponse {
	success: boolean;
	code: number;
	message: string;
	error: string | null;
	data: Orchard;
}

export interface UploadResponse {
	success: boolean;
	code: number;
	message: string;
	error: string | null;
	data: {
		url: string;
	};
}
