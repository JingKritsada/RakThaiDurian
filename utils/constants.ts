import { DurianStatus, OrchardType } from "./enum";

export const ORCHARD_TYPE_LABELS: Record<OrchardType, string> = {
	[OrchardType.Sell]: "ซื้อผลผลิต",
	[OrchardType.Tour]: "เที่ยวชมสวน",
	[OrchardType.Cafe]: "คาเฟ่และอาหาร",
	[OrchardType.Stay]: "ที่พักโฮมสเตย์",
};

export const ORCHARD_TYPE_ICONS: Record<OrchardType, string> = {
	[OrchardType.Sell]: "ShoppingBag",
	[OrchardType.Tour]: "Map",
	[OrchardType.Cafe]: "Coffee",
	[OrchardType.Stay]: "Home",
};

export const STATUS_LABELS: Record<DurianStatus, string> = {
	[DurianStatus.Available]: "มีผลผลิตพร้อมขาย",
	[DurianStatus.Low]: "ผลผลิตใกล้หมด",
	[DurianStatus.Reserved]: "เปิดจองล่วงหน้า",
	[DurianStatus.Out]: "ปิดฤดูกาลชั่วคราว",
};

export const STATUS_COLORS: Record<DurianStatus, { tailwind: string; map: string }> = {
	[DurianStatus.Available]: {
		tailwind:
			"bg-green-500 text-forest-800 border-green-200 dark:bg-forest-900/50 dark:text-green-300 dark:border-forest-700",
		map: "#2F5233",
	},
	[DurianStatus.Low]: {
		tailwind:
			"bg-gold-500 text-yellow-800 border-gold-200 dark:bg-yellow-900/50 dark:text-gold-300 dark:border-yellow-700",
		map: "#F9C846",
	},
	[DurianStatus.Reserved]: {
		tailwind:
			"bg-blue-500 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
		map: "#3b82f6",
	},
	[DurianStatus.Out]: {
		tailwind:
			"bg-slate-500 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
		map: "#64748b",
	},
};
