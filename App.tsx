import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MasterDataProvider } from "./context/MasterDataContext";
import { AlertProvider } from "./context/AlertContext";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { OrchardForm } from "./pages/OrchardForm";
import { PrivateRoute } from "./routes/PrivateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TestErrorPage } from "./pages/TestErrorPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
	return (
		<ThemeProvider>
			<MasterDataProvider>
				<AuthProvider>
					<AlertProvider>
						<HashRouter>
							<ErrorBoundary>
								<div className="h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-hidden">
									<Header />
									<main className="flex-grow overflow-hidden relative">
										<Routes>
											{/* Public Routes */}
											<Route element={<HomePage />} path="/" />
											<Route element={<Login />} path="/login" />
											<Route element={<TestErrorPage />} path="/test-error" />

											{/* Protected Owner Routes */}
											<Route element={<PrivateRoute />}>
												<Route element={<OwnerDashboard />} path="/owner" />
												<Route
													element={<OrchardForm />}
													path="/owner/add"
												/>
												<Route
													element={<OrchardForm />}
													path="/owner/edit/:id"
												/>
											</Route>

											{/* Catch all - Not Found */}
											<Route element={<NotFoundPage />} path="*" />
										</Routes>
									</main>
								</div>
							</ErrorBoundary>
						</HashRouter>
					</AlertProvider>
				</AuthProvider>
			</MasterDataProvider>
		</ThemeProvider>
	);
}

export default App;
