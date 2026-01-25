import { OrchardType, DurianStatus } from "../utils/enum";

export { OrchardType, DurianStatus };

export interface SocialMediaLinks {
	line?: string;
	facebook?: string;
	instagram?: string;
	tiktok?: string;
	youtube?: string;
}

export interface Accommodation {
	id: string;
	name: string;
	price: number;
	quantity: number;
	images: string[];
}

export interface Package {
	id: string;
	name: string;
	price: number;
	duration: number; // hours
	includes: string;
	startDate: string; // ISO Date YYYY-MM-DD
	endDate: string; // ISO Date YYYY-MM-DD
	images: string[];
}

export interface Orchard {
	id: number;
	name: string;
	description: string;
	history?: string;
	types: OrchardType[];
	status: DurianStatus;
	lat: number;
	lng: number;
	images: string[];
	videos?: string[];
	ownerId: string;
	address: string;
	phoneNumber?: string;
	isMixedAgro?: boolean;
	additionalCrops?: string[];
	socialMedia?: SocialMediaLinks;
	hasAccommodation?: boolean;
	accommodations?: Accommodation[];
	hasPackage?: boolean;
	packages?: Package[];
}
