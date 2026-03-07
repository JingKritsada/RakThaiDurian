import React from "react";
import { MapPin, Locate } from "lucide-react";

import { OrchardFormData } from "@/interface/orchardInterface";
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
		<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-right-2 duration-300">
			<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
				<MapPin className="text-forest-600" /> ที่ตั้งและแผนที่
			</h2>

			<div className="grid grid-cols-1 gap-6">
				<div>
					<TextAreaField
						required
						icon={MapPin}
						label="ที่อยู่ / สถานที่ตั้ง (ข้อความ)"
						placeholder="บ้านเลขที่, หมู่, ตำบล, อำเภอ, จังหวัด..."
						rows={3}
						value={formData.address}
						onChange={(e) => setFormData({ ...formData, address: e.target.value })}
					/>
				</div>

				<div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
						<div className="block text-sm font-bold text-slate-700 dark:text-slate-300">
							ตำแหน่งพิกัดบนแผนที่ (GPS) <span className="text-red-500">*</span>
							<p className="text-xs font-normal text-slate-500 mt-1">
								แตะที่แผนที่เพื่อปักหมุดตำแหน่งสวนของคุณ
							</p>
						</div>

						<Button
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 text-forest-700 dark:text-forest-300 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 hover:border-forest-500 transition-all disabled:opacity-50"
							disabled={isLocating}
							isLoading={isLocating}
							type="button"
							variant="ghost"
							onClick={handleSetCurrentLocation}
						>
							{!isLocating && <Locate size={16} />}
							{isLocating ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
						</Button>
					</div>

					<div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm">
						<LocationPicker
							lat={formData.lat}
							lng={formData.lng}
							onChange={handleLocationChange}
						/>
					</div>

					<div className="flex gap-4 mt-3 px-1 text-xs text-slate-500 font-mono">
						<span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
							Latitude: {formData.lat ? formData.lat.toFixed(6) : "-"}
						</span>
						<span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
							Longitude: {formData.lng ? formData.lng.toFixed(6) : "-"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
