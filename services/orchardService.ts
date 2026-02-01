import { Orchard } from "../interface/orchardInterface";

import { apiClient, apiRequest, ApiOptions } from "./api";

import {
	OrchardsListResponse,
	OrchardResponse,
	UploadResponse,
} from "@/interface/responseInterface";

export const orchardService = {
	/**
	 * Get all orchards
	 * GET /orchards
	 */
	getOrchards: async (options?: ApiOptions): Promise<Orchard[]> => {
		const response = await apiRequest<OrchardsListResponse>(
			() => apiClient.get<OrchardsListResponse>("/orchards"),
			options
		);

		return response.data || [];
	},

	/**
	 * Get orchards by owner ID
	 * GET /orchards?ownerId=...
	 */
	getOrchardsByOwner: async (ownerId: string, options?: ApiOptions): Promise<Orchard[]> => {
		const response = await apiRequest<OrchardsListResponse>(
			() =>
				apiClient.get<OrchardsListResponse>("/orchards", {
					params: { ownerId },
				}),
			options
		);

		return response.data || [];
	},

	/**
	 * Get orchard by ID
	 * GET /orchards/{id}
	 */
	getOrchardById: async (id: number, options?: ApiOptions): Promise<Orchard | undefined> => {
		try {
			const response = await apiRequest<OrchardResponse>(
				() => apiClient.get<OrchardResponse>(`/orchards/${id}`),
				options
			);

			return response.data;
		} catch {
			// Return undefined if not found (404)
			return undefined;
		}
	},

	/**
	 * Create new orchard
	 * POST /orchards
	 */
	addOrchard: async (orchard: Omit<Orchard, "id">, options?: ApiOptions): Promise<Orchard> => {
		const response = await apiRequest<OrchardResponse>(
			() => apiClient.post<OrchardResponse>("/orchards", orchard),
			options
		);

		return response.data;
	},

	/**
	 * Update orchard
	 * PUT /orchards/{id}
	 */
	updateOrchard: async (
		id: number,
		data: Partial<Orchard>,
		options?: ApiOptions
	): Promise<Orchard> => {
		const response = await apiRequest<OrchardResponse>(
			() => apiClient.put<OrchardResponse>(`/orchards/${id}`, data),
			options
		);

		return response.data;
	},

	/**
	 * Delete orchard
	 * DELETE /orchards/{id}
	 */
	deleteOrchard: async (id: number, options?: ApiOptions): Promise<void> => {
		await apiRequest<void>(() => apiClient.delete<void>(`/orchards/${id}`), options);
	},

	/**
	 * Upload image
	 * POST /uploads
	 */
	uploadImage: async (file: File, options?: ApiOptions): Promise<string> => {
		const formData = new FormData();

		formData.append("file", file);

		const response = await apiRequest<UploadResponse>(
			() => apiClient.postForm<UploadResponse>("/uploads", formData),
			options
		);

		return response.data.url;
	},
};
