import { Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { HomePage } from "./pages/home/HomePage";
import { OrchardDetailPage } from "./pages/orchard/OrchardDetailPage";
import { Login } from "./pages/Login";
import { OrchardForm } from "./pages/orchard/OrchardForm";
import { PrivateRoute } from "./routes/PrivateRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Providers } from "./providers/Providers";

import ProfilePage from "@/pages/profile/ProfilePage";

function App() {
	return (
		<Providers>
			<div className="flex h-dvh flex-col overflow-hidden">
				<Header />
				<main className="relative grow overflow-hidden">
					<Routes>
						{/* Public Routes */}
						<Route element={<HomePage />} path="/" />
						<Route element={<OrchardDetailPage />} path="/orchard/:id" />
						<Route element={<Login />} path="/login" />

						{/* Protected Owner Routes */}
						<Route element={<PrivateRoute />}>
							<Route element={<ProfilePage />} path="/owner" />
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
