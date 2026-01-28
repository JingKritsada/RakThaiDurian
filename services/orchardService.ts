import { Orchard } from "../interface/orchardInterface";
import { MOCK_ORCHARDS as INITIAL_ORCHARDS } from "../utils/mock";
import { loadingManager } from "../utils/loadingManager";

// Use a local variable to simulate a database state that can be updated
let ORCHARDS_DB = [...INITIAL_ORCHARDS];

export const orchardService = {
	getOrchards: (options?: { skipGlobalLoading?: boolean }): Promise<Orchard[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve([...ORCHARDS_DB]);
			}, 600);
		});
	},

	getOrchardsByOwner: (
		ownerId: string,
		options?: { skipGlobalLoading?: boolean }
	): Promise<Orchard[]> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve(ORCHARDS_DB.filter((o) => o.ownerId === ownerId));
			}, 500);
		});
	},

	getOrchardById: (
		id: number,
		options?: { skipGlobalLoading?: boolean }
	): Promise<Orchard | undefined> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve(ORCHARDS_DB.find((o) => o.id === id));
			}, 400);
		});
	},

	addOrchard: (
		orchard: Omit<Orchard, "id">,
		options?: { skipGlobalLoading?: boolean }
	): Promise<Orchard> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				const newOrchard = { ...orchard, id: Date.now() };

				ORCHARDS_DB = [newOrchard, ...ORCHARDS_DB];
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve(newOrchard);
			}, 800);
		});
	},

	updateOrchard: (
		id: number,
		data: Partial<Orchard>,
		options?: { skipGlobalLoading?: boolean }
	): Promise<Orchard> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const index = ORCHARDS_DB.findIndex((o) => o.id === id);

				if (index !== -1) {
					ORCHARDS_DB[index] = { ...ORCHARDS_DB[index], ...data };
					if (!options?.skipGlobalLoading) loadingManager.hide();
					resolve(ORCHARDS_DB[index]);
				} else {
					if (!options?.skipGlobalLoading) loadingManager.hide();
					reject(new Error("Orchard not found"));
				}
			}, 800);
		});
	},

	deleteOrchard: (id: number, options?: { skipGlobalLoading?: boolean }): Promise<void> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				ORCHARDS_DB = ORCHARDS_DB.filter((o) => o.id !== id);
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve();
			}, 500);
		});
	},
};
