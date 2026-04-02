import type { Orchard } from "@/interfaces/orchardInterface";
import type L from "leaflet";

import React, { useRef } from "react";
import { MapPin, Navigation, RotateCcw } from "lucide-react";

import Button from "@/components/Button";
import OrchardMap from "@/components/OrchardMap";
import SocialLinks from "@/components/SocialLinks";

interface OrchardLocationProps {
	orchard: Orchard;
}

export default function OrchardLocation({ orchard }: OrchardLocationProps) {
	const mapRef = useRef<L.Map | null>(null);

	return (
		<div className="sticky top-6 space-y-6">
			{/* Location Map */}
			<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">
					<MapPin className="text-forest-600" /> ที่อยู่ของสวน
				</h2>

				<div className="space-y-6">
					<div className="flex items-start gap-3">
						<p className="text-sm text-slate-700 dark:text-slate-300">
							{orchard.address}
						</p>
					</div>

					{orchard.lat !== undefined &&
						orchard.lng !== undefined &&
						!isNaN(orchard.lat) &&
						!isNaN(orchard.lng) && (
							<div className="group relative h-62.5 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
								<OrchardMap
									disablePopup
									orchards={[orchard]}
									selectedOrchardId={orchard.id}
									setMapRef={(map) => {
										mapRef.current = map;
									}}
								/>
								<div className="absolute right-4 bottom-4 flex gap-2">
									<Button
										aria-label="รีเซ็ตตำแหน่งแผนที่"
										className="border-none px-3! transition-transform hover:scale-105"
										size="md"
										title="รีเซ็ตตำแหน่งแผนที่"
										type="button"
										variant="secondary"
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

									<Button
										className="h-full bg-blue-600 hover:bg-blue-700"
										size="md"
										variant="primary"
										onClick={() =>
											window.open(
												`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`,
												"_blank",
												"noreferrer"
											)
										}
									>
										<Navigation size={16} strokeWidth={3} /> นำทาง
									</Button>
								</div>
							</div>
						)}
				</div>
			</section>

			{/* Social Media */}
			{orchard.socialMedia && (
				<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">
						<MapPin className="text-blue-500" /> ช่องทางติดตาม
					</h2>
					<div className="-mx-2">
						<SocialLinks showUrl className="" links={orchard.socialMedia} />
					</div>
				</section>
			)}
		</div>
	);
}
