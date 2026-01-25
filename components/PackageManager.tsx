import React, { useState, useRef } from "react";
import { Package } from "../interface/orchardInterface";
import { useAlert } from "../context/AlertContext";
import { Button } from "./Button";
import { InputField, TextAreaField } from "./FormInputs";
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

interface PackageManagerProps {
	packages: Package[];
	onChange: (packages: Package[]) => void;
}

export const PackageManager: React.FC<PackageManagerProps> = ({ packages, onChange }) => {
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
		<div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
			{/* List of Existing Packages */}
			{packages.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{packages.map((item) => (
						<div
							key={item.id}
							className={`bg-white dark:bg-slate-800 rounded-xl p-4 border shadow-sm flex flex-col gap-3 relative group transition-all
                 ${editingId === item.id ? "border-forest-500 ring-2 ring-forest-100 dark:ring-forest-900" : "border-slate-200 dark:border-slate-700"}
              `}
						>
							<div className="flex gap-4 pr-16">
								<div className="w-20 h-20 shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
									{item.images.length > 0 ? (
										<img
											src={item.images[0]}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-slate-400">
											<Ticket size={24} />
										</div>
									)}
								</div>
								<div className="flex-grow min-w-0">
									<h4 className="font-bold text-slate-900 dark:text-white truncate">
										{item.name}
									</h4>
									<div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-1">
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
							<div className="text-xs bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg text-slate-600 dark:text-slate-300 flex items-center gap-2">
								<Calendar size={12} className="shrink-0" />
								<span>
									{formatDate(item.startDate)} - {formatDate(item.endDate)}
								</span>
							</div>

							<div className="absolute top-2 right-2 flex gap-1">
								<button
									type="button"
									onClick={() => handleEdit(item)}
									className="p-1.5 text-slate-400 hover:text-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/20 rounded-lg transition-colors"
									title="แก้ไข"
								>
									<Edit2 size={16} />
								</button>
								<button
									type="button"
									onClick={() => handleDelete(item.id)}
									className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
									title="ลบ"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Add/Edit Section */}
			{!isAdding ? (
				<button
					type="button"
					onClick={() => {
						resetForm();
						setIsAdding(true);
					}}
					className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-forest-500 hover:text-forest-600 dark:hover:border-forest-400 dark:hover:text-forest-300 transition-colors flex items-center justify-center gap-2 font-medium"
				>
					<Plus size={20} /> เพิ่มแพ็กเกจ/กิจกรรม
				</button>
			) : (
				<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
					<div className="flex justify-between items-center mb-4">
						<h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
							{editingId ? (
								<>
									<Edit2 size={18} className="text-forest-600" />{" "}
									แก้ไขข้อมูลแพ็กเกจ
								</>
							) : (
								<>
									<Plus size={18} className="text-forest-600" />{" "}
									เพิ่มข้อมูลแพ็กเกจ
								</>
							)}
						</h4>
						<button
							type="button"
							onClick={resetForm}
							className="text-slate-400 hover:text-slate-600"
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-4">
						<InputField
							label="ชื่อกิจกรรม"
							placeholder="เช่น บุฟเฟต์ทุเรียนอิ่มไม่อั้น, Workshop ทำทุเรียนกวน"
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
							icon={Ticket}
						/>

						<div className="grid grid-cols-2 gap-4">
							<InputField
								label="ราคาต่อคน (บาท)"
								type="number"
								placeholder="0"
								value={newItem.price}
								onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
								onBlur={() => formatNumberOnBlur("price")}
								icon={Banknote}
							/>
							<InputField
								label="ระยะเวลา (ชั่วโมง)"
								type="number"
								placeholder="1"
								value={newItem.duration}
								onChange={(e) =>
									setNewItem({ ...newItem, duration: e.target.value })
								}
								onBlur={() => formatNumberOnBlur("duration")}
								icon={Clock}
							/>
						</div>

						<TextAreaField
							label="สิ่งที่ได้รับ (Includes)"
							placeholder="รายละเอียดสิ่งที่รวมในแพ็กเกจ..."
							value={newItem.includes}
							onChange={(e) => setNewItem({ ...newItem, includes: e.target.value })}
							rows={3}
							icon={CheckCircle}
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<InputField
								label="เริ่มวันที่"
								type="date"
								value={newItem.startDate}
								onChange={(e) =>
									setNewItem({ ...newItem, startDate: e.target.value })
								}
								icon={Calendar}
							/>
							<InputField
								label="ถึงวันที่"
								type="date"
								value={newItem.endDate}
								onChange={(e) =>
									setNewItem({ ...newItem, endDate: e.target.value })
								}
								icon={Calendar}
							/>
						</div>

						<div>
							<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
								รูปตัวอย่างกิจกรรม
							</label>
							<p className="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-1">
								รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 10MB ต่อรูป ไม่จำกัดจำนวน
							</p>
							<div className="flex flex-wrap gap-3">
								{newItem.images.map((img, idx) => (
									<div
										key={idx}
										className="w-20 h-20 rounded-lg overflow-hidden relative group"
									>
										<img
											src={img}
											alt="preview"
											className="w-full h-full object-cover"
										/>
										<button
											type="button"
											onClick={() => removeNewItemImage(idx)}
											className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<X size={12} />
										</button>
									</div>
								))}
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-forest-500 hover:text-forest-500 bg-white dark:bg-slate-800 transition-colors"
								>
									<Upload size={16} />
									<span className="text-[10px] mt-1">เพิ่มรูป</span>
								</button>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
							/>
						</div>

						<div className="pt-2 flex justify-end gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={resetForm}
								className="!px-4"
							>
								ยกเลิก
							</Button>
							<Button type="button" onClick={handleSave} className="!px-6">
								{editingId ? "บันทึกการแก้ไข" : "ยืนยันเพิ่ม"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
