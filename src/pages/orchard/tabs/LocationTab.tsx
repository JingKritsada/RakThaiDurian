import type { OrchardFormData } from "@/interfaces/orchardInterface";

import React from "react";
import { MapPin, Locate } from "lucide-react";

import { Button } from "@/components/Button";
import { LocationPicker } from "@/components/LocationPicker";
import { TextAreaField } from "@/components/FormInputs";

interface LocationTabProps {
	formData: OrchardFormData;
	setFormData: React.Dispatch<React.SetStateAction<OrchardFormData>>;
	isLocating: boolean;
	handleSetCurrentLocation: () => void;
}

export const LocationTab: React.FC<LocationTabProps> = ({
	formData,
	setFormData,
	isLocating,
	handleSetCurrentLocation,
}) => {
	const handleLocationChange = (lat: number, lng: number) => {
		setFormData((prev) => ({ ...prev, lat, lng }));
	};

	return (
		<div className="animate-in slide-in-from-right-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm duration-300 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
			<h2 className="mt-1 mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
				<MapPin className="text-forest-600" /> ที่ตั้งและแผนที่
			</h2>

			<div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 dark:border-slate-700">
				<div>
					<TextAreaField
						icon={MapPin}
						label="ที่อยู่ / สถานที่ตั้ง (ข้อความ)"
						placeholder="บ้านเลขที่, หมู่, ตำบล, อำเภอ, จังหวัด..."
						rows={3}
						value={formData.address}
						onChange={(e) => setFormData({ ...formData, address: e.target.value })}
					/>
				</div>

				<div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
					<div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div className="block text-sm font-bold text-slate-700 dark:text-slate-300">
							ตำแหน่งพิกัดบนแผนที่ (GPS) <span className="text-red-500">*</span>
							<p className="mt-1 text-xs font-normal text-slate-500">
								แตะที่แผนที่เพื่อปักหมุดตำแหน่งสวนของคุณ
							</p>
						</div>

						<Button
							className="w-full rounded-lg text-forest-500 shadow-sm transition-all disabled:opacity-50 md:w-auto md:rounded-xl md:py-2 dark:text-forest-300"
							disabled={isLocating}
							isLoading={isLocating}
							size="sm"
							type="button"
							variant="outline"
							onClick={handleSetCurrentLocation}
						>
							{!isLocating && <Locate size={16} />}
							{isLocating ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
						</Button>
					</div>

					<div className="overflow-hidden rounded-xl shadow-sm">
						<LocationPicker
							lat={formData.lat}
							lng={formData.lng}
							onChange={handleLocationChange}
						/>
					</div>

					<div className="mt-3 flex gap-4 font-mono text-xs text-slate-500">
						<span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
							Latitude: {formData.lat ? formData.lat.toFixed(6) : "-"}
						</span>
						<span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
							Longitude: {formData.lng ? formData.lng.toFixed(6) : "-"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
