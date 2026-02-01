import { OrchardType, DurianStatus } from "../utils/enum";

export { OrchardType, DurianStatus };

// Type aliases for backend string compatibility
// Backend sends types as string[] and status as string
export type OrchardTypeString = OrchardType | `${OrchardType}`;
export type DurianStatusString = DurianStatus | `${DurianStatus}`;

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

export interface OrchardFormData {
	name: string;
	description: string;
	history?: string;
	types?: OrchardTypeString[];
	status: DurianStatusString;
	lat: number;
	lng: number;
	images: string[];
	videos?: string[];
	address: string;
	phoneNumber?: string;
	socialMedia?: SocialMediaLinks;
	additionalCrops?: string[];
	accommodations?: Accommodation[];
	packages?: Package[];
}

export interface Orchard extends OrchardFormData {
	id: number;
	ownerId: string;
	createdAt?: string;
	updatedAt?: string;
}
