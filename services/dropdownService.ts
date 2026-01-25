import { ServiceTypeResponse, StatusResponse, CropOption } from "../interface/dropdownInterface";
import { MOCK_SERVICE_TYPES, MOCK_STATUSES, MOCK_CROPS } from "../utils/mock";

export const dropdownService = {
	getServiceTypes: (): Promise<ServiceTypeResponse[]> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([...MOCK_SERVICE_TYPES]);
			}, 300);
		});
	},

	getOrchardStatuses: (): Promise<StatusResponse[]> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([...MOCK_STATUSES]);
			}, 300);
		});
	},

	getAdditionalCrops: (): Promise<CropOption[]> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([...MOCK_CROPS]);
			}, 300);
		});
	},
};
