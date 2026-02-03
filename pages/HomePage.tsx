import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
	Search,
	Map as MapIcon,
	List,
	MapPin,
	Navigation,
	Route,
	Flag,
	Timer,
	Filter,
	LocateFixed,
} from "lucide-react";
import L from "leaflet";

import { orchardService } from "../services/orchardService";
import { getErrorMessage } from "../services/api";
import { Orchard, OrchardType } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";
import { useAlert } from "../context/AlertContext";
import { Card } from "../components/Card";
import { FilterSheet } from "../components/FilterSheet";
import { OrchardDetailView } from "../components/OrchardDetailView"; // New Component
import { OrchardMap } from "../components/OrchardMap";
import { Button } from "../components/Button";

import { InputField } from "@/components/FormInputs";

// Utility for Distance Calculation (Haversine Formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
	const R = 6371;
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;

	return d;
};

// Hook to detect window size
const useWindowSize = () => {
	const [size, setSize] = useState({ width: window.innerWidth });

	useEffect(() => {
		const handleResize = () => setSize({ width: window.innerWidth });

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
};

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
	const isMobile = windowSize.width < 1024;

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
				selectedTypes.every((type) => orchard.types.includes(type))
			);
		}

		// 2. Filter by Search
		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();

			result = result.filter(
				(o) =>
					o.name.toLowerCase().includes(lowerQuery) ||
					o.description.toLowerCase().includes(lowerQuery) ||
					o.address.toLowerCase().includes(lowerQuery)
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
			let nearest: Orchard | null = null;

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

	const selectedOrchard: Orchard = orchards.find((o) => o.id === selectedOrchardId);
	const statusInfo = selectedOrchard ? getStatus(selectedOrchard.status) : null;

	// Calculate Active Filter Count for Badge
	const activeFilterCount = selectedTypes.length + (sortBy !== "default" ? 1 : 0);

	return (
		<div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
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
			<div className="lg:hidden z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-3 shadow-sm">
				<div className="flex gap-3">
					<InputField
						className="w-full"
						disabled={isRouteMode}
						icon={Search}
						inputClassName={`w-full !h-full py-3.5 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none relative appearance-none`}
						placeholder="ค้นหารายชื่อสวนทุเรียน..."
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					{/* View Toggle */}
					<div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700 h-[50px] items-center shrink-0">
						<Button
							className={`w-auto h-full flex items-center justify-center rounded-lg transition-all !px-3 !min-h-0 border-0 ${viewMode === "list" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white" : "text-slate-400 bg-transparent"}`}
							title="แสดงรายชื่อ"
							variant="none"
							onClick={() => switchViewMode("list")}
						>
							<List size={20} />
						</Button>
						<Button
							className={`w-auto h-full flex items-center justify-center rounded-lg transition-all !px-3 !min-h-0 border-0 ${viewMode === "map" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white" : "text-slate-400 bg-transparent"}`}
							title="แสดงแผนที่"
							variant="none"
							onClick={() => switchViewMode("map")}
						>
							<MapIcon size={20} />
						</Button>
					</div>

					<Button
						className={`relative w-[50px] h-[50px] !p-0 flex items-center justify-center shrink-0 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none`}
						disabled={isRouteMode}
						variant="none"
						onClick={() => setIsFilterSheetOpen(true)}
					>
						<Filter
							className={activeFilterCount > 0 ? "text-forest-600" : "text-slate-500"}
							size={20}
						/>
						{activeFilterCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
								{activeFilterCount}
							</span>
						)}
					</Button>
				</div>
			</div>

			<div className="flex flex-grow overflow-hidden relative">
				{/* Desktop Sidebar */}
				<div
					className={`
						absolute inset-0 z-10 bg-white dark:bg-slate-900 transition-transform duration-300 transform flex flex-col
					 	lg:relative lg:translate-x-0 lg:w-[480px] xl:w-[600px] lg:shrink-0 lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:z-0
						${viewMode === "list" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
					`}
				>
					<div className="hidden md:block p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm shrink-0">
						<div className="flex gap-3 mb-4">
							<InputField
								className="w-full"
								disabled={isRouteMode}
								icon={Search}
								inputClassName={`w-full h-full py-3.5 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none relative appearance-none`}
								placeholder="ค้นหารายชื่อสวนทุเรียน..."
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>

							<Button
								className={`relative px-4 py-3.5 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none`}
								disabled={isRouteMode}
								variant="none"
								onClick={() => setIsFilterSheetOpen(true)}
							>
								<Filter
									className={
										activeFilterCount > 0 ? "text-forest-600" : "text-slate-500"
									}
									size={20}
								/>

								<span className="text-nowrap">ตัวกรอง</span>

								{activeFilterCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
										{activeFilterCount}
									</span>
								)}
							</Button>
						</div>

						{!isRouteMode ? (
							<>
								<div className="mt-2 flex justify-between items-center">
									<div className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
										ผลลัพธ์:{" "}
										<span className="text-forest-700 dark:text-forest-400">
											{filteredOrchards.length}
										</span>{" "}
										รายการ
									</div>
								</div>
							</>
						) : (
							<div>
								<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
									<h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
										<Route className="mr-2" size={20} /> โหมดจัดเส้นทาง
									</h3>
									<p className="text-sm text-blue-600 dark:text-blue-400">
										แตะเลือกสวนจากรายการหรือแผนที่เพื่อนับเป็นจุดแวะพักตามลำดับ
									</p>
								</div>
								<div className="flex justify-between items-center px-1">
									<div className="text-sm font-medium text-slate-500 dark:text-slate-400">
										{routeIds.length > 0
											? `เลือกแล้ว ${routeIds.length} แห่ง`
											: "ยังไม่ได้เลือกสวน"}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950">
						{/* Mobile Sort/Count Header */}
						<div className="md:hidden flex flex-col gap-2 mb-2">
							{isRouteMode && (
								<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
									<h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center">
										<Route className="mr-2" size={16} /> โหมดจัดเส้นทาง
									</h3>
									<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
										เลือกสวนเพื่อเพิ่มในเส้นทาง
									</p>
								</div>
							)}
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-slate-500 dark:text-slate-400">
									{isRouteMode
										? routeIds.length > 0
											? `เลือกแล้ว ${routeIds.length} แห่ง`
											: "ยังไม่เลือก"
										: `พบ ${filteredOrchards.length} สวน`}
								</span>
							</div>
						</div>

						{isLoading ? (
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"
									/>
								))}
							</div>
						) : filteredOrchards.length > 0 ? (
							<div className="space-y-4 pb-24 md:pb-4">
								{filteredOrchards.map((orchard) => {
									const isSelectedInRoute = routeIds.includes(orchard.id);
									const routeIndex = routeIds.indexOf(orchard.id);

									// In route mode, style differently
									if (isRouteMode) {
										return (
											<div
												key={orchard.id}
												className={`
													relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group
													${
														isSelectedInRoute
															? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md"
															: "bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
													}
												`}
												role="button"
												tabIndex={0}
												onClick={() => handleOrchardClick(orchard.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ")
														handleOrchardClick(orchard.id);
												}}
											>
												<div
													className={`
														w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 transition-colors
														${isSelectedInRoute ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600"}
													`}
												>
													{isSelectedInRoute ? (
														routeIndex + 1
													) : (
														<div className="w-3 h-3 rounded-full bg-slate-400" />
													)}
												</div>
												<div className="min-w-0 flex-1">
													<h4 className="font-bold text-slate-900 dark:text-white truncate">
														{orchard.name}
													</h4>
													<div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
														<MapPin size={12} /> {orchard.address}
													</div>
												</div>
												{!isSelectedInRoute && (
													<div className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
														เลือก
													</div>
												)}
											</div>
										);
									}

									return (
										<Card
											key={orchard.id}
											isSelected={selectedOrchardId === orchard.id}
											orchard={orchard}
											onClick={() => handleOrchardClick(orchard.id)}
										/>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col items-center text-center py-20">
								<div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
									<Search className="text-slate-400" size={32} />
								</div>
								<h3 className="text-lg font-medium text-slate-900 dark:text-white">
									ไม่พบข้อมูลตามเงื่อนไข
								</h3>
								<p className="text-slate-500 dark:text-slate-400">
									ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง
								</p>
								<Button
									className="mt-4"
									variant="ghost"
									onClick={() => {
										setSearchQuery("");
										setSelectedTypes([]);
										setSortBy("default");
									}}
								>
									ล้างตัวกรองทั้งหมด
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Map Area */}
				<div className="flex-grow h-full w-full relative bg-slate-100 dark:bg-slate-800">
					<OrchardMap
						disablePopup={isMobile || isRouteMode}
						isRouteMode={isRouteMode}
						orchards={filteredOrchards}
						routeIds={routeIds}
						routePath={routePath}
						selectedOrchardId={selectedOrchardId}
						setMapRef={setMapInstance}
						userLocation={userLocation}
						onMapClick={() => !isRouteMode && setSelectedOrchardId(undefined)}
						onSelectOrchard={handleOrchardClick}
						onUserLocationFound={handleUserLocationFound}
					/>

					{/* Top Right Controls */}
					{showMapControls && (
						<div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3 items-end">
							<div className="flex items-center gap-3">
								<Button
									className={`h-12 !px-5 shadow-lg border-0 transition-all ${isRouteMode ? "!bg-blue-600 hover:!bg-blue-700 ring-4 ring-blue-500/20" : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}
									variant={isRouteMode ? "primary" : "secondary"}
									onClick={toggleRouteMode}
								>
									<Route className="mr-2" size={20} />
									{isRouteMode ? "ปิดโหมดเส้นทาง" : "สร้างเส้นทาง"}
								</Button>

								<Button
									className="!p-0 h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors p-0 !min-h-0"
									title="ตำแหน่งปัจจุบัน"
									variant="none"
									onClick={handleLocate}
								>
									{isLocating ? (
										<div className="animate-spin rounded-full h-5 w-5 border-2 border-forest-500 border-t-transparent" />
									) : (
										<LocateFixed size={28} />
									)}
								</Button>
							</div>
						</div>
					)}

					{/* Route Stats Panel */}
					{isRouteMode && routeIds.length > 0 && showMapControls && (
						<div className="absolute bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[420px] z-[500]">
							<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
								<div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
									<div>
										<h3 className="font-bold text-slate-900 dark:text-white flex items-center text-lg">
											<Flag className="w-5 h-5 mr-2 text-blue-500 fill-blue-500" />
											ทริปของคุณ
										</h3>
										<div className="text-xs text-slate-500 mt-1 pl-7">
											{routeIds.length} จุดแวะพัก
										</div>
									</div>
									<div className="text-right">
										{isRouting ? (
											<div className="flex items-center gap-2 text-sm text-slate-400">
												<div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
												กำลังคำนวณ...
											</div>
										) : (
											<>
												<div className="flex items-center justify-end gap-2 font-bold text-slate-900 dark:text-white text-lg">
													<Timer className="w-5 h-5 text-forest-600" />
													<span>
														{Math.floor(routeStats.time / 60) > 0
															? `${Math.floor(routeStats.time / 60)} ชม. `
															: ""}
														{Math.round(routeStats.time % 60)} นาที
													</span>
												</div>
												<div className="text-xs text-slate-500 mt-1">
													ระยะทางรวม {routeStats.distance.toFixed(1)} กม.
												</div>
											</>
										)}
									</div>
								</div>
								<div className="flex gap-3">
									<Button
										className="flex-1 !py-3 text-sm font-medium"
										variant="secondary"
										onClick={() => {
											setRouteIds([]);
											setRoutePath([]);
										}}
									>
										ล้างค่า
									</Button>
									<Button
										className="flex-[2] !bg-blue-600 hover:!bg-blue-700 !py-3 text-sm shadow-lg shadow-blue-600/20"
										disabled={routeIds.length === 0}
										onClick={openGoogleMapsRoute}
									>
										<Navigation className="mr-2" size={18} />
										นำทางด้วย Google Maps
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Mobile Floating View Switcher - REMOVED */}
					{!isRouteMode && null}

					{/* Mobile Bottom Sheet Detail */}
					{isMobile && !isRouteMode && selectedOrchard && statusInfo && (
						<div className="absolute bottom-0 left-0 right-0 z-[500] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-500 border-t border-slate-100 dark:border-slate-800 max-h-[72vh] overflow-y-auto custom-scrollbar">
							<OrchardDetailView
								orchard={selectedOrchard}
								variant="sheet"
								onClose={() => setSelectedOrchardId(undefined)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
