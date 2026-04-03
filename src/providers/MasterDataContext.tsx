import type { OrchardType, DurianStatus } from "@/utils/enum";
import type { CropOption, ServiceTypeOption, StatusOption } from "@/interfaces/dropdownInterface";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

import dropdownService from "@/services/dropdownService";
import {
	ORCHARD_TYPE_LABELS,
	ORCHARD_TYPE_ICONS,
	STATUS_LABELS,
	STATUS_COLORS,
} from "@/utils/constants";

interface MasterDataContextType {
	serviceTypes: ServiceTypeOption[];
	statuses: StatusOption[];
	cropOptions: CropOption[];
	isLoading: boolean;
	getServiceType: (id: string) => ServiceTypeOption | undefined;
	getStatus: (id: string) => StatusOption | undefined;
	getCrop: (id: string) => CropOption | undefined;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export default function MasterDataProvider({ children }: { children: ReactNode }) {
	const [serviceTypes, setServiceTypes] = useState<ServiceTypeOption[]>([]);
	const [statuses, setStatuses] = useState<StatusOption[]>([]);
	const [cropOptions, setCropOptions] = useState<CropOption[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadMasterData = async () => {
			try {
				const [typesData, statusesData, cropsData] = await Promise.all([
					dropdownService().getServiceTypes(),
					dropdownService().getOrchardStatuses(),
					dropdownService().getAdditionalCrops(),
				]);

				const hydratedServiceTypes: ServiceTypeOption[] = typesData.map((item) => {
					const id = item.id as OrchardType;

					return {
						id: item.id,
						label: ORCHARD_TYPE_LABELS[id] || item.id,
						icon: ORCHARD_TYPE_ICONS[id] || "HelpCircle",
					};
				});

				const hydratedStatuses: StatusOption[] = statusesData.map((item) => {
					const id = item.id as DurianStatus;

					return {
						id: item.id,
						label: STATUS_LABELS[id] || item.id,
						color: STATUS_COLORS[id]?.tailwind || "bg-gray-500",
						mapColor: STATUS_COLORS[id]?.map || "#808080",
					};
				});

				setServiceTypes(hydratedServiceTypes);
				setStatuses(hydratedStatuses);
				setCropOptions(cropsData);
			} catch {
				// Failed to load master data
			} finally {
				setIsLoading(false);
			}
		};

		loadMasterData();
	}, []);

	const getServiceType = (id: string) => {
		const found = serviceTypes.find((t) => t.id === id);

		if (found) return found;

		const typeId = id as OrchardType;

		if (ORCHARD_TYPE_LABELS[typeId]) {
			return {
				id,
				label: ORCHARD_TYPE_LABELS[typeId],
				icon: ORCHARD_TYPE_ICONS[typeId] || "HelpCircle",
			};
		}

		return undefined;
	};
	const getStatus = (id: string) => {
		const found = statuses.find((s) => s.id === id);

		if (found) return found;

		// Fallback to local defined enum constants if API data missing
		const statusId = id as DurianStatus;

		if (STATUS_LABELS[statusId]) {
			return {
				id,
				label: STATUS_LABELS[statusId],
				color: STATUS_COLORS[statusId]?.tailwind || "bg-gray-500",
				mapColor: STATUS_COLORS[statusId]?.map || "#808080",
			};
		}

		return undefined;
	};
	const getCrop = (id: string) => cropOptions.find((c) => c.id === id);

	return (
		<MasterDataContext.Provider
			value={{
				serviceTypes,
				statuses,
				cropOptions,
				isLoading,
				getServiceType,
				getStatus,
				getCrop,
			}}
		>
			{children}
		</MasterDataContext.Provider>
	);
}

export const useMasterData = () => {
	const context = useContext(MasterDataContext);

	if (!context) throw new Error("useMasterData must be used within a MasterDataProvider");

	return context;
};
