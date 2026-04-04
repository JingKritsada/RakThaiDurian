import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

import loadingManager from "@/utils/loadingManager";
import { Z_INDEX } from "@/utils/zIndex";

interface LoadingContextType {
	isLoading: boolean;
	showLoading: () => void;
	hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
	const context = useContext(LoadingContext);

	if (!context) {
		throw new Error("useLoading must be used within a LoadingProvider");
	}

	return context;
};

interface LoadingProviderProps {
	children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
	const [isLoading, setIsLoading] = useState(false);

	// Sync with LoadingManager
	useEffect(() => {
		const unsubscribe = loadingManager.subscribe((loading) => {
			setIsLoading(loading);
		});

		return unsubscribe;
	}, []);

	// Listen for route changes
	const location = useLocation();
	const prevLocation = React.useRef(location.pathname);

	useEffect(() => {
		// Only trigger loading if the pathname actually changes
		if (location.pathname !== prevLocation.current) {
			loadingManager.show();

			const timer = setTimeout(() => {
				loadingManager.hide();
			}, 200);

			prevLocation.current = location.pathname;

			return () => clearTimeout(timer);
		}
	}, [location]);

	const showLoading = () => loadingManager.show();
	const hideLoading = () => loadingManager.hide();

	return (
		<LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
			{children}
			{isLoading && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg transition-opacity"
					style={{ zIndex: Z_INDEX.globalLoading }}
				>
					<div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
						<div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-forest-500 dark:border-slate-700 dark:border-t-forest-400" />
						<p className="text-lg font-medium text-slate-600 dark:text-slate-300">
							กำลังโหลด...
						</p>
					</div>
				</div>
			)}
		</LoadingContext.Provider>
	);
}
