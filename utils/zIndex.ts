/**
 * Centralized z-index values for consistent layering
 * ค่า z-index ทั้งหมดของ project อยู่ที่นี่
 */
export const Z_INDEX = {
	/** Map markers and controls */
	mapControls: 10,

	/** Sticky headers */
	header: 50,

	/** Lightbox overlay */
	lightbox: 100,

	/** Location picker attribution */
	locationAttribution: 200,

	/** Map route info panel */
	mapPanel: 500,

	/** Map control buttons */
	mapButtons: 1000,

	/** Mobile navigation overlay backdrop */
	mobileNavBackdrop: 1500,

	/** Mobile navigation header */
	mobileNavHeader: 2500,

	/** Filter modals */
	filterModal: 3000,

	/** Alert/Confirm modals (above lightbox) */
	alertModal: 3500,

	/** Global loading overlay */
	globalLoading: 9999,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
