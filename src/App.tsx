import { Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { HomePage } from "./pages/home/HomePage";
import { OrchardDetailPage } from "./pages/orchard/OrchardDetailPage";
import { Login } from "./pages/Login";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { OrchardForm } from "./pages/orchard/OrchardForm";
import { PrivateRoute } from "./routes/PrivateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Providers } from "./providers/Providers";

function App() {
	return (
		<Providers>
			<div className="flex h-dvh flex-col overflow-hidden">
				<Header />
				<main className="grow overflow-hidden relative">
					<Routes>
						{/* Public Routes */}
						<Route element={<HomePage />} path="/" />
						<Route element={<OrchardDetailPage />} path="/orchard/:id" />
						<Route element={<Login />} path="/login" />

						{/* Protected Owner Routes */}
						<Route element={<PrivateRoute />}>
							<Route element={<OwnerDashboard />} path="/owner" />
							<Route element={<OrchardForm />} path="/owner/add" />
							<Route element={<OrchardForm />} path="/owner/edit/:id" />
						</Route>

						{/* Catch all - Not Found */}
						<Route element={<NotFoundPage />} path="*" />
					</Routes>
				</main>
			</div>
		</Providers>
	);
}

export default App;
