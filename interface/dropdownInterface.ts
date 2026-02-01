import { CropCategory } from "@/utils/enum";

export interface ServiceTypeResponse {
	id: string;
}

export interface ServiceTypeOption extends ServiceTypeResponse {
	label: string;
	icon: string; // Icon name as string
}

export interface StatusResponse {
	id: string;
}

export interface StatusOption extends StatusResponse {
	label: string;
	color: string; // Tailwind classes
	mapColor: string; // Hex code for map
}

export interface CropOption {
	id: string;
	value: string;
	label: string;
	category: CropCategory;
}
