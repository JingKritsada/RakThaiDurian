import React, { createContext, useContext, useState, ReactNode } from "react";

import { User } from "../interface/userInterface";
import { userService } from "../services/userService";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (
		email: string,
		pass: string,
		options?: { skipGlobalLoading?: boolean }
	) => Promise<void>;
	logout: (options?: { skipGlobalLoading?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(() => userService.getCurrentUser());
	const [isLoading] = useState(false);

	const login = async (
		email: string,
		pass: string,
		options?: { skipGlobalLoading?: boolean }
	) => {
		const loggedInUser = await userService.login(email, pass, options);

		setUser(loggedInUser);
	};

	const logout = async (options?: { skipGlobalLoading?: boolean }) => {
		await userService.logout(options);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) throw new Error("useAuth must be used within a AuthProvider");

	return context;
};
