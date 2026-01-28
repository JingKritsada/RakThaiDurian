import { User } from "../interface/userInterface";
import { MOCK_OWNER } from "../utils/mock";
import { loadingManager } from "../utils/loadingManager";

export const userService = {
	login: (
		email: string,
		password: string,
		options?: { skipGlobalLoading?: boolean }
	): Promise<User> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (email === MOCK_OWNER.email && password === "123456") {
					// Store dummy token
					localStorage.setItem("durian_token", "mock_token_123");
					localStorage.setItem("durian_user", JSON.stringify(MOCK_OWNER));
					if (!options?.skipGlobalLoading) loadingManager.hide();
					resolve(MOCK_OWNER);
				} else {
					if (!options?.skipGlobalLoading) loadingManager.hide();
					reject(new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
				}
			}, 800);
		});
	},

	logout: (options?: { skipGlobalLoading?: boolean }): Promise<void> => {
		if (!options?.skipGlobalLoading) loadingManager.show();

		return new Promise((resolve) => {
			setTimeout(() => {
				localStorage.removeItem("durian_token");
				localStorage.removeItem("durian_user");
				if (!options?.skipGlobalLoading) loadingManager.hide();
				resolve();
			}, 300);
		});
	},

	getCurrentUser: (): User | null => {
		const userStr = localStorage.getItem("durian_user");

		try {
			return userStr ? JSON.parse(userStr) : null;
		} catch {
			localStorage.removeItem("durian_user");

			return null;
		}
	},
};
