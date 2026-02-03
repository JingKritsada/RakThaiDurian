import { apiClient, apiRequest, ApiOptions } from "./api";

import {
	ImageFile,
	ImagePayload,
	ImageUploadResult,
	UploadResponse,
} from "@/interface/imageInterface";

/**
 * Convert base64 string to File object
 */
const base64ToFile = (dataurl: string, filename: string): File => {
	const arr = dataurl.split(",");
	const mimeMatch = arr[0].match(/:(.*?);/);
	const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	const file = new File([u8arr], filename, { type: mime });

	return file;
};

/**
 * Service for handling file uploads
 */
export const uploadService = {
	/**
	 * Upload a single file
	 * POST /uploads
	 * @param file - The file to upload
	 * @param options - API options
	 * @returns The URL of the uploaded file
	 */
	uploadFile: async (file: File, options?: ApiOptions): Promise<string> => {
		const formData = new FormData();

		formData.append("file", file);

		const response = await apiRequest<UploadResponse>(
			() => apiClient.postForm<UploadResponse>("/uploads", formData),
			options
		);

		return response.data.url;
	},

	/**
	 * Upload multiple files
	 * @param files - Array of files to upload
	 * @param options - API options
	 * @returns Array of uploaded file URLs
	 */
	uploadFiles: async (files: File[], options?: ApiOptions): Promise<string[]> => {
		const uploadPromises = files.map((file) => uploadService.uploadFile(file, options));

		return Promise.all(uploadPromises);
	},

	/**
	 * Process an image file - upload if File, return as-is if already a URL string
	 * @param image - Image file or URL string
	 * @param options - API options
	 * @returns The URL of the image
	 */
	processImage: async (image: ImageFile, options?: ApiOptions): Promise<string> => {
		if (typeof image === "string") {
			if (image.startsWith("data:")) {
				const mimeMatch = image.match(/:(.*?);/);
				const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
				const ext = mime.split("/")[1] || "jpg";
				const filename = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;

				const file = base64ToFile(image, filename);

				return uploadService.uploadFile(file, options);
			}

			// Already a URL, return as-is
			return image;
		}

		// Upload the file and return URL
		return uploadService.uploadFile(image, options);
	},

	/**
	 * Process multiple images - upload Files, keep existing URL strings
	 * @param images - Array of image files or URL strings
	 * @param options - API options
	 * @returns Array of image URLs
	 */
	processImages: async (images: ImageFile[], options?: ApiOptions): Promise<string[]> => {
		const processPromises = images.map((image) => uploadService.processImage(image, options));

		return Promise.all(processPromises);
	},

	/**
	 * Process all images in an ImagePayload
	 * Uploads new files and preserves existing URLs
	 * @param payload - The image payload containing all images to process
	 * @param options - API options
	 * @returns ImageUploadResult with all processed image URLs
	 */
	processImagePayload: async (
		payload: ImagePayload,
		options?: ApiOptions
	): Promise<ImageUploadResult> => {
		// Process orchard images
		const orchardImageUrls = await uploadService.processImages(payload.orchardImages, options);

		// Process package images
		const packageImageUrls: Record<string, string[]> = {};

		for (const [packageId, images] of Object.entries(payload.packageImages)) {
			packageImageUrls[packageId] = await uploadService.processImages(images, options);
		}

		// Process accommodation images
		const accommodationImageUrls: Record<string, string[]> = {};

		for (const [accommodationId, images] of Object.entries(payload.accommodationImages)) {
			accommodationImageUrls[accommodationId] = await uploadService.processImages(
				images,
				options
			);
		}

		return {
			orchardImageUrls,
			packageImageUrls,
			accommodationImageUrls,
		};
	},
};
