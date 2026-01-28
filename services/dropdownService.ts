import { ServiceTypeResponse, StatusResponse, CropOption } from "../interface/dropdownInterface";
import { MOCK_SERVICE_TYPES, MOCK_STATUSES, MOCK_CROPS } from "../utils/mock";
import { loadingManager } from "../utils/loadingManager";

export const dropdownService = {
	getServiceTypes: (options?: {
		skipGlobalLoading?: boolean;
	}): Promise<ServiceTypeResponse[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_SERVICE_TYPES]);
			}, 300);
		});
	},

	getOrchardStatuses: (options?: { skipGlobalLoading?: boolean }): Promise<StatusResponse[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_STATUSES]);
			}, 300);
		});
	},

	getAdditionalCrops: (options?: { skipGlobalLoading?: boolean }): Promise<CropOption[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...MOCK_CROPS]);
			}, 300);
		});
	},
};
