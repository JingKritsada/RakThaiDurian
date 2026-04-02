import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { LocateFixed, Route } from "lucide-react";
import L from "leaflet";

import { OrchardMap } from "@/components/OrchardMap";
import { OrchardDetailView } from "@/components/OrchardDetailView";
import { Button } from "@/components/Button";
import { Z_INDEX } from "@/utils/zIndex";
import { RoutePanel } from "@/pages/home/RoutePanel";

interface MapViewProps {
	filteredOrchards: Orchard[];
	selectedOrchardId: number | undefined;
	isRouteMode: boolean;
	routeIds: number[];
	routePath: [number, number][];
	routeStats: { distance: number; time: number };
	isRouting: boolean;
	userLocation: [number, number] | null;
	isLocating: boolean;
	isMobile: boolean;
	showMapControls: boolean;
	selectedOrchard: Orchard | undefined;
	statusInfo: { label: string; color: string } | null;
	onSelectOrchard: (id: number) => void;
	onMapClick: () => void;
	onUserLocationFound: (lat: number, lng: number) => void;
	setMapRef: (map: L.Map | null) => void;
	toggleRouteMode: () => void;
	handleLocate: () => void;
	openGoogleMapsRoute: () => void;
	onClearRoute: () => void;
	onCloseDetail: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
	filteredOrchards,
	selectedOrchardId,
	isRouteMode,
	routeIds,
	routePath,
	routeStats,
	isRouting,
	userLocation,
	isLocating,
	isMobile,
	showMapControls,
	selectedOrchard,
	statusInfo,
	onSelectOrchard,
	onMapClick,
	onUserLocationFound,
	setMapRef,
	toggleRouteMode,
	handleLocate,
	openGoogleMapsRoute,
	onClearRoute,
	onCloseDetail,
}) => {
	return (
		<>
			{isMobile && selectedOrchard && (
				<div
					aria-hidden="true"
					className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-md duration-200"
					style={{ zIndex: Z_INDEX.mobileSheetBackdrop }}
					onClick={onCloseDetail}
				/>
			)}

			<div className="relative h-full w-full grow bg-slate-100 dark:bg-slate-800">
				<OrchardMap
					disablePopup={isMobile || isRouteMode}
					isRouteMode={isRouteMode}
					orchards={filteredOrchards}
					routeIds={routeIds}
					routePath={routePath}
					selectedOrchardId={selectedOrchardId}
					setMapRef={setMapRef}
					userLocation={userLocation}
					onMapClick={onMapClick}
					onSelectOrchard={onSelectOrchard}
					onUserLocationFound={onUserLocationFound}
				/>

				{/* Top Right Controls */}
				{showMapControls && (
					<div
						className="absolute top-4 right-4 flex flex-col items-end gap-3 sm:right-6"
						style={{ zIndex: Z_INDEX.mapButtons }}
					>
						<div className="flex items-center gap-3">
							<Button
								className={`h-12 border-none px-5! shadow-lg transition-all ${isRouteMode ? "bg-blue-600! hover:bg-blue-700!" : ""}`}
								variant={isRouteMode ? "primary" : "secondary"}
								onClick={toggleRouteMode}
							>
								<Route className="mr-2" size={20} />
								{isRouteMode ? "ปิดโหมดเส้นทาง" : "สร้างเส้นทาง"}
							</Button>

							<Button
								className="h-12 w-12 border-none p-0!"
								title="ตำแหน่งปัจจุบัน"
								variant="secondary"
								onClick={handleLocate}
							>
								{isLocating ? (
									<div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-500 border-t-transparent" />
								) : (
									<LocateFixed size={28} />
								)}
							</Button>
						</div>
					</div>
				)}

				{/* Route Stats Panel */}
				{isRouteMode && (
					<RoutePanel
						isRouting={isRouting}
						openGoogleMapsRoute={openGoogleMapsRoute}
						routeIds={routeIds}
						routeStats={routeStats}
						showMapControls={showMapControls}
						onClearRoute={onClearRoute}
					/>
				)}

				{/* Mobile Bottom Sheet Detail */}
				{isMobile && !isRouteMode && selectedOrchard && statusInfo && (
					<div
						className="animate-in slide-in-from-bottom custom-scrollbar absolute right-0 bottom-0 left-0 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] duration-500 dark:border-slate-800"
						style={{ zIndex: Z_INDEX.mobileSheet }}
					>
						<OrchardDetailView
							orchard={selectedOrchard}
							variant="sheet"
							onClose={onCloseDetail}
						/>
					</div>
				)}
			</div>
		</>
	);
};
