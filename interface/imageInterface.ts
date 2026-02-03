/**
 * Interface for image-related types used in upload operations
 */

/**
 * Represents an image file to be uploaded
 * Can be either a File object (new upload) or a string URL (existing image)
 */
export type ImageFile = File | string;

/**
 * Payload interface for uploading images across different categories
 */
export interface ImagePayload {
	/** Main orchard images */
	orchardImages: ImageFile[];
	/** Package-related images, keyed by package ID */
	packageImages: Record<string, ImageFile[]>;
	/** Accommodation-related images, keyed by accommodation ID */
	accommodationImages: Record<string, ImageFile[]>;
}

/**
 * Result of image upload operations containing URLs
 */
export interface ImageUploadResult {
	/** URLs for uploaded orchard images */
	orchardImageUrls: string[];
	/** URLs for uploaded package images, keyed by package ID */
	packageImageUrls: Record<string, string[]>;
	/** URLs for uploaded accommodation images, keyed by accommodation ID */
	accommodationImageUrls: Record<string, string[]>;
}

/**
 * Response from a single file upload
 */
export interface UploadResponse {
	success: boolean;
	code: number;
	message: string;
	error: string | null;
	data: {
		url: string;
	};
}
