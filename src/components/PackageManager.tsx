import type { Package } from "@/interfaces/orchardInterface";

import React, { useState, useRef } from "react";
import {
	Plus,
	Trash2,
	Ticket,
	Banknote,
	Clock,
	Calendar,
	X,
	Upload,
	CheckCircle,
	Edit2,
} from "lucide-react";

import Button from "@/components/Button";
import { InputField, TextAreaField } from "@/components/FormInputs";
import { useAlert } from "@/providers/AlertContext";
import { getImageUrl } from "@/utils/constants";

interface PackageManagerProps {
	packages: Package[];
	onChange: (packages: Package[]) => void;
}

export default function PackageManager({ packages, onChange }: PackageManagerProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isAdding, setIsAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const { showAlert, showConfirm } = useAlert();

	// Temporary state for new item (numeric fields as strings to allow empty/placeholder)
	const [newItem, setNewItem] = useState({
		name: "",
		price: "",
		duration: "",
		includes: "",
		startDate: "",
		endDate: "",
		images: [] as string[],
	});

	const handleSave = () => {
		const priceNum = parseFloat(newItem.price);
		const durationNum = parseFloat(newItem.duration);

		if (
			!newItem.name ||
			isNaN(priceNum) ||
			priceNum <= 0 ||
			!newItem.startDate ||
			!newItem.endDate
		) {
			showAlert(
				"ข้อมูลไม่ครบถ้วน",
				"กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, ราคา, วันที่)",
				"warning"
			);

			return;
		}

		if (new Date(newItem.startDate) > new Date(newItem.endDate)) {
			showAlert("วันที่ไม่ถูกต้อง", "วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด", "warning");

			return;
		}

		const itemData: Package = {
			// eslint-disable-next-line react-hooks/purity
			id: editingId || Date.now().toString(),
			name: newItem.name,
			price: priceNum,
			duration: isNaN(durationNum) ? 1 : durationNum,
			includes: newItem.includes,
			startDate: newItem.startDate,
			endDate: newItem.endDate,
			images: newItem.images,
		};

		if (editingId) {
			onChange(packages.map((item) => (item.id === editingId ? itemData : item)));
			showAlert("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
		} else {
			onChange([...packages, itemData]);
		}

		resetForm();
	};

	const handleEdit = (item: Package) => {
		setNewItem({
			name: item.name,
			price: item.price.toString(),
			duration: item.duration.toString(),
			includes: item.includes,
			startDate: item.startDate,
			endDate: item.endDate,
			images: [...item.images],
		});
		setEditingId(item.id);
		setIsAdding(true);
	};

	const resetForm = () => {
		setNewItem({
			name: "",
			price: "",
			duration: "",
			includes: "",
			startDate: "",
			endDate: "",
			images: [],
		});
		setIsAdding(false);
		setEditingId(null);
	};

	const handleDelete = (id: string) => {
		showConfirm(
			"ยืนยันการลบ",
			"คุณต้องการลบข้อมูลแพ็กเกจนี้ใช่หรือไม่?",
			() => {
				onChange(packages.filter((item) => item.id !== id));
				if (editingId === id) resetForm();
			},
			"warning",
			"ลบข้อมูล"
		);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files) return;

		const MAX_SIZE_MB = 10;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

		Array.from(files).forEach((file: File) => {
			if (file.size > MAX_SIZE_BYTES) {
				showAlert(
					"ไฟล์ขนาดใหญ่เกินไป",
					`ไฟล์ ${file.name} มีขนาดใหญ่เกิน ${MAX_SIZE_MB}MB`,
					"warning"
				);

				return;
			}

			const reader = new FileReader();

			reader.readAsDataURL(file);
			reader.onload = () => {
				if (reader.result && typeof reader.result === "string") {
					setNewItem((prev) => ({
						...prev,
						images: [...prev.images, reader.result as string],
					}));
				}
			};
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeNewItemImage = (index: number) => {
		setNewItem((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "-";

		return new Date(dateStr).toLocaleDateString("th-TH", {
			day: "numeric",
			month: "short",
			year: "2-digit",
		});
	};

	const formatNumberOnBlur = (field: "price" | "duration") => {
		const val = parseFloat(newItem[field]);

		if (!isNaN(val)) {
			setNewItem((prev) => ({ ...prev, [field]: val.toString() }));
		}
	};

	return (
		<div className="animate-in slide-in-from-top-2 fade-in space-y-4 duration-300">
			{/* List of Existing Packages */}
			{packages.length > 0 && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{packages.map((item) => (
						<div
							key={item.id}
							className={`group relative flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-slate-800 ${editingId === item.id ? "border-forest-500 ring-2 ring-forest-100 dark:ring-forest-900" : "border-slate-200 dark:border-slate-700"} `}
						>
							<div className="flex gap-4 pr-20">
								<div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
									{item.images.length > 0 ? (
										<img
											alt={item.name}
											className="h-full w-full object-cover"
											src={getImageUrl(item.images[0])}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-slate-400">
											<Ticket size={24} />
										</div>
									)}
								</div>
								<div className="min-w-0 grow">
									<h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
										{item.name}
									</h4>
									<div className="mt-1 flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
										<span className="flex items-center gap-1 font-semibold text-forest-600 dark:text-forest-400">
											<Banknote size={14} /> ฿{item.price.toLocaleString()} /
											ท่าน
										</span>
										<span className="flex items-center gap-1">
											<Clock size={14} /> ระยะเวลา {item.duration} ชม.
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
								<Calendar className="shrink-0" size={12} />
								<span>
									{formatDate(item.startDate)} - {formatDate(item.endDate)}
								</span>
							</div>

							<div className="absolute top-2 right-2 flex gap-0">
								<Button
									className="p-3! dark:hover:bg-slate-900"
									title="แก้ไข"
									type="button"
									variant="ghost"
									onClick={() => handleEdit(item)}
								>
									<Edit2 size={16} />
								</Button>
								<Button
									className="p-3! dark:hover:bg-slate-900"
									title="ลบ"
									type="button"
									variant="ghost"
									onClick={() => handleDelete(item.id)}
								>
									<Trash2 size={16} />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Add/Edit Section */}
			{!isAdding ? (
				<Button
					className="w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
					size="md"
					type="button"
					variant="ghost"
					onClick={() => {
						resetForm();
						setIsAdding(true);
					}}
				>
					<Plus size={20} /> เพิ่มแพ็กเกจ / กิจกรรม
				</Button>
			) : (
				<div className="animate-in zoom-in-95 rounded-xl border border-slate-200 bg-slate-50 p-6 duration-200 dark:border-slate-700 dark:bg-slate-900/50">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
							{editingId ? (
								<>
									<Edit2 className="text-forest-600" size={18} />{" "}
									แก้ไขข้อมูลแพ็กเกจ
								</>
							) : (
								<>
									<Plus className="text-forest-600" size={18} />{" "}
									เพิ่มข้อมูลแพ็กเกจ
								</>
							)}
						</h4>
						<Button className="p-3!" type="button" variant="ghost" onClick={resetForm}>
							<X size={20} />
						</Button>
					</div>

					<div className="space-y-4">
						<InputField
							required
							icon={Ticket}
							label="ชื่อกิจกรรม"
							placeholder="เช่น บุฟเฟต์ทุเรียนอิ่มไม่อั้น, Workshop ทำทุเรียนกวน"
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
						/>

						<div className="grid grid-cols-2 gap-4">
							<InputField
								required
								icon={Banknote}
								label="ราคาต่อคน (บาท)"
								placeholder="0"
								type="number"
								value={newItem.price}
								onBlur={() => formatNumberOnBlur("price")}
								onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
							/>
							<InputField
								icon={Clock}
								label="ระยะเวลา (ชั่วโมง)"
								placeholder="1"
								type="number"
								value={newItem.duration}
								onBlur={() => formatNumberOnBlur("duration")}
								onChange={(e) =>
									setNewItem({ ...newItem, duration: e.target.value })
								}
							/>
						</div>

						<TextAreaField
							icon={CheckCircle}
							label="สิ่งที่ได้รับ (Includes)"
							placeholder="รายละเอียดสิ่งที่รวมในแพ็กเกจ..."
							rows={3}
							value={newItem.includes}
							onChange={(e) => setNewItem({ ...newItem, includes: e.target.value })}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<InputField
								required
								icon={Calendar}
								label="เริ่มวันที่"
								type="date"
								value={newItem.startDate}
								onChange={(e) =>
									setNewItem({ ...newItem, startDate: e.target.value })
								}
							/>
							<InputField
								required
								icon={Calendar}
								label="ถึงวันที่"
								type="date"
								value={newItem.endDate}
								onChange={(e) =>
									setNewItem({ ...newItem, endDate: e.target.value })
								}
							/>
						</div>

						<div>
							<span className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
								รูปตัวอย่างกิจกรรม
							</span>
							<p className="mb-3 ml-1 text-xs text-slate-500 dark:text-slate-400">
								รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 10MB ต่อรูป ไม่จำกัดจำนวน
							</p>
							<div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
								{newItem.images.map((img, idx) => (
									<div
										key={idx}
										className="group relative aspect-square h-full w-full overflow-hidden rounded-lg"
									>
										<img
											alt="preview"
											className="h-full w-full object-cover"
											src={getImageUrl(img)}
										/>
										<Button
											className="absolute top-1 right-1 p-1.5!"
											size="xs"
											type="button"
											variant="danger"
											onClick={() => removeNewItemImage(idx)}
										>
											<X size={18} />
										</Button>
									</div>
								))}
								<Button
									className="flex aspect-square h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600"
									type="button"
									variant="ghost"
									onClick={() => fileInputRef.current?.click()}
								>
									<Upload size={20} strokeWidth={3} />
									<span className="mt-1 text-xs">เพิ่มรูป</span>
								</Button>
							</div>
							<input
								ref={fileInputRef}
								multiple
								accept="image/*"
								className="hidden"
								type="file"
								onChange={handleImageUpload}
							/>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button size="md" type="button" variant="ghost" onClick={resetForm}>
								ยกเลิก
							</Button>
							<Button size="md" type="button" onClick={handleSave}>
								{editingId ? "บันทึกการแก้ไข" : "ยืนยันแพ็กเกจใหม่"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
