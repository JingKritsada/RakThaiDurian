import React, { useEffect, useRef } from "react";
import L from "leaflet";

import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
	Polyline,
} from "../utils/leafletFix";
import { Orchard } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";

import { OrchardDetailView } from "./OrchardDetailView";

const ICONS = {
	check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
	alert: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
	clock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
	x: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
};

// Custom Icon for User Location (Blue Pulse Dot)
const userLocationIcon = L.divIcon({
	className: "bg-transparent border-none",
	html: `
		<div class="relative w-full h-full flex items-center justify-center">
		<div class="absolute w-full h-full bg-blue-500/30 rounded-full animate-ping"></div>
		<div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg ring-1 ring-black/5"></div>
		</div>
	`,
	iconSize: [32, 32],
	iconAnchor: [16, 16],
});

interface MapProps {
	orchards: Orchard[];
	selectedOrchardId?: number;
	onSelectOrchard?: (id: number) => void;
	disablePopup?: boolean;
	onMapClick?: () => void;
	isRouteMode?: boolean;
	routeIds?: number[];
	routePath?: [number, number][];
	setMapRef?: (map: L.Map) => void;
	userLocation?: [number, number] | null;
	onUserLocationFound?: (lat: number, lng: number) => void;
}

const MapInvalidator = () => {
	const map = useMap();

	useEffect(() => {
		const timer = setTimeout(() => {
			map.invalidateSize();
		}, 200);

		return () => clearTimeout(timer);
	}, [map]);

	return null;
};

const InitialUserLocator = ({ onFound }: { onFound?: (lat: number, lng: number) => void }) => {
	const map = useMap();
	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			// Change setView to false so we can control it manually based on nearest orchard
			map.locate({ setView: false, maxZoom: 13 }).on("locationfound", (e) => {
				onFound?.(e.latlng.lat, e.latlng.lng);
			});
		}
	}, [map, onFound]);

	return null;
};

// Component to expose Map instance to parent
const MapReferenceHandler = ({ setMapRef }: { setMapRef?: (map: L.Map) => void }) => {
	const map = useMap();

	useEffect(() => {
		if (setMapRef) {
			setMapRef(map);
		}
	}, [map, setMapRef]);

	return null;
};

const MapUpdater = ({
	center,
	offsetForMobile,
	isRouteMode,
}: {
	center?: [number, number];
	offsetForMobile?: boolean;
	isRouteMode: boolean;
}) => {
	const map = useMap();

	useEffect(() => {
		// Only auto-fly to specific center if NOT in route mode.
		// In route mode, bounds fitting is handled by RouteBoundsHandler
		if (!isRouteMode && center) {
			let target: [number, number] = center;

			if (offsetForMobile) {
				// Mobile: Shift center SOUTH so marker appears in TOP half (to avoid bottom sheet)
				target = [center[0] - 0.03, center[1]];
			} else {
				// Desktop: Shift center NORTH so marker appears in BOTTOM half (to accommodate popup above)
				target = [center[0] + 0.025, center[1]];
			}
			map.flyTo(target, 14, { duration: 1.5 });
		}
	}, [center, map, offsetForMobile, isRouteMode]);

	return null;
};

// Handles fitting the map to show all route points and the path
const RouteBoundsHandler = ({
	routePath,
	routePoints,
	isRouteMode,
}: {
	routePath?: [number, number][];
	routePoints: [number, number][];
	isRouteMode: boolean;
}) => {
	const map = useMap();

	useEffect(() => {
		if (!isRouteMode) return;

		let bounds: L.LatLngBounds | null = null;

		// 1. Add all orchard markers
		if (routePoints.length > 0) {
			bounds = L.latLngBounds(routePoints);
		}

		// 2. Add polyline path
		if (routePath && routePath.length > 0) {
			const pathBounds = L.polyline(routePath).getBounds();

			if (bounds) {
				bounds.extend(pathBounds);
			} else {
				bounds = pathBounds;
			}
		}

		if (bounds && bounds.isValid()) {
			map.fitBounds(bounds, { padding: [50, 50], duration: 1 });
		}
	}, [map, routePath, routePoints, isRouteMode]);

	return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick?: () => void }) => {
	useMapEvents({
		click: () => {
			onMapClick?.();
		},
	});

	return null;
};

interface OrchardMarkerProps {
	orchard: Orchard;
	isSelected: boolean;
	onSelect?: (id: number) => void;
	disablePopup?: boolean;
	routeIndex?: number;
}

