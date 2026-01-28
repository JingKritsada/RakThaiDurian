import React, { useState, useRef } from "react";
import {
	Plus,
	Trash2,
	Bed,
	Banknote,
	Users,
	Image as ImageIcon,
	X,
	Upload,
	Edit2,
} from "lucide-react";

import { Accommodation } from "../interface/orchardInterface";
import { useAlert } from "../context/AlertContext";

import { Button } from "./Button";
import { InputField } from "./FormInputs";

interface AccommodationManagerProps {
	accommodations: Accommodation[];
	onChange: (accommodations: Accommodation[]) => void;
}

export const AccommodationManager: React.FC<AccommodationManagerProps> = ({
	accommodations,
	onChange,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isAdding, setIsAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const { showAlert, showConfirm } = useAlert();

	// Temporary state for new item (numeric fields as strings to allow empty/placeholder)
	const [newItem, setNewItem] = useState({
		name: "",
		price: "",
		quantity: "",
		images: [] as string[],
	});

	const handleSave = () => {
		const priceNum = parseFloat(newItem.price);
		const quantityNum = parseInt(newItem.quantity);

		if (
			!newItem.name ||
			isNaN(priceNum) ||
			priceNum <= 0 ||
			isNaN(quantityNum) ||
			quantityNum <= 0
		) {
			showAlert(
				"ข้อมูลไม่ครบถ้วน",
				"กรุณาระบุชื่อที่พัก, ราคา, และ จำนวนให้ถูกต้อง",
				"warning"
			);

			return;
		}

		const itemData: Accommodation = {
			// eslint-disable-next-line react-hooks/purity
			id: editingId || Date.now().toString(),
			name: newItem.name,
			price: priceNum,
			quantity: isNaN(quantityNum) ? 1 : quantityNum,
			images: newItem.images,
		};

		if (editingId) {
			onChange(accommodations.map((item) => (item.id === editingId ? itemData : item)));
			showAlert("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
		} else {
			onChange([...accommodations, itemData]);
		}

		resetForm();
	};

	const handleEdit = (item: Accommodation) => {
		setNewItem({
			name: item.name,
			price: item.price.toString(),
			quantity: item.quantity.toString(),
			images: [...item.images],
		});
		setEditingId(item.id);
		setIsAdding(true);
		// Scroll to form if needed, or just let the UI update handle it
	};

	const resetForm = () => {
		setNewItem({ name: "", price: "", quantity: "", images: [] });
		setIsAdding(false);
		setEditingId(null);
	};

	const handleDelete = (id: string) => {
		showConfirm(
			"ยืนยันการลบ",
			"คุณต้องการลบข้อมูลที่พักนี้ใช่หรือไม่?",
			() => {
				onChange(accommodations.filter((item) => item.id !== id));
				if (editingId === id) {
					resetForm();
				}
			},
			"warning",
			"ลบข้อมูล"
		);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files) {
			return;
		}

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

	const formatNumberOnBlur = (field: "price" | "quantity") => {
		const val = parseFloat(newItem[field]);

		if (!isNaN(val)) {
			setNewItem((prev) => ({ ...prev, [field]: val.toString() }));
		}
	};

	return (
		<div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
			{/* List of Existing Accommodations */}
			{accommodations.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{accommodations.map((item) => (
						<div
							key={item.id}
							className={`bg-white dark:bg-slate-800 rounded-xl p-4 border shadow-sm flex gap-4 relative group transition-all
								${editingId === item.id ? "border-forest-500 ring-2 ring-forest-100 dark:ring-forest-900" : "border-slate-200 dark:border-slate-700"}
							`}
						>
							<div className="w-24 h-24 shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
								{item.images.length > 0 ? (
									<img
										alt={item.name}
										className="w-full h-full object-cover"
										src={item.images[0]}
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-slate-400">
										<Bed size={24} />
									</div>
								)}
							</div>
							<div className="flex-grow min-w-0 pr-20">
								<h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
									{item.name}
								</h4>
								<div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-1">
									<span className="flex items-center gap-1">
										<Banknote size={14} /> ฿{item.price.toLocaleString()} / คืน
									</span>
									<span className="flex items-center gap-1">
										<Users size={14} /> จำนวน {item.quantity} ห้อง
									</span>
									<span className="flex items-center gap-1">
										<ImageIcon size={14} /> {item.images.length} รูป
									</span>
								</div>
							</div>

							<div className="absolute top-2 right-2 flex gap-0">
								<Button
									className="!p-3 text-slate-400 hover:text-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/20 rounded-lg transition-colors !min-h-0 !w-auto"
									title="แก้ไข"
									type="button"
									variant="none"
									onClick={() => handleEdit(item)}
								>
									<Edit2 size={16} />
								</Button>
								<Button
									className="!p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors !min-h-0 !w-auto"
									title="ลบ"
									type="button"
									variant="none"
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
					className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-forest-500 hover:text-forest-600 dark:hover:border-forest-400 dark:hover:text-forest-300 transition-colors flex items-center justify-center gap-2 font-medium bg-transparent"
					type="button"
					variant="none"
					onClick={() => {
						resetForm();
						setIsAdding(true);
					}}
				>
					<Plus size={20} /> เพิ่มประเภทที่พัก
				</Button>
			) : (
				<div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
					<div className="flex justify-between items-center mb-4">
						<h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
							{editingId ? (
								<>
									<Edit2 className="text-forest-600" size={18} />{" "}
									แก้ไขข้อมูลห้องพัก
								</>
							) : (
								<>
									<Plus className="text-forest-600" size={18} />{" "}
									เพิ่มข้อมูลห้องพัก
								</>
							)}
						</h4>
						<Button
							className="text-slate-400 hover:text-slate-600 !min-h-0 !w-auto p-0"
							type="button"
							variant="none"
							onClick={resetForm}
						>
							<X size={20} />
						</Button>
					</div>

					<div className="space-y-4">
						<InputField
							required
							icon={Bed}
							label="ชื่อประเภทที่พัก"
							placeholder="เช่น บ้านไม้ไผ่ริมน้ำ, เต็นท์กระโจม"
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
						/>

						<div className="grid grid-cols-2 gap-4">
							<InputField
								required
								icon={Banknote}
								label="ราคาต่อคืน (บาท)"
								placeholder="0"
								type="number"
								value={newItem.price}
								onBlur={() => formatNumberOnBlur("price")}
								onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
							/>
							<InputField
								required
								icon={Users}
								label="จำนวนห้องที่มี"
								placeholder="1"
								type="number"
								value={newItem.quantity}
								onBlur={() => formatNumberOnBlur("quantity")}
								onChange={(e) =>
									setNewItem({ ...newItem, quantity: e.target.value })
								}
							/>
						</div>

						<div>
							<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
								รูปตัวอย่างห้องพัก
							</span>
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
											alt="preview"
											className="w-full h-full object-cover"
											src={img}
										/>
										<Button
											className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity !min-h-0 !w-auto"
											type="button"
											variant="none"
											onClick={() => removeNewItemImage(idx)}
										>
											<X size={12} />
										</Button>
									</div>
								))}
								<Button
									className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-forest-500 hover:text-forest-500 bg-white dark:bg-slate-800 transition-colors !min-h-0 p-0"
									type="button"
									variant="none"
									onClick={() => fileInputRef.current?.click()}
								>
									<Upload size={16} />
									<span className="text-[10px] mt-1">เพิ่มรูป</span>
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

						<div className="pt-2 flex justify-end gap-2">
							<Button
								className="!px-4"
								type="button"
								variant="ghost"
								onClick={resetForm}
							>
								ยกเลิก
							</Button>
							<Button className="!px-6" type="button" onClick={handleSave}>
								{editingId ? "บันทึกการแก้ไข" : "ยืนยันเพิ่ม"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
