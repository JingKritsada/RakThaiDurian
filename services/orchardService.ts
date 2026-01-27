import { Orchard } from "../interface/orchardInterface";
import { MOCK_ORCHARDS as INITIAL_ORCHARDS } from "../utils/mock";

// Use a local variable to simulate a database state that can be updated
let ORCHARDS_DB = [...INITIAL_ORCHARDS];

export const orchardService = {
	getOrchards: (): Promise<Orchard[]> => {
		return new Promise((resolve) => {
			setTimeout(() => resolve([...ORCHARDS_DB]), 600);
		});
	},

	getOrchardsByOwner: (ownerId: string): Promise<Orchard[]> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(ORCHARDS_DB.filter((o) => o.ownerId === ownerId));
			}, 500);
		});
	},

	getOrchardById: (id: number): Promise<Orchard | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(ORCHARDS_DB.find((o) => o.id === id));
			}, 400);
		});
	},

	addOrchard: (orchard: Omit<Orchard, "id">): Promise<Orchard> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const newOrchard = { ...orchard, id: Date.now() };

				ORCHARDS_DB = [newOrchard, ...ORCHARDS_DB];
				resolve(newOrchard);
			}, 800);
		});
	},

	updateOrchard: (id: number, data: Partial<Orchard>): Promise<Orchard> => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const index = ORCHARDS_DB.findIndex((o) => o.id === id);

				if (index !== -1) {
					ORCHARDS_DB[index] = { ...ORCHARDS_DB[index], ...data };
					resolve(ORCHARDS_DB[index]);
				} else {
					reject(new Error("Orchard not found"));
				}
			}, 800);
		});
	},

	deleteOrchard: (id: number): Promise<void> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				ORCHARDS_DB = ORCHARDS_DB.filter((o) => o.id !== id);
				resolve();
			}, 500);
		});
	},
};
