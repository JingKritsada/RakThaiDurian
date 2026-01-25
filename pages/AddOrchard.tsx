import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orchardService } from "../services/orchardService";
import { useAuth } from "../context/AuthContext";
import { OrchardType, DurianStatus } from "../interface/orchardInterface";
import { Button } from "../components/Button";
import { ArrowLeft, Save } from "lucide-react";

// Locally defined constants since they were removed from types.ts
const ORCHARD_TYPES = [
	{ id: "sell", label: "ซื้อผลผลิตหน้าสวน" },
	{ id: "tour", label: "ท่องเที่ยวชมสวน" },
	{ id: "cafe", label: "คาเฟ่และขนมหวาน" },
	{ id: "stay", label: "ที่พักโฮมสเตย์" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
	available: { label: "มีผลผลิตพร้อมจำหน่าย", color: "bg-green-100 text-green-800" },
	low: { label: "ผลผลิตใกล้หมด", color: "bg-yellow-100 text-yellow-800" },
	reserved: { label: "เปิดจองล่วงหน้า", color: "bg-blue-100 text-blue-800" },
	out: { label: "ปิดฤดูกาลชั่วคราว", color: "bg-slate-100 text-slate-600" },
};

export const AddOrchard: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		lat: "",
		lng: "",
		images: ["https://picsum.photos/400/300?random=10"],
		status: "available" as DurianStatus,
	});
	const [selectedTypes, setSelectedTypes] = useState<OrchardType[]>([]);

	const toggleType = (typeId: OrchardType) => {
		setSelectedTypes((prev) =>
			prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setIsLoading(true);

		try {
			await orchardService.addOrchard({
				name: formData.name,
				description: formData.description,
				address: formData.address,
				lat: parseFloat(formData.lat) || 0,
				lng: parseFloat(formData.lng) || 0,
				types: selectedTypes,
				ownerId: user.id,
				images: formData.images,
				status: formData.status,
			});
			navigate("/owner");
		} catch (error) {
			console.error(error);
			alert("เกิดข้อผิดพลาด");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<div className="mb-6">
				<Button
					variant="ghost"
					onClick={() => navigate("/owner")}
					className="pl-0 hover:bg-transparent hover:text-durian-600"
				>
					<ArrowLeft size={20} className="mr-1" /> กลับไปหน้าจัดการ
				</Button>
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
					เพิ่มสวนใหม่
				</h1>
			</div>

			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="col-span-2">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
								สถานะผลผลิตปัจจุบัน
							</label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{(Object.keys(STATUS_CONFIG) as DurianStatus[]).map((statusKey) => (
									<div
										key={statusKey}
										onClick={() =>
											setFormData({ ...formData, status: statusKey })
										}
										className={`
                            cursor-pointer rounded-lg border p-3 flex items-center justify-center text-center transition-all
                            ${
								formData.status === statusKey
									? `ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-800 ${STATUS_CONFIG[statusKey].color} border-transparent`
									: "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600"
							}
                        `}
									>
										<span className="font-semibold text-sm">
											{STATUS_CONFIG[statusKey].label}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								ชื่อสวน
							</label>
							<input
								required
								type="text"
								className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-durian-500 focus:ring-durian-500 py-2 px-3 border"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							/>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								รายละเอียด
							</label>
							<textarea
								required
								rows={3}
								className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-durian-500 focus:ring-durian-500 py-2 px-3 border"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								ที่อยู่
							</label>
							<input
								required
								type="text"
								className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-durian-500 focus:ring-durian-500 py-2 px-3 border"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								ละติจูด (Latitude)
							</label>
							<input
								type="number"
								step="any"
								className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-durian-500 focus:ring-durian-500 py-2 px-3 border"
								value={formData.lat}
								onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
								ลองจิจูด (Longitude)
							</label>
							<input
								type="number"
								step="any"
								className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-durian-500 focus:ring-durian-500 py-2 px-3 border"
								value={formData.lng}
								onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
							/>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
								บริการที่มี (เลือกได้หลายข้อ)
							</label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{ORCHARD_TYPES.map((type) => (
									<div
										key={type.id}
										onClick={() => toggleType(type.id as OrchardType)}
										className={`
                      cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center gap-2 text-center transition-all
                      ${
							selectedTypes.includes(type.id as OrchardType)
								? "bg-durian-50 dark:bg-durian-900/30 border-durian-500 text-durian-700 dark:text-durian-300"
								: "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-durian-300"
						}
                    `}
									>
										<span className="font-medium">{type.label}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="pt-4 flex justify-end">
						<Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
							<Save size={18} className="mr-2" /> บันทึกข้อมูล
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
