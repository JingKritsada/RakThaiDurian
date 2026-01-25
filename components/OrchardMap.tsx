import React, { useEffect, useRef } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
	Polyline,
} from "react-leaflet";
import { Orchard } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";
import L from "leaflet";
import { Navigation, Phone, MapPin } from "lucide-react";

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
			map.locate({ setView: false, maxZoom: 13 })
				.on("locationfound", (e) => {
					onFound?.(e.latlng.lat, e.latlng.lng);
				})
				.on("locationerror", (e) => {
					console.debug("Initial location failed", e);
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
				target = [center[0] - 0.005, center[1]];
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
	const statusConfig = getStatus(orchard.status) || getStatus("available");

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
			position={[orchard.lat, orchard.lng]}
			icon={getStatusIcon(orchard.status, routeIndex)}
			eventHandlers={{
				click: (e) => {
					L.DomEvent.stopPropagation(e.originalEvent);
					if (onSelect) onSelect(orchard.id);
				},
			}}
		>
			{!disablePopup && (
				<Popup>
					<div className="p-1 min-w-[300px]">
						<h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
							{orchard.name}
						</h3>

						{orchard.images && orchard.images.length > 0 && (
							<div className="relative rounded-xl overflow-hidden mb-3 shadow-sm bg-slate-100 h-48 w-full">
								<div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full">
									{orchard.images.map((img, idx) => (
										<img
											key={idx}
											src={img}
											alt={`${orchard.name} - ${idx + 1}`}
											className="w-full h-full object-cover shrink-0 snap-center block"
											onLoad={handleImageLoad}
										/>
									))}
								</div>
								{orchard.images.length > 1 && (
									<div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
										{orchard.images.length} รูป
									</div>
								)}
							</div>
						)}

						<div className="mb-3">
							<span
								className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${statusConfig?.color || ""}`}
							>
								{statusConfig?.label || "Unknown"}
							</span>
						</div>

						<div className="flex items-start gap-1 text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
							<MapPin size={14} className="shrink-0 mt-0.5 text-forest-600" />
							{orchard.address}
						</div>

						{routeIndex === undefined && (
							<div className="grid grid-cols-2 gap-2 mt-2">
								{orchard.phoneNumber ? (
									<a
										href={`tel:${orchard.phoneNumber}`}
										className="flex items-center justify-center gap-1 bg-forest-800 hover:bg-forest-900 !text-white text-xs py-2.5 px-2 rounded-lg transition-colors font-medium shadow-sm"
									>
										<Phone size={14} className="!text-white" />
										โทรติดต่อ
									</a>
								) : (
									<span className="flex items-center justify-center gap-1 bg-slate-100 text-slate-400 text-xs py-2.5 px-2 rounded-lg cursor-not-allowed">
										<Phone size={14} />
										ไม่มีเบอร์
									</span>
								)}

								<a
									href={`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`}
									target="_blank"
									rel="noreferrer"
									className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 !text-white text-xs py-2.5 px-2 rounded-lg transition-colors font-medium shadow-sm"
								>
									<Navigation size={14} className="!text-white" />
									นำทาง
								</a>
							</div>
						)}
						{routeIndex !== undefined && (
							<div className="text-center bg-blue-50 text-blue-700 p-2 rounded-lg text-sm font-semibold">
								จุดแวะที่ {routeIndex + 1} ในเส้นทาง
							</div>
						)}
					</div>
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
				zoom={6}
				style={{ height: "100%", width: "100%" }}
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
					routePath={routePath}
					routePoints={routePoints}
					isRouteMode={isRouteMode}
				/>

				{isRouteMode && routePath && routePath.length > 0 && (
					<Polyline
						positions={routePath}
						pathOptions={{
							color: "#3b82f6",
							weight: 5,
							opacity: 0.8,
							lineCap: "round",
							lineJoin: "round",
						}}
					/>
				)}

				{/* User Location Marker */}
				{userLocation && (
					<Marker
						position={userLocation}
						icon={userLocationIcon}
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
							orchard={orchard}
							isSelected={selectedOrchardId === orchard.id}
							onSelect={onSelectOrchard}
							disablePopup={disablePopup}
							routeIndex={routeIndex > -1 ? routeIndex : undefined}
						/>
					);
				})}

				<MapUpdater
					center={center}
					offsetForMobile={disablePopup}
					isRouteMode={isRouteMode}
				/>
			</MapContainer>
		</div>
	);
};
