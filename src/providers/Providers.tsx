import { ReactNode } from "react";
import { HashRouter } from "react-router-dom";

import { MasterDataProvider } from "./MasterDataContext";
import { ThemeProvider } from "./ThemeContext";
import { LoadingProvider } from "./LoadingContext";
import { AuthProvider } from "./AuthContext";
import { AlertProvider } from "./AlertContext";

import { ErrorBoundary } from "@/components/ErrorBoundary";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
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
};
