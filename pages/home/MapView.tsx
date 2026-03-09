import React from "react";
import { LocateFixed, Route } from "lucide-react";
import L from "leaflet";

import { Orchard } from "@/interface/orchardInterface";
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
		<div className="grow h-full w-full relative bg-slate-100 dark:bg-slate-800">
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
					className="absolute top-4 right-4 sm:right-6 flex flex-col gap-3 items-end"
					style={{ zIndex: Z_INDEX.mapButtons }}
				>
					<div className="flex items-center gap-3">
						<Button
							className={`h-12 px-5! shadow-lg border-none transition-all ${isRouteMode ? "bg-blue-600! hover:bg-blue-700!" : ""}`}
							variant={isRouteMode ? "primary" : "secondary"}
							onClick={toggleRouteMode}
						>
							<Route className="mr-2" size={20} />
							{isRouteMode ? "ปิดโหมดเส้นทาง" : "สร้างเส้นทาง"}
						</Button>

						<Button
							className="h-12 w-12 p-0! border-none"
							title="ตำแหน่งปัจจุบัน"
							variant="secondary"
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
					className="absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-500 border-t border-slate-100 dark:border-slate-800 max-h-[72vh] overflow-y-auto custom-scrollbar"
					style={{ zIndex: Z_INDEX.mapPanel }}
				>
					<OrchardDetailView
						orchard={selectedOrchard}
						variant="sheet"
						onClose={onCloseDetail}
					/>
				</div>
			)}
		</div>
	);
};
