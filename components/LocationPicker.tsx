import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

interface LocationPickerProps {
	lat: number;
	lng: number;
	onChange: (lat: number, lng: number) => void;
}

// Marker component that updates when map is clicked
const MapEvents = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
	useMapEvents({
		click(e) {
			onChange(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
};

// Fix for map not rendering tiles correctly in some layouts
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

// Component to handle initial relocation to current user location
const CurrentLocationHandler = ({
	hasLocation,
	onFound,
}: {
	hasLocation: boolean;
	onFound: (lat: number, lng: number) => void;
}) => {
	const map = useMap();

	useEffect(() => {
		// Only try to locate if no location is set (default 0,0)
		if (!hasLocation) {
			map.locate().on("locationfound", function (e) {
				// map.flyTo(e.latlng, 13); // Let MapUpdater handle the view update
				onFound(e.latlng.lat, e.latlng.lng);
			});
		}
	}, [map, hasLocation, onFound]);

	return null;
};

// Component to update map view when coordinates change
const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
	const map = useMap();
	useEffect(() => {
		if (lat !== 0 && lng !== 0) {
			map.flyTo([lat, lng], 15);
		}
	}, [lat, lng, map]);
	return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng, onChange }) => {
	// Default center Thailand if no coordinates provided
	const center: [number, number] = lat && lng ? [lat, lng] : [13.7563, 100.5018];
	const hasValidLocation = !!(lat && lng);

	const customIcon = L.divIcon({
		className: "bg-transparent border-none",
		html: `<div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eab308" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
           </div>`,
		iconSize: [40, 40],
		iconAnchor: [20, 40],
	});

	return (
		<div className="h-64 w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 relative z-0">
			<MapContainer
				center={center}
				zoom={lat && lng ? 13 : 6}
				style={{ height: "100%", width: "100%" }}
			>
				<MapInvalidator />
				<MapUpdater lat={lat} lng={lng} />
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; OpenStreetMap"
				/>
				<MapEvents onChange={onChange} />
				<CurrentLocationHandler hasLocation={hasValidLocation} onFound={onChange} />

				{lat !== 0 && lng !== 0 && <Marker position={[lat, lng]} icon={customIcon} />}
			</MapContainer>
			<div className="absolute bottom-2 right-2 bg-white/80 dark:bg-slate-800/80 p-1 text-xs rounded z-[400] pointer-events-none">
				แตะที่แผนที่เพื่อปักหมุด
			</div>
		</div>
	);
};
