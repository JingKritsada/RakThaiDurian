import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { loadingManager } from "../utils/loadingManager";

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

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
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

	useEffect(() => {
		// Optional: Trigger loading on route change if needed.
		// For now, we rely on data fetching in the new page triggering loading.
		// If instant feedback is needed before data fetch:
		// loadingManager.show();
		// setTimeout(() => loadingManager.hide(), 500); // Artificial delay or wait for page load
	}, [location]);

	const showLoading = () => loadingManager.show();
	const hideLoading = () => loadingManager.hide();

	return (
		<LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
			{children}
			{isLoading && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-lg transition-opacity">
					<div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-forest-500 dark:border-t-forest-400" />
						<p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
							กำลังโหลด...
						</p>
					</div>
				</div>
			)}
		</LoadingContext.Provider>
	);
};
