/**
 * Centralized application configuration
 * All environment-based URLs and settings are defined here
 */
const CONFIG = {
	API_BASE_URL: import.meta.env.VITE_API_URL || "/api",
	UPLOADS_BASE_URL: import.meta.env.VITE_UPLOADS_BASE_URL || "",
	MAP_TILE_URL: import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org",
	OSRM_URL: "https://router.project-osrm.org",
} as const;

export default CONFIG;
