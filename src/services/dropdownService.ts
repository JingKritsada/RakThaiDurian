import type {
	CropOption,
	ServiceTypeResponse,
	StatusResponse,
} from "@/interfaces/dropdownInterface";

import { apiClient, apiRequest, type ApiOptions } from "@/services/api";
import { MOCK_SERVICE_TYPES, MOCK_STATUSES, MOCK_CROPS } from "@/utils/mock";
import loadingManager from "@/utils/loadingManager";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const mockWithDelay = <T>(data: T, options?: ApiOptions): Promise<T> => {
	if (!options?.skipGlobalLoading) loadingManager.getInstance().show();

	return new Promise((resolve) => {
		setTimeout(() => {
			if (!options?.skipGlobalLoading) loadingManager.getInstance().hide();
			resolve(data);
		}, 300);
	});
};

/**
 * Dropdown Service
 * Uses mock data by default. Set VITE_USE_MOCK=false to use real API endpoints.
 */
export default function dropdownService() {
	return {
		getServiceTypes: (options?: ApiOptions): Promise<ServiceTypeResponse[]> => {
			if (USE_MOCK) {
				return mockWithDelay([...MOCK_SERVICE_TYPES], options);
			}

			return apiRequest<ServiceTypeResponse[]>(
				() => apiClient.get("/data/service-types"),
				options
			);
		},

		getOrchardStatuses: (options?: ApiOptions): Promise<StatusResponse[]> => {
			if (USE_MOCK) {
				return mockWithDelay([...MOCK_STATUSES], options);
			}

			return apiRequest<StatusResponse[]>(() => apiClient.get("/data/statuses"), options);
		},

		getAdditionalCrops: (options?: ApiOptions): Promise<CropOption[]> => {
			if (USE_MOCK) {
				return mockWithDelay([...MOCK_CROPS], options);
			}

			return apiRequest<CropOption[]>(() => apiClient.get("/data/crops"), options);
		},
	};
}
