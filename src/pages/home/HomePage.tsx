import type { Orchard } from "@/interfaces/orchardInterface";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";

import { orchardService } from "@/services/orchardService";
import { getErrorMessage } from "@/services/api";
import { OrchardType } from "@/utils/enum";
import { useMasterData } from "@/providers/MasterDataContext";
import { useAlert } from "@/providers/AlertContext";
import { FilterSheet } from "@/components/FilterSheet";
import { calculateDistance } from "@/utils/geo";
import { useWindowSize } from "@/hooks/useWindowSize";
import { SearchBar } from "@/pages/home/SearchBar";
import { ListView } from "@/pages/home/ListView";
import { MapView } from "@/pages/home/MapView";

export const HomePage: React.FC = () => {
	const { getStatus } = useMasterData();
	const [searchParams, setSearchParams] = useSearchParams();
	const [orchards, setOrchards] = useState<Orchard[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<OrchardType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedOrchardId, setSelectedOrchardId] = useState<number | undefined>(() => {
		const selected = searchParams.get("selected");

		return selected ? parseInt(selected, 10) : undefined;
	});

	// Sort State
	const [sortBy, setSortBy] = useState<"default" | "nearest">("default");

	// Filter Modal State
	const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

	// Route Mode State
	const [isRouteMode, setIsRouteMode] = useState(false);
	const [routeIds, setRouteIds] = useState<number[]>([]);
	const [routePath, setRoutePath] = useState<[number, number][]>([]);
	const [routeStats, setRouteStats] = useState({ distance: 0, time: 0 });
	const [isRouting, setIsRouting] = useState(false);

	// Map Control State
	const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
	const [isLocating, setIsLocating] = useState(false);
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

	const hasAutoCentered = useRef(false);
	const [viewMode, setViewMode] = useState<"map" | "list">("map");
	const windowSize = useWindowSize();
	const isMobile = windowSize.width < 768;

	const showMapControls = !isMobile || viewMode === "map";

	const { showAlert } = useAlert();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await orchardService.getOrchards();

				setOrchards(data);
			} catch (error) {
				showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [showAlert]);

	// Clear search params when selected orchard changes and fly to orchard if coming from detail page
	useEffect(() => {
		const selectedParam = searchParams.get("selected");

		if (selectedParam && selectedOrchardId) {
			// Clear URL param after reading it
			setSearchParams({}, { replace: true });

			// Fly to selected orchard when data is loaded
			if (mapInstance && orchards.length > 0) {
				const orchard = orchards.find((o) => o.id === selectedOrchardId);

				if (orchard && orchard.lat && orchard.lng) {
					mapInstance.flyTo([orchard.lat, orchard.lng], 14, { duration: 1 });
				}
			}
		}
	}, [searchParams, setSearchParams, selectedOrchardId, mapInstance, orchards]);

	// Filter and Sort Logic
	const filteredOrchards = useMemo(() => {
		let result = orchards;

		// 1. Filter by Types
		if (selectedTypes.length > 0) {
			result = result.filter((orchard) =>
				selectedTypes.every((type) => orchard.types?.includes(type))
			);
		}

		// 2. Filter by Search
		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();

			result = result.filter(
				(o) =>
					o.name.toLowerCase().includes(lowerQuery) ||
					o.description?.toLowerCase().includes(lowerQuery) ||
					o.address?.toLowerCase().includes(lowerQuery)
			);
		}

		// 3. Sort
		if (sortBy === "nearest") {
			let referencePoint: [number, number] | null = userLocation;

			if (isRouteMode && routeIds.length > 0) {
				const lastId = routeIds[routeIds.length - 1];
				const lastOrchard = orchards.find((o) => o.id === lastId);

				if (lastOrchard) {
					referencePoint = [lastOrchard.lat, lastOrchard.lng];
				}
			}

			if (referencePoint) {
				result = [...result].sort((a, b) => {
					const distA = calculateDistance(
						referencePoint![0],
						referencePoint![1],
						a.lat,
						a.lng
					);
					const distB = calculateDistance(
						referencePoint![0],
						referencePoint![1],
						b.lat,
						b.lng
					);

					return distA - distB;
				});
			}
		}

		return result;
	}, [selectedTypes, searchQuery, orchards, sortBy, userLocation, isRouteMode, routeIds]);

	// Fetch Route from OSRM
	useEffect(() => {
		const fetchRoute = async () => {
			if (routeIds.length < 2) {
				setRoutePath([]);
				setRouteStats({ distance: 0, time: 0 });

				return;
			}

			setIsRouting(true);
			try {
				const selectedOrchards = routeIds
					.map((id) => orchards.find((o) => o.id === id))
					.filter((o): o is Orchard => !!o);

				const coordinates = selectedOrchards.map((o) => `${o.lng},${o.lat}`).join(";");

				const response = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
				);

				const data = await response.json();

				if (data.code === "Ok" && data.routes && data.routes.length > 0) {
					const route = data.routes[0];
					const latLngs: [number, number][] = route.geometry.coordinates.map(
						(coord: number[]) => [coord[1], coord[0]]
					);

					setRoutePath(latLngs);
					setRouteStats({
						distance: route.distance / 1000,
						time: route.duration / 60,
					});
				} else {
					setRoutePath([]);
				}
			} catch {
				// Error fetching route
			} finally {
				setIsRouting(false);
			}
		};

		const timer = setTimeout(() => {
			fetchRoute();
		}, 500);

		return () => clearTimeout(timer);
	}, [routeIds, orchards]);

	// Auto-center map on nearest orchard
	useEffect(() => {
		if (
			userLocation &&
			orchards.length > 0 &&
			!hasAutoCentered.current &&
			mapInstance &&
			!isRouteMode
		) {
			let minDist = Infinity;
			let nearest: Orchard | null = null as Orchard | null;

			orchards.forEach((o) => {
				const d = calculateDistance(userLocation[0], userLocation[1], o.lat, o.lng);

				if (d < minDist) {
					minDist = d;
					nearest = o;
				}
			});

			if (nearest && mapInstance) {
				mapInstance.flyTo([nearest.lat, nearest.lng], 10, {
					duration: 1.5,
				});
				hasAutoCentered.current = true;
			}
		}
	}, [userLocation, orchards, mapInstance, isRouteMode]);

	const handleOrchardClick = (id: number) => {
		if (isRouteMode) {
			setRouteIds((prev) => {
				if (prev.includes(id)) {
					return prev.filter((rid) => rid !== id);
				} else {
					return [...prev, id];
				}
			});
		} else {
			setSelectedOrchardId(id);
			if (isMobile) {
				setViewMode("map");
			}
		}
	};

	const switchViewMode = (mode: "map" | "list") => {
		setViewMode(mode);
		if (mode === "list" && !isRouteMode) {
			setSelectedOrchardId(undefined);
		}
	};

	const toggleRouteMode = () => {
		const newMode = !isRouteMode;

		setIsRouteMode(newMode);
		setSortBy("default");
		if (newMode) {
			setSelectedOrchardId(undefined);
			setRouteIds([]);
			setRoutePath([]);
			if (isMobile) setViewMode("map");
		} else {
			setRouteIds([]);
			setRoutePath([]);
		}
	};

	const handleLocate = () => {
		setSelectedOrchardId(undefined);
		if (!mapInstance) return;
		setIsLocating(true);
		mapInstance
			.locate({ enableHighAccuracy: true })
			.once("locationfound", function (e) {
				mapInstance.flyTo(e.latlng, 13);
				setUserLocation([e.latlng.lat, e.latlng.lng]);
				setIsLocating(false);
			})
			.once("locationerror", function () {
				alert("ไม่สามารถระบุตำแหน่งของคุณได้");
				setIsLocating(false);
			});
	};

	const handleUserLocationFound = (lat: number, lng: number) => {
		setUserLocation([lat, lng]);
	};

	// Logic for Applying Filter/Sort from Modal
	const handleApplyFilterSheet = (sort: "default" | "nearest", filters: OrchardType[]) => {
		// 1. Handle Sort
		if (sort === "nearest" && !userLocation && !isRouteMode) {
			handleLocate(); // Try to get location if not active
		}
		setSortBy(sort);

		// 2. Handle Filters
		setSelectedTypes(filters);
	};

	const openGoogleMapsRoute = () => {
		if (routeIds.length === 0) return;
		const selectedOrchards = routeIds
			.map((id) => orchards.find((o) => o.id === id))
			.filter((o): o is Orchard => !!o);

		if (selectedOrchards.length === 0) return;
		const baseUrl = "https://www.google.com/maps/dir";
		const startPoint = "/My+Location";
		const waypoints = selectedOrchards.map((o) => `/${o.lat},${o.lng}`).join("");

		window.open(`${baseUrl}${startPoint}${waypoints}`, "_blank");
	};

	const selectedOrchard: Orchard | undefined = orchards.find((o) => o.id === selectedOrchardId);
	const statusInfo = selectedOrchard ? (getStatus(selectedOrchard.status) ?? null) : null;

	// Calculate Active Filter Count for Badge
	const activeFilterCount = selectedTypes.length + (sortBy !== "default" ? 1 : 0);

	return (
		<div className="flex flex-col h-full overflow-hidden bg-slate-100 dark:bg-slate-950">
			{/* New Filter Sheet Modal */}
			<FilterSheet
				currentFilters={selectedTypes}
				currentSort={sortBy}
				isOpen={isFilterSheetOpen}
				onApply={handleApplyFilterSheet}
				onClose={() => setIsFilterSheetOpen(false)}
				onReset={() => {
					setSortBy("default");
					setSelectedTypes([]);
					setIsFilterSheetOpen(false);
				}}
			/>

			{/* Mobile Sticky Header */}
			<div className="flex-initial md:hidden z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-4 sm:px-6 shadow-sm">
				<SearchBar
					showViewToggle
					activeFilterCount={activeFilterCount}
					isRouteMode={isRouteMode}
					searchQuery={searchQuery}
					viewMode={viewMode}
					onOpenFilter={() => setIsFilterSheetOpen(true)}
					onSearchChange={setSearchQuery}
					onSwitchViewMode={switchViewMode}
				/>
			</div>

			<div className="flex grow overflow-hidden relative">
				{/* Sidebar with list */}
				<ListView
					activeFilterCount={activeFilterCount}
					filteredOrchards={filteredOrchards}
					isLoading={isLoading}
					isRouteMode={isRouteMode}
					routeIds={routeIds}
					searchQuery={searchQuery}
					selectedOrchardId={selectedOrchardId}
					viewMode={viewMode}
					onClearFilters={() => {
						setSearchQuery("");
						setSelectedTypes([]);
						setSortBy("default");
					}}
					onOpenFilter={() => setIsFilterSheetOpen(true)}
					onOrchardClick={handleOrchardClick}
					onSearchChange={setSearchQuery}
				/>

				{/* Map Area */}
				<MapView
					filteredOrchards={filteredOrchards}
					handleLocate={handleLocate}
					isLocating={isLocating}
					isMobile={isMobile}
					isRouteMode={isRouteMode}
					isRouting={isRouting}
					openGoogleMapsRoute={openGoogleMapsRoute}
					routeIds={routeIds}
					routePath={routePath}
					routeStats={routeStats}
					selectedOrchard={selectedOrchard}
					selectedOrchardId={selectedOrchardId}
					setMapRef={setMapInstance}
					showMapControls={showMapControls}
					statusInfo={statusInfo}
					toggleRouteMode={toggleRouteMode}
					userLocation={userLocation}
					onClearRoute={() => {
						setRouteIds([]);
						setRoutePath([]);
					}}
					onCloseDetail={() => setSelectedOrchardId(undefined)}
					onMapClick={() => !isRouteMode && setSelectedOrchardId(undefined)}
					onSelectOrchard={handleOrchardClick}
					onUserLocationFound={handleUserLocationFound}
				/>
			</div>
		</div>
	);
};
