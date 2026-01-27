import { User } from "../interface/userInterface";
import { MOCK_OWNER } from "../utils/mock";

export const userService = {
	login: (email: string, password: string): Promise<User> => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (email === MOCK_OWNER.email && password === "123456") {
					// Store dummy token
					localStorage.setItem("durian_token", "mock_token_123");
					localStorage.setItem("durian_user", JSON.stringify(MOCK_OWNER));
					resolve(MOCK_OWNER);
				} else {
					reject(new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
				}
			}, 800);
		});
	},

	logout: (): Promise<void> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				localStorage.removeItem("durian_token");
				localStorage.removeItem("durian_user");
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
