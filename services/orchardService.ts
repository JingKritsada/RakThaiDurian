import { Orchard, Accommodation, Package } from "../interface/orchardInterface";
import { ImagePayload, ImageUploadResult } from "../interface/imageInterface";

import { apiClient, apiRequest, ApiOptions } from "./api";
import { uploadService } from "./uploadService";

import { OrchardsListResponse, OrchardResponse } from "@/interface/responseInterface";

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
	 * Create new orchard with image upload
	 * POST /orchards
	 * @param orchard - Orchard data without id and images
	 * @param imagePayload - Images to upload for orchard, packages, and accommodations
	 * @param options - API options
	 */
	addOrchard: async (
		orchard: Omit<Orchard, "id" | "images">,
		imagePayload: ImagePayload,
		options?: ApiOptions
	): Promise<Orchard> => {
		// Process and upload all images
		const imageResult = await uploadService.processImagePayload(imagePayload, options);

		// Attach uploaded image URLs to orchard data
		const orchardWithImages = orchardService.attachImagesToOrchard(orchard, imageResult);

		const response = await apiRequest<OrchardResponse>(
			() => apiClient.post<OrchardResponse>("/orchards", orchardWithImages),
			options
		);

		return response.data;
	},

	/**
	 * Update orchard with image upload
	 * PUT /orchards/{id}
	 * @param id - Orchard ID to update
	 * @param data - Partial orchard data (without images)
	 * @param imagePayload - Images to upload for orchard, packages, and accommodations
	 * @param options - API options
	 */
	updateOrchard: async (
		id: number,
		data: Omit<Partial<Orchard>, "images">,
		imagePayload: ImagePayload,
		options?: ApiOptions
	): Promise<Orchard> => {
		// Process and upload all images
		const imageResult = await uploadService.processImagePayload(imagePayload, options);

		// Attach uploaded image URLs to orchard data
		const dataWithImages = orchardService.attachImagesToOrchard(data, imageResult);

		const response = await apiRequest<OrchardResponse>(
			() => apiClient.put<OrchardResponse>(`/orchards/${id}`, dataWithImages),
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
	 * Helper function to attach uploaded image URLs to orchard data
	 * @param orchardData - Orchard data without images
	 * @param imageResult - Result from image upload containing all URLs
	 * @returns Orchard data with images attached
	 */
	attachImagesToOrchard: <T extends Partial<Omit<Orchard, "images">>>(
		orchardData: T,
		imageResult: ImageUploadResult
	): T & { images: string[]; accommodations?: Accommodation[]; packages?: Package[] } => {
		const result = {
			...orchardData,
			images: imageResult.orchardImageUrls,
		};

		// Attach accommodation images
		if (orchardData.accommodations && orchardData.accommodations.length > 0) {
			result.accommodations = orchardData.accommodations.map((accommodation) => ({
				...accommodation,
				images: imageResult.accommodationImageUrls[accommodation.id] || [],
			}));
		}

		// Attach package images
		if (orchardData.packages && orchardData.packages.length > 0) {
			result.packages = orchardData.packages.map((pkg) => ({
				...pkg,
				images: imageResult.packageImageUrls[pkg.id] || [],
			}));
		}

		return result;
	},
};
