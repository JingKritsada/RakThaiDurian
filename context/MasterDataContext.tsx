import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { CropOption, ServiceTypeOption, StatusOption } from "../interface/dropdownInterface";
import { dropdownService } from "../services/dropdownService";
import {
	ORCHARD_TYPE_LABELS,
	ORCHARD_TYPE_ICONS,
	STATUS_LABELS,
	STATUS_COLORS,
} from "../utils/constants";
import { OrchardType, DurianStatus } from "../utils/enum";

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

export const MasterDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [serviceTypes, setServiceTypes] = useState<ServiceTypeOption[]>([]);
	const [statuses, setStatuses] = useState<StatusOption[]>([]);
	const [cropOptions, setCropOptions] = useState<CropOption[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadMasterData = async () => {
			try {
				const [typesData, statusesData, cropsData] = await Promise.all([
					dropdownService.getServiceTypes(),
					dropdownService.getOrchardStatuses(),
					dropdownService.getAdditionalCrops(),
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

	const getServiceType = (id: string) => serviceTypes.find((t) => t.id === id);
	const getStatus = (id: string) => statuses.find((s) => s.id === id);
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
};

export const useMasterData = () => {
	const context = useContext(MasterDataContext);

	if (!context) throw new Error("useMasterData must be used within a MasterDataProvider");

	return context;
};
