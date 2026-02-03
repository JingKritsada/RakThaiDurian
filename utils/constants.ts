import { DurianStatus, OrchardType } from "./enum";

export const ORCHARD_TYPE_LABELS: Record<OrchardType, string> = {
	[OrchardType.SELL]: "ซื้อผลผลิต",
	[OrchardType.TOUR]: "เที่ยวชมสวน",
	[OrchardType.CAFE]: "คาเฟ่",
	[OrchardType.STAY]: "ที่พักโฮมสเตย์",
};

export const ORCHARD_TYPE_ICONS: Record<OrchardType, string> = {
	[OrchardType.SELL]: "ShoppingBag",
	[OrchardType.TOUR]: "Map",
	[OrchardType.CAFE]: "Coffee",
	[OrchardType.STAY]: "Home",
};

export const STATUS_LABELS: Record<DurianStatus, string> = {
	[DurianStatus.AVAILABLE]: "มีผลผลิตพร้อมขาย",
	[DurianStatus.LOW]: "ผลผลิตใกล้หมด",
	[DurianStatus.RESERVED]: "เปิดจองล่วงหน้า",
	[DurianStatus.OUT]: "ปิดฤดูกาลชั่วคราว",
};

export const STATUS_COLORS: Record<DurianStatus, { tailwind: string; map: string }> = {
	[DurianStatus.AVAILABLE]: {
		tailwind:
			"bg-green-400 text-forest-900 border-green-200 dark:bg-forest-900/50 dark:text-green-300 dark:border-forest-700",
		map: "#2F5233",
	},
	[DurianStatus.LOW]: {
		tailwind:
			"bg-gold-400 text-yellow-900 border-gold-200 dark:bg-yellow-900/50 dark:text-gold-300 dark:border-yellow-700",
		map: "#F9C846",
	},
	[DurianStatus.RESERVED]: {
		tailwind:
			"bg-blue-400 text-blue-900 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
		map: "#3b82f6",
	},
	[DurianStatus.OUT]: {
		tailwind:
			"bg-slate-400 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
		map: "#64748b",
	},
};

/**
 * Base URL for uploaded images from backend
 */
export const UPLOADS_BASE_URL = "https://platform.psru.ac.th:3022";

/**
 * Get full image URL from filename or partial path
 * @param imagePath - The image URL
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string): string => {
	if (!imagePath) return "";

	// Otherwise, prepend the base URL
	return `${UPLOADS_BASE_URL}${imagePath}`;
};
