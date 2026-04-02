import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";

export default function PrivateRoute() {
	const { user, isLoading, token } = useAuth();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
				<div className="border-durian-500 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2" />
			</div>
		);
	}

	return user && token ? <Outlet /> : <Navigate replace to="/login" />;
}
