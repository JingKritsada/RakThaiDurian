import React, { useEffect, useState, useMemo, useRef } from "react";
import { orchardService } from "../services/orchardService";
import { Orchard, OrchardType } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";
import { Card } from "../components/Card";
import { FilterSheet } from "../components/FilterSheet"; // New Component
import { OrchardMap } from "../components/OrchardMap";
import { SocialLinks } from "../components/SocialLinks";
import {
	Search,
	Map as MapIcon,
	List,
	X,
	Phone,
	MapPin,
	Navigation,
	Route,
	Flag,
	Timer,
	Image as ImageIcon,
	BookOpen,
	Video,
	PlayCircle,
	ExternalLink,
	Bed,
	Users,
	Banknote,
	Ticket,
	Clock,
	Calendar,
	Filter,
} from "lucide-react";
import { Button } from "../components/Button";
import L from "leaflet";

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

// Utility to check for YouTube links
const getYoutubeId = (url: string) => {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
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
	const [orchards, setOrchards] = useState<Orchard[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<OrchardType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedOrchardId, setSelectedOrchardId] = useState<number | undefined>(undefined);

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

	useEffect(() => {
		const fetchData = async () => {
			const data = await orchardService.getOrchards();
			setOrchards(data);
			setIsLoading(false);
		};
		fetchData();
	}, []);

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
			} catch (error) {
				console.error("Error fetching route:", error);
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

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "-";
		return new Date(dateStr).toLocaleDateString("th-TH", {
			day: "numeric",
			month: "short",
			year: "2-digit",
		});
	};

	const selectedOrchard = orchards.find((o) => o.id === selectedOrchardId);
	const statusInfo = selectedOrchard ? getStatus(selectedOrchard.status) : null;

	// Calculate Active Filter Count for Badge
	const activeFilterCount = selectedTypes.length + (sortBy !== "default" ? 1 : 0);

	return (
		<div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
			{/* New Filter Sheet Modal */}
			<FilterSheet
				isOpen={isFilterSheetOpen}
				onClose={() => setIsFilterSheetOpen(false)}
				currentSort={sortBy}
				currentFilters={selectedTypes}
				onApply={handleApplyFilterSheet}
				onReset={() => {
					setSortBy("default");
					setSelectedTypes([]);
					setIsFilterSheetOpen(false);
				}}
			/>

			{/* Mobile Sticky Header */}
			<div className="md:hidden z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 shadow-sm">
				<div className="flex gap-3 mb-1">
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-slate-400" />
						</div>
						<input
							type="text"
							placeholder="ค้นหารายชื่อสวนทุเรียน..."
							className="block w-full pl-11 pr-4 py-3 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							disabled={isRouteMode}
						/>
					</div>

					{/* New Combined Filter Button (Mobile) */}
					<button
						onClick={() => setIsFilterSheetOpen(true)}
						disabled={isRouteMode}
						className={`relative p-3 rounded-xl border transition-all ${isRouteMode ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50"}`}
					>
						<Filter
							size={20}
							className={activeFilterCount > 0 ? "text-forest-600" : "text-slate-500"}
						/>
						{activeFilterCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
								{activeFilterCount}
							</span>
						)}
					</button>
				</div>
			</div>

			<div className="flex flex-grow overflow-hidden relative">
				{/* Desktop Sidebar */}
				<div
					className={`
						absolute inset-0 z-10 bg-white dark:bg-slate-900 transition-transform duration-300 transform flex flex-col
					 	lg:relative lg:translate-x-0 lg:w-[600px] lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:z-0
						${viewMode === "list" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
					`}
				>
					<div className="hidden md:block p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm shrink-0">
						<div className="flex gap-3 mb-4">
							<div className="relative flex-grow">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Search className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="text"
									placeholder="ค้นหาชื่อสวน, สถานที่..."
									className="block w-full pl-11 pr-4 py-3.5 text-base border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 transition-shadow shadow-sm focus:shadow-md"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									disabled={isRouteMode}
								/>
							</div>

							{/* New Combined Filter Button (Desktop) */}
							<button
								onClick={() => setIsFilterSheetOpen(true)}
								disabled={isRouteMode}
								className={`relative px-4 py-3.5 rounded-xl border flex items-center gap-2 font-medium transition-all ${isRouteMode ? "opacity-50 cursor-not-allowed" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"}`}
							>
								<Filter
									size={18}
									className={activeFilterCount > 0 ? "text-forest-600" : ""}
								/>
								<span>ตัวกรอง</span>
								{activeFilterCount > 0 && (
									<span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-forest-600 text-[10px] font-bold text-white">
										{activeFilterCount}
									</span>
								)}
							</button>
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
										<Route size={20} className="mr-2" /> โหมดจัดเส้นทาง
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
										<Route size={16} className="mr-2" /> โหมดจัดเส้นทาง
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
									></div>
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
												onClick={() => handleOrchardClick(orchard.id)}
												className={`
                                    relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group
                                    ${
										isSelectedInRoute
											? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md"
											: "bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
									}
                                `}
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
														<div className="w-3 h-3 rounded-full bg-slate-400"></div>
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
											orchard={orchard}
											onClick={() => handleOrchardClick(orchard.id)}
											isSelected={selectedOrchardId === orchard.id}
										/>
									);
								})}
							</div>
						) : (
							<div className="text-center py-20">
								<div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
									<Search size={32} className="text-slate-400" />
								</div>
								<h3 className="text-lg font-medium text-slate-900 dark:text-white">
									ไม่พบข้อมูลตามเงื่อนไข
								</h3>
								<p className="text-slate-500 dark:text-slate-400">
									ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง
								</p>
								<Button
									variant="ghost"
									onClick={() => {
										setSearchQuery("");
										setSelectedTypes([]);
										setSortBy("default");
									}}
									className="mt-4"
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
						orchards={filteredOrchards}
						selectedOrchardId={selectedOrchardId}
						onSelectOrchard={handleOrchardClick}
						disablePopup={isMobile || isRouteMode}
						onMapClick={() => !isRouteMode && setSelectedOrchardId(undefined)}
						isRouteMode={isRouteMode}
						routeIds={routeIds}
						routePath={routePath}
						setMapRef={setMapInstance}
						userLocation={userLocation}
						onUserLocationFound={handleUserLocationFound}
					/>

					{/* Top Right Controls */}
					{showMapControls && (
						<div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3 items-end">
							<div className="flex items-center gap-3">
								<Button
									variant={isRouteMode ? "primary" : "secondary"}
									onClick={toggleRouteMode}
									className={`h-12 !px-5 shadow-lg border-0 transition-all ${isRouteMode ? "!bg-blue-600 hover:!bg-blue-700 ring-4 ring-blue-500/20" : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}
								>
									<Route size={20} className="mr-2" />
									{isRouteMode ? "ปิดโหมดเส้นทาง" : "สร้างเส้นทาง"}
								</Button>

								<button
									onClick={handleLocate}
									className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
									title="ตำแหน่งปัจจุบัน"
								>
									{isLocating ? (
										<div className="animate-spin rounded-full h-5 w-5 border-2 border-forest-500 border-t-transparent"></div>
									) : (
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle
												cx="12"
												cy="12"
												r="3"
												fill="currentColor"
												stroke="none"
											/>
											<circle cx="12" cy="12" r="7" strokeWidth="2.5" />
											<line x1="12" y1="2" x2="12" y2="5" strokeWidth="2.5" />
											<line
												x1="12"
												y1="19"
												x2="12"
												y2="22"
												strokeWidth="2.5"
											/>
											<line
												x1="19"
												y1="12"
												x2="22"
												y2="12"
												strokeWidth="2.5"
											/>
											<line x1="5" y1="12" x2="2" y2="12" strokeWidth="2.5" />
										</svg>
									)}
								</button>
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
												<div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
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
										variant="secondary"
										onClick={() => {
											setRouteIds([]);
											setRoutePath([]);
										}}
										className="flex-1 !py-3 text-sm font-medium"
									>
										ล้างค่า
									</Button>
									<Button
										onClick={openGoogleMapsRoute}
										className="flex-[2] !bg-blue-600 hover:!bg-blue-700 !py-3 text-sm shadow-lg shadow-blue-600/20"
										disabled={routeIds.length === 0}
									>
										<Navigation size={18} className="mr-2" />
										เริ่มนำทางด้วย Google Maps
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Mobile Floating View Switcher */}
					{!isRouteMode && (
						<div
							className={`lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[400] transition-all duration-500 ${selectedOrchardId ? "translate-y-32 opacity-0" : "translate-y-0 opacity-100"}`}
						>
							<div className="flex gap-2">
								<Button
									onClick={() =>
										switchViewMode(viewMode === "map" ? "list" : "map")
									}
									className="shadow-xl shadow-forest-900/30 rounded-full px-6 py-3 bg-forest-800 text-white whitespace-nowrap"
								>
									{viewMode === "map" ? (
										<>
											<List size={20} className="mr-2" /> แสดงรายชื่อ
										</>
									) : (
										<>
											<MapIcon size={20} className="mr-2" /> แสดงแผนที่
										</>
									)}
								</Button>
							</div>
						</div>
					)}

					{/* Mobile Bottom Sheet Detail */}
					{isMobile && !isRouteMode && selectedOrchard && statusInfo && (
						<div className="absolute bottom-0 left-0 right-0 z-[500] bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-500 border-t border-slate-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto custom-scrollbar">
							<div
								className="sticky top-0 bg-white dark:bg-slate-900 pt-2 pb-1 z-20 flex justify-center"
								onClick={() => setSelectedOrchardId(undefined)}
							>
								<div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-1"></div>
							</div>
							<div className="p-6 pt-2 pb-8">
								<div className="flex justify-between items-start mb-4">
									<div className="flex-1 mr-4 min-w-0">
										<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight truncate">
											{selectedOrchard.name}
										</h3>
										<span
											className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border whitespace-nowrap ${statusInfo.color}`}
										>
											{statusInfo.label}
										</span>
									</div>
									<button
										onClick={() => setSelectedOrchardId(undefined)}
										className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
									>
										<X size={24} />
									</button>
								</div>

								<div className="flex flex-col gap-4 mb-5">
									{/* Image Gallery in Bottom Sheet */}
									{selectedOrchard.images && selectedOrchard.images.length > 0 ? (
										<div className="relative rounded-2xl overflow-hidden bg-slate-200 h-48 w-full shadow-md">
											<div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
												{selectedOrchard.images.map((img, idx) => (
													<img
														key={idx}
														src={img}
														alt={`${selectedOrchard.name} - ${idx + 1}`}
														className="w-full h-full object-cover shrink-0 snap-center"
													/>
												))}
											</div>
											{selectedOrchard.images.length > 1 && (
												<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
													{selectedOrchard.images.length} รูป
												</div>
											)}
										</div>
									) : (
										<div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
											<ImageIcon size={48} className="opacity-50" />
										</div>
									)}

									<div className="flex flex-col justify-between py-0.5 min-w-0">
										<div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 text-sm mb-2">
											<MapPin
												size={16}
												className="shrink-0 mt-0.5 text-forest-600"
											/>
											<span className="line-clamp-2">
												{selectedOrchard.address}
											</span>
										</div>
										<div className="flex flex-wrap gap-1.5 mb-2">
											{selectedOrchard.types.map((t) => (
												<span
													key={t}
													className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg whitespace-nowrap"
												>
													{t}
												</span>
											))}
										</div>
										<p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
											{selectedOrchard.description}
										</p>
									</div>

									{/* History Section */}
									{selectedOrchard.history && (
										<div className="mb-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
											<div className="flex items-center gap-2 mb-2 text-forest-700 dark:text-forest-400">
												<BookOpen size={16} />
												<h4 className="font-bold text-sm">ประวัติสวน</h4>
											</div>
											<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
												{selectedOrchard.history}
											</p>
										</div>
									)}

									{/* Video Section */}
									{selectedOrchard.videos &&
										selectedOrchard.videos.length > 0 && (
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 mb-1">
													<Video size={16} />
													<h4 className="font-bold text-sm">
														บรรยากาศสวน
													</h4>
												</div>
												<div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
													{selectedOrchard.videos.map((videoUrl, idx) => {
														const ytId = getYoutubeId(videoUrl);
														return (
															<div
																key={idx}
																className="shrink-0 w-64 snap-center"
															>
																{ytId ? (
																	<div className="rounded-xl overflow-hidden aspect-video bg-black shadow-md">
																		<iframe
																			src={`https://www.youtube.com/embed/${ytId}`}
																			title={`Video ${idx}`}
																			className="w-full h-full"
																			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																			allowFullScreen
																		></iframe>
																	</div>
																) : (
																	<a
																		href={videoUrl}
																		target="_blank"
																		rel="noreferrer"
																		className="flex flex-col items-center justify-center gap-2 w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
																	>
																		<div className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center text-forest-600 dark:text-white shadow-sm group-hover:scale-110 transition-transform">
																			<PlayCircle size={24} />
																		</div>
																		<span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
																			เปิดคลิปวิดีโอ{" "}
																			<ExternalLink
																				size={10}
																			/>
																		</span>
																	</a>
																)}
															</div>
														);
													})}
												</div>
											</div>
										)}

									{/* Accommodation Section */}
									{selectedOrchard.hasAccommodation &&
										selectedOrchard.accommodations &&
										selectedOrchard.accommodations.length > 0 && (
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 mb-1">
													<Bed size={16} />
													<h4 className="font-bold text-sm">
														ที่พักให้บริการ
													</h4>
												</div>
												<div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x">
													{selectedOrchard.accommodations.map((item) => (
														<div
															key={item.id}
															className="shrink-0 w-64 snap-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
														>
															<div className="h-32 w-full bg-slate-100 dark:bg-slate-700">
																{item.images &&
																item.images.length > 0 ? (
																	<img
																		src={item.images[0]}
																		alt={item.name}
																		className="w-full h-full object-cover"
																	/>
																) : (
																	<div className="w-full h-full flex items-center justify-center text-slate-300">
																		<Bed size={32} />
																	</div>
																)}
															</div>
															<div className="p-3">
																<h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1 truncate">
																	{item.name}
																</h5>
																<div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
																	<span className="flex items-center gap-1">
																		<Users size={12} />{" "}
																		{item.quantity} ห้อง
																	</span>
																	<span className="flex items-center gap-1 font-semibold text-forest-700 dark:text-forest-400">
																		<Banknote size={12} /> ฿
																		{item.price.toLocaleString()}
																	</span>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

									{/* Package Section */}
									{selectedOrchard.hasPackage &&
										selectedOrchard.packages &&
										selectedOrchard.packages.length > 0 && (
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 mb-1">
													<Ticket size={16} />
													<h4 className="font-bold text-sm">
														แพ็กเกจและกิจกรรม
													</h4>
												</div>
												<div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x">
													{selectedOrchard.packages.map((item) => (
														<div
															key={item.id}
															className="shrink-0 w-64 snap-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col"
														>
															<div className="h-32 w-full bg-slate-100 dark:bg-slate-700 shrink-0">
																{item.images &&
																item.images.length > 0 ? (
																	<img
																		src={item.images[0]}
																		alt={item.name}
																		className="w-full h-full object-cover"
																	/>
																) : (
																	<div className="w-full h-full flex items-center justify-center text-slate-300">
																		<Ticket size={32} />
																	</div>
																)}
															</div>
															<div className="p-3 flex flex-col flex-grow">
																<h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
																	{item.name}
																</h5>

																<div className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">
																	{item.includes}
																</div>

																<div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
																	<div className="flex items-center justify-between text-xs">
																		<span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
																			<Clock size={12} />{" "}
																			{item.duration} ชม.
																		</span>
																		<span className="font-bold text-forest-700 dark:text-forest-400">
																			฿
																			{item.price.toLocaleString()}
																		</span>
																	</div>
																	<div className="flex items-center gap-1 text-[10px] text-slate-400">
																		<Calendar size={10} />
																		<span>
																			{formatDate(
																				item.startDate
																			)}{" "}
																			-{" "}
																			{formatDate(
																				item.endDate
																			)}
																		</span>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}
								</div>

								{/* Social Links for Mobile Bottom Sheet */}
								{selectedOrchard.socialMedia && (
									<div className="mb-5 flex flex-col items-center">
										<span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
											ช่องทางติดตาม
										</span>
										<SocialLinks
											links={selectedOrchard.socialMedia}
											itemClassName="w-10 h-10"
										/>
									</div>
								)}

								<div className="grid grid-cols-2 gap-4">
									{selectedOrchard.phoneNumber ? (
										<a
											href={`tel:${selectedOrchard.phoneNumber}`}
											className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-forest-900/20 whitespace-nowrap"
										>
											<Phone size={20} /> โทรติดต่อ
										</a>
									) : (
										<button
											disabled
											className="flex items-center justify-center gap-2 bg-slate-200 text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed whitespace-nowrap"
										>
											<Phone size={20} /> ไม่มีเบอร์
										</button>
									)}
									<a
										href={`https://www.google.com/maps/dir/?api=1&destination=${selectedOrchard.lat},${selectedOrchard.lng}`}
										target="_blank"
										rel="noreferrer"
										className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap"
									>
										<Navigation size={20} /> นำทาง
									</a>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
