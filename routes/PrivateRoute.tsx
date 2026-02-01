import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const PrivateRoute: React.FC = () => {
	const { user, isLoading, token } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-durian-500" />
			</div>
		);
	}

	return user && token ? <Outlet /> : <Navigate replace to="/login" />;
};
