import type { Orchard } from "@/interfaces/orchardInterface";

import React,  { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Check, AlertTriangle, Clock, X } from "lucide-react";
import L from "leaflet";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
	Polyline,
} from "react-leaflet";

import { OrchardDetailView } from "./OrchardDetailView";

const ICON_COMPONENTS: Record<string, React.FC<any>> = {
	check: Check,
	alert: AlertTriangle,
	clock: Clock,
	x: X,
};

type PinStyle = { pin: string; circle: string; icon: string; glow: string };

const STATUS_STYLES: Record<string, PinStyle> = {
	available: { pin: "#16a34a", circle: "#dcfce7", icon: "#15803d", glow: "rgba(22,163,74,0.45)" },
	low:       { pin: "#d97706", circle: "#fef9c3", icon: "#92400e", glow: "rgba(217,119,6,0.45)" },
	reserved:  { pin: "#2563eb", circle: "#dbeafe", icon: "#1e40af", glow: "rgba(37,99,235,0.45)" },
	out:       { pin: "#6b7280", circle: "#f3f4f6", icon: "#374151", glow: "rgba(107,114,128,0.35)" },
};

const ROUTE_STYLE: PinStyle = {
	pin: "#7c3aed", circle: "#ede9fe", icon: "#4c1d95", glow: "rgba(124,58,237,0.5)",
};

const W = 52;
const H = 68;
const PIN_PATH = "M26,4 C14,4 4,14 4,26 C4,40 26,64 26,64 C26,64 48,40 48,26 C48,14 38,4 26,4 Z";

// Custom Icon for User Location (Blue Pulse Dot)
const userLocationIcon = L.divIcon({
	className: "bg-transparent border-none",
	html: `
		<div class="relative w-full h-full flex items-center justify-center">
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

			if (!offsetForMobile) {
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

	const getStatusIcon = (status: string, rIndex?: number): L.DivIcon => {
		const isRoute = rIndex !== undefined;
		const style   = isRoute ? ROUTE_STYLE : (STATUS_STYLES[status] ?? STATUS_STYLES["out"]);

		// Choose the icon path based on status
		let iconPathKey = "check";
		if (status === "low")      iconPathKey = "alert";
		if (status === "reserved") iconPathKey = "clock";
		if (status === "out")      iconPathKey = "x";
		const Icon = ICON_COMPONENTS[iconPathKey];

		const innerContent = isRoute
		?
			`<text
				x="26" y="25"
				text-anchor="middle" dominant-baseline="central"
				font-family="'Helvetica Neue', Arial, sans-serif"
				font-size="20" font-weight="800"
				fill="${style.icon}"
			>
				${rIndex! + 1}
			</text>`
		:
			renderToStaticMarkup(
				<Icon x="15" y="15" width="22" height="22" color={style.icon} strokeWidth={2.5} style={{ overflow: 'visible' }} />
			);

		const svgHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="${W}" height="${H}"
				viewBox="0 0 ${W} ${H}"
				style="
				display:block;
					filter:
						drop-shadow(0 4px 10px ${style.glow})
						drop-shadow(0 1px 4px rgba(0,0,0,0.28));
					overflow:visible;
				"
			>
				<path d="${PIN_PATH}" fill="${style.pin}"/>
				<path d="${PIN_PATH}" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>
				<ellipse cx="20" cy="17" rx="5.5" ry="8" fill="rgba(255,255,255,0.22)" transform="rotate(-22 20 17)"/>
				<circle cx="26" cy="26" r="16" fill="#ffffff"/>
				<circle cx="26" cy="26" r="13.5" fill="${style.circle}"/>
				<circle cx="26" cy="26" r="13.5" fill="none" stroke="${style.pin}" stroke-width="0.8" stroke-opacity="0.2"/>

				${innerContent}
			</svg>
		`;

		return L.divIcon({
			className:    "bg-transparent border-none",
			html:         svgHTML,
			iconSize:     [W, H],
			iconAnchor:   [W / 2, H],
			popupAnchor:  [0, -H],
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

	// Filter orchards with valid coordinates
	const validOrchards = orchards.filter(
		(o) => o.lat !== undefined && o.lng !== undefined && !isNaN(o.lat) && !isNaN(o.lng)
	);

	const selectedOrchard = validOrchards.find((o) => o.id === selectedOrchardId);
	const center = selectedOrchard
		? ([selectedOrchard.lat, selectedOrchard.lng] as [number, number])
		: undefined;

	// Calculate route positions
	const routePoints = routeIds
		.map((id) => validOrchards.find((o) => o.id === id))
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
					url="/osm-tiles/{z}/{x}/{y}.png"
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
					/>
				)}

				{validOrchards.map((orchard) => {
					const routeIndex = isRouteMode ? routeIds.indexOf(orchard.id) : -1;

					return (
						<OrchardMarker
							key={`orchard-marker-${orchard.id}`}
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
