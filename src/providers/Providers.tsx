import { type ReactNode } from "react";
import { HashRouter } from "react-router-dom";

import AuthProvider from "@/providers/AuthContext";
import ThemeProvider from "@/providers/ThemeContext";
import AlertProvider from "@/providers/AlertContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingProvider from "@/providers/LoadingContext";
import MasterDataProvider from "@/providers/MasterDataContext";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<AlertProvider>
				<MasterDataProvider>
					<HashRouter>
						<LoadingProvider>
							<AuthProvider>
								<ErrorBoundary>{children}</ErrorBoundary>
							</AuthProvider>
						</LoadingProvider>
					</HashRouter>
				</MasterDataProvider>
			</AlertProvider>
		</ThemeProvider>
	);
}
