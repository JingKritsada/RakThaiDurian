import React, { useRef } from "react";
import { MapPin, Navigation, RotateCcw } from "lucide-react";
import L from "leaflet";

import { Orchard } from "@/interface/orchardInterface";
import { Button } from "@/components/Button";
import { OrchardMap } from "@/components/OrchardMap";
import { SocialLinks } from "@/components/SocialLinks";

interface OrchardLocationProps {
	orchard: Orchard;
}

export const OrchardLocation: React.FC<OrchardLocationProps> = ({ orchard }) => {
	const mapRef = useRef<L.Map | null>(null);

	return (
		<div className="sticky top-6 space-y-6">
			{/* Location Map */}
			<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
				<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
					<MapPin className="text-forest-600" /> ที่อยู่ของสวน
				</h2>

				<div className="space-y-6">
					<div className="flex items-start gap-3">
						<p className="text-slate-700 dark:text-slate-300 text-sm">
							{orchard.address}
						</p>
					</div>

					{orchard.lat !== undefined &&
						orchard.lng !== undefined &&
						!isNaN(orchard.lat) &&
						!isNaN(orchard.lng) && (
							<div className="h-[250px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
								<OrchardMap
									disablePopup
									orchards={[orchard]}
									selectedOrchardId={orchard.id}
									setMapRef={(map) => {
										mapRef.current = map;
									}}
								/>
								<div className="absolute bottom-4 right-4 flex gap-2">
									<Button
										aria-label="รีเซ็ตตำแหน่งแผนที่"
										className="bg-slate-700 hover:bg-slate-800 text-white !px-3 rounded-xl shadow-lg transition-transform hover:scale-105"
										title="รีเซ็ตตำแหน่งแผนที่"
										type="button"
										onClick={() => {
											if (mapRef.current && orchard.lat && orchard.lng) {
												mapRef.current.flyTo(
													[orchard.lat, orchard.lng],
													14,
													{ duration: 1 }
												);
											}
										}}
									>
										<RotateCcw size={18} />
									</Button>
									<a
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
										href={`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`}
										rel="noreferrer"
										target="_blank"
									>
										<Navigation size={18} /> นำทาง
									</a>
								</div>
							</div>
						)}
				</div>
			</section>

			{/* Social Media */}
			{orchard.socialMedia && (
				<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
					<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
						<MapPin className="text-blue-500" /> ช่องทางติดตาม
					</h2>
					<div className="-mx-2">
						<SocialLinks showUrl className="" links={orchard.socialMedia} />
					</div>
				</section>
			)}
		</div>
	);
};
