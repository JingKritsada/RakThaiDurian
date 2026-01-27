import React, { createContext, useContext, useState, ReactNode } from "react";

import { User } from "../interface/userInterface";
import { userService } from "../services/userService";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (email: string, pass: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(() => userService.getCurrentUser());
	const [isLoading] = useState(false);

	const login = async (email: string, pass: string) => {
		const loggedInUser = await userService.login(email, pass);

		setUser(loggedInUser);
	};

	const logout = async () => {
		await userService.logout();
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
