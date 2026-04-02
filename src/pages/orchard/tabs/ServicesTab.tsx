import type { OrchardFormData } from "@/interfaces/orchardInterface";

import React from "react";
import { Layers } from "lucide-react";

import { MultiSelectField, ToggleSwitch } from "@/components/FormInputs";
import AccommodationManager from "@/components/AccommodationManager";
import PackageManager from "@/components/PackageManager";

interface CropOption {
	id: string;
	label: string;
}

interface ServicesTabProps {
	formData: OrchardFormData;
	setFormData: React.Dispatch<React.SetStateAction<OrchardFormData>>;
	isMixedAgro: boolean;
	setIsMixedAgro: (val: boolean) => void;
	hasAccommodation: boolean;
	setHasAccommodation: (val: boolean) => void;
	hasPackage: boolean;
	setHasPackage: (val: boolean) => void;
	cropOptions: CropOption[];
}

export default function ServicesTab({
	formData,
	setFormData,
	isMixedAgro,
	setIsMixedAgro,
	hasAccommodation,
	setHasAccommodation,
	hasPackage,
	setHasPackage,
	cropOptions,
}: ServicesTabProps) {
	return (
		<div className="animate-in slide-in-from-right-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm duration-300 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
			<h2 className="mt-1 mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
				<Layers className="text-forest-600" /> บริการเสริมและสินค้าอื่น
			</h2>

			<div className="space-y-8">
				{/* Mixed Agriculture */}
				<div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-700">
					<ToggleSwitch
						checked={isMixedAgro}
						description="หากสวนของคุณมีการปลูกพืชผักหรือผลไม้อื่นๆ แซมในสวนทุเรียน"
						label="เป็นสวนเกษตรผสมผสาน"
						onChange={(val) => setIsMixedAgro(val)}
					/>

					{isMixedAgro && (
						<div className="animate-in slide-in-from-top-2 fade-in border-l-4 border-forest-100 pl-4 duration-300 dark:border-forest-900/50">
							<MultiSelectField
								label="พืชที่ปลูกเพิ่มเติม (ผัก/ผลไม้)"
								options={cropOptions}
								placeholder="เลือกพืชที่ปลูกในสวน..."
								value={formData.additionalCrops ?? []}
								onChange={(val) =>
									setFormData({
										...formData,
										additionalCrops: val,
									})
								}
							/>
							<p className="mt-2 ml-1 text-xs text-slate-500">
								* สามารถเลือกได้มากกว่า 1 รายการ
							</p>
						</div>
					)}
				</div>

				{/* Accommodation */}
				<div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-700">
					<ToggleSwitch
						checked={hasAccommodation}
						description="เปิดให้บริหารที่พักแก่นักท่องเที่ยว"
						label="มีบริการที่พัก/โฮมสเตย์"
						onChange={(val) => setHasAccommodation(val)}
					/>

					{hasAccommodation && (
						<div className="pl-0 sm:border-l-4 sm:border-forest-100 sm:pl-4 dark:sm:border-forest-900/50">
							<AccommodationManager
								accommodations={formData.accommodations ?? []}
								onChange={(updated) =>
									setFormData({
										...formData,
										accommodations: updated,
									})
								}
							/>
						</div>
					)}
				</div>

				{/* Packages */}
				<div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-700">
					<ToggleSwitch
						checked={hasPackage}
						description="กิจกรรมบุฟเฟต์, Workshop หรือแพ็กเกจท่องเที่ยว"
						label="มีแพ็กเกจท่องเที่ยว/กิจกรรม"
						onChange={(val) => setHasPackage(val)}
					/>

					{hasPackage && (
						<div className="pl-0 sm:border-l-4 sm:border-forest-100 sm:pl-4 dark:sm:border-forest-900/50">
							<PackageManager
								packages={formData.packages ?? []}
								onChange={(updated) =>
									setFormData({ ...formData, packages: updated })
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
