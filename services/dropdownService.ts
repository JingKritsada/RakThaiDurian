import { CropOption, ServiceTypeResponse, StatusResponse } from "../interface/dropdownInterface";
import { MOCK_SERVICE_TYPES, MOCK_STATUSES, MOCK_CROPS } from "../utils/mock";
import { loadingManager } from "../utils/loadingManager";

import { ApiOptions } from "./api";

/**
 * Dropdown Service
 * Note: Backend doesn't have dropdown endpoints yet, using mock data
 * When backend implements these endpoints, replace with apiRequest calls
 */
export const dropdownService = {
	getServiceTypes: (options?: ApiOptions): Promise<ServiceTypeResponse[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_SERVICE_TYPES]);
			}, 300);
		});
	},

	getOrchardStatuses: (options?: ApiOptions): Promise<StatusResponse[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_STATUSES]);
			}, 300);
		});
	},

	getAdditionalCrops: (options?: ApiOptions): Promise<CropOption[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_CROPS]);
			}, 300);
		});
	},
};