const OrchardMarker: React.FC<OrchardMarkerProps> = ({
	orchard,
	isSelected,
	onSelect,
	disablePopup,
	routeIndex,
}) => {
	const markerRef = useRef<L.Marker>(null);
	const { getStatus } = useMasterData();

	useEffect(() => {
		if (markerRef.current) {
			if (isSelected && !disablePopup) {
				// Check if popup is already open to avoid flickering
				if (!markerRef.current.isPopupOpen()) {
					markerRef.current.openPopup();
				}
			} else {
				// Explicitly close popup if not selected.
				markerRef.current.closePopup();
			}
		}
	}, [isSelected, disablePopup]);

	// Handler to update popup layout when images load
	const handleImageLoad = () => {
		if (markerRef.current) {
			markerRef.current.getPopup()?.update();
		}
	};

	const getStatusIcon = (status: string, rIndex?: number) => {
		const config = getStatus(status) || { mapColor: "#555", label: "Unknown", color: "" };
		const color = rIndex !== undefined ? "#2563eb" : config.mapColor;

		let innerContent = "";

		if (rIndex !== undefined) {
			// Route Mode: Show Number
			innerContent = `<span style="color: white; font-weight: bold; font-size: 18px; transform: rotate(-45deg);">${rIndex + 1}</span>`;
		} else {
			// Normal Mode: Show Status Icon based on ID mapping to simple icon logic or just use check as fallback
			let svgIcon = ICONS.check;

			if (status === "low") svgIcon = ICONS.alert;
			if (status === "reserved") svgIcon = ICONS.clock;
			if (status === "out") svgIcon = ICONS.x;
			innerContent = `<div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">${svgIcon}</div>`;
		}

		const html = `
			<div style="
				background-color: ${color};
				width: 40px;
				height: 40px;
				border-radius: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4px 6px rgba(0,0,0,0.3);
				border: 2px solid white;
				position: relative;
				transform: rotate(45deg);
				transition: all 0.3s ease;
				${rIndex !== undefined ? "z-index: 1000;" : ""}
			">
				${innerContent}
			</div>
		`;

		return L.divIcon({
			className: "bg-transparent border-none group hover:z-50",
			html: html,
			iconSize: [40, 40],
			iconAnchor: [20, 20],
			popupAnchor: [0, -25],
		});
	};

	return (
		<Marker
			ref={markerRef}
			eventHandlers={{
				click: (e) => {
					L.DomEvent.stopPropagation(e.originalEvent);
					if (onSelect) onSelect(orchard.id);
				},
			}}
			icon={getStatusIcon(orchard.status, routeIndex)}
			position={[orchard.lat, orchard.lng]}
		>
			{!disablePopup && (
				<Popup className="custom-popup" closeButton={false} maxWidth={600} minWidth={600}>
					<OrchardDetailView
						orchard={orchard}
						variant="popup"
						onClose={() => markerRef.current?.closePopup()}
						onImageLoad={handleImageLoad}
					/>
				</Popup>
			)}
		</Marker>
	);
};

export const OrchardMap: React.FC<MapProps> = ({
	orchards,
	selectedOrchardId,
	onSelectOrchard,
	disablePopup = false,
	onMapClick,
	isRouteMode = false,
	routeIds = [],
	routePath,
	setMapRef,
	userLocation,
	onUserLocationFound,
}) => {
	const defaultCenter: [number, number] = [13.7563, 100.5018]; // Default to Bangkok

	const selectedOrchard = orchards.find((o) => o.id === selectedOrchardId);
	const center = selectedOrchard
		? ([selectedOrchard.lat, selectedOrchard.lng] as [number, number])
		: undefined;

	// Calculate route positions
	const routePoints = routeIds
		.map((id) => orchards.find((o) => o.id === id))
		.filter((o): o is Orchard => !!o)
		.map((o) => [o.lat, o.lng] as [number, number]);

	return (
		<div className="w-full h-full relative z-0">
			<MapContainer
				center={defaultCenter}
				style={{ height: "100%", width: "100%" }}
				zoom={6}
				zoomControl={false}
			>
				<MapInvalidator />
				<InitialUserLocator onFound={onUserLocationFound} />
				<MapReferenceHandler setMapRef={setMapRef} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<MapClickHandler onMapClick={onMapClick} />

				<RouteBoundsHandler
					isRouteMode={isRouteMode}
					routePath={routePath}
					routePoints={routePoints}
				/>

				{isRouteMode && routePath && routePath.length > 0 && (
					<Polyline
						pathOptions={{
							color: "#3b82f6",
							weight: 5,
							opacity: 0.8,
							lineCap: "round",
							lineJoin: "round",
						}}
						positions={routePath}
					/>
				)}

				{/* User Location Marker */}
				{userLocation && (
					<Marker
						icon={userLocationIcon}
						position={userLocation}
						zIndexOffset={1000} // Ensure it sits on top of other markers
					>
						<Popup autoClose={false}>
							<div className="text-center font-bold text-blue-600">ตำแหน่งของคุณ</div>
						</Popup>
					</Marker>
				)}

				{orchards.map((orchard) => {
					const routeIndex = isRouteMode ? routeIds.indexOf(orchard.id) : -1;

					return (
						<OrchardMarker
							key={orchard.id}
							disablePopup={disablePopup}
							isSelected={selectedOrchardId === orchard.id}
							orchard={orchard}
							routeIndex={routeIndex > -1 ? routeIndex : undefined}
							onSelect={onSelectOrchard}
						/>
					);
				})}

				<MapUpdater
					center={center}
					isRouteMode={isRouteMode}
					offsetForMobile={disablePopup}
				/>
			</MapContainer>
		</div>
	);
};
