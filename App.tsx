import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
	return (
		<ThemeProvider>
			<MasterDataProvider>
				<AuthProvider>
					<AlertProvider>
						<HashRouter>
							<div className="h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-hidden">
								<Header />
								<main className="flex-grow overflow-hidden relative">
									<Routes>
										{/* Public Routes */}
										<Route path="/" element={<HomePage />} />
										<Route path="/login" element={<Login />} />

										{/* Protected Owner Routes */}
										<Route element={<PrivateRoute />}>
											<Route path="/owner" element={<OwnerDashboard />} />
											<Route path="/owner/add" element={<OrchardForm />} />
											<Route
												path="/owner/edit/:id"
												element={<OrchardForm />}
											/>
										</Route>

										{/* Catch all */}
										<Route path="*" element={<Navigate to="/" replace />} />
									</Routes>
								</main>
							</div>
						</HashRouter>
					</AlertProvider>
				</AuthProvider>
			</MasterDataProvider>
		</ThemeProvider>
	);
}

export default App;
