import type { OrchardFormData } from "@/interfaces/orchardInterface";

import React from "react";
import { Home, Phone, AlignLeft, BookOpen, Info } from "lucide-react";

import { OrchardType, DurianStatus } from "@/utils/enum";
import { InputField, TextAreaField } from "@/components/FormInputs";

interface StatusOption {
	id: string;
	label: string;
	color: string;
}

interface ServiceTypeOption {
	id: string;
	label: string;
}

interface GeneralTabProps {
	formData: OrchardFormData;
	setFormData: React.Dispatch<React.SetStateAction<OrchardFormData>>;
	selectedTypes: OrchardType[];
	toggleType: (typeId: OrchardType) => void;
	statuses: StatusOption[];
	serviceTypes: ServiceTypeOption[];
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
	formData,
	setFormData,
	selectedTypes,
	toggleType,
	statuses,
	serviceTypes,
}) => {
	return (
		<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 animate-in slide-in-from-left-2 duration-300">
			<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-1 flex items-center gap-3">
				<Info className="text-forest-600" /> ข้อมูลพื้นฐาน
			</h2>

			<div className="space-y-8">
				{/* Status Section */}
				<div className="pt-6 border-t border-slate-100 dark:border-slate-700">
					<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
						สถานะผลผลิตปัจจุบัน
					</span>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{statuses.map((statusOption) => (
							<div
								key={statusOption.id}
								aria-checked={formData.status === statusOption.id}
								className={`
                                cursor-pointer rounded-xl border-2 p-4 flex items-center justify-center text-center transition-all h-full
                                ${
									formData.status === statusOption.id
										? `bg-white dark:bg-slate-800 border-forest-500 shadow-md transform`
										: "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
								}
                            `}
								role="radio"
								tabIndex={0}
								onClick={() =>
									setFormData({
										...formData,
										status: statusOption.id as DurianStatus,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setFormData({
											...formData,
											status: statusOption.id as DurianStatus,
										});
									}
								}}
							>
								<div className="flex flex-col items-center gap-2">
									<div
										className={`w-3 h-3 rounded-full ${statusOption.color.split(" ")[0]}`}
									/>
									<span
										className={`font-semibold text-sm ${formData.status === statusOption.id ? "text-forest-700 dark:text-forest-400" : "text-slate-600 dark:text-slate-400"}`}
									>
										{statusOption.label}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
					<InputField
						required
						icon={Home}
						label="ชื่อสวนทุเรียน"
						placeholder="เช่น สวนทุเรียนลุงสมหมาย"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>

					<InputField
						icon={Phone}
						label="เบอร์โทรศัพท์ติดต่อ"
						placeholder="08X-XXX-XXXX"
						type="tel"
						value={formData.phoneNumber}
						onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
					/>

					<div className="col-span-1 md:col-span-2">
						<TextAreaField
							icon={AlignLeft}
							label="รายละเอียดและจุดเด่น"
							placeholder="บรรยายความพิเศษของสวน พันธุ์ทุเรียนที่มี ฯลฯ"
							rows={3}
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>
					</div>

					<div className="col-span-1 md:col-span-2">
						<TextAreaField
							icon={BookOpen}
							label="ประวัติความเป็นมา (Story)"
							placeholder="เล่าเรื่องราวความเป็นมาของสวน แรงบันดาลใจ หรือจุดเริ่มต้น..."
							rows={3}
							value={formData.history}
							onChange={(e) => setFormData({ ...formData, history: e.target.value })}
						/>
					</div>
				</div>

				{/* Service Types */}
				<div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100 dark:border-slate-700">
					<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 ml-1">
						ประเภทบริการ (เลือกได้มากกว่า 1 ข้อ)
					</span>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{serviceTypes.map((type) => (
							<div
								key={type.id}
								aria-checked={selectedTypes.includes(type.id as OrchardType)}
								className={`
									cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 text-center transition-all
									${
										selectedTypes.includes(type.id as OrchardType)
											? "bg-forest-50 dark:bg-forest-900/30 border-forest-500 text-forest-800 dark:text-forest-300 shadow-sm"
											: "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-forest-200"
									}
								`}
								role="checkbox"
								tabIndex={0}
								onClick={() => toggleType(type.id as OrchardType)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										toggleType(type.id as OrchardType);
								}}
							>
								<span className="font-semibold text-sm">{type.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
