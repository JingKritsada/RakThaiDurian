/**
 * Centralized z-index values for consistent layering
 * ค่า z-index ทั้งหมดของ project อยู่ที่นี่
 */
export const Z_INDEX = {	
	/** Lightbox overlay */
	lightbox: 100,
	
	/** Location picker attribution */
	locationAttribution: 200,
	
	/** Map route info panel */
	mapPanel: 500,
	
	/** Map control buttons */
	mapButtons: 1000,
	
	/** Filter modals */
	filterModal: 2000,
	
	/** Mobile sheet backdrop */
	mobileSheetBackdrop: 3000,
	
	/** Mobile sheet */
	mobileSheet: 4000,

	/** Mobile header */
	mobileHeader: 5000,
	
	/** Mobile navigation overlay backdrop */
	mobileNavBackdrop: 6000,

	/** Mobile navigation header */
	mobileNavHeader: 7000,
	
	/** Alert/Confirm modals (above lightbox) */
	alertModal: 8000,

	/** Global loading overlay */
	globalLoading: 9999,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
