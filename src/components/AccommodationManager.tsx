import type { Accommodation } from "@/interfaces/orchardInterface";

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

import Button from "@/components/Button";
import { InputField } from "@/components/FormInputs";
import { useAlert } from "@/providers/AlertContext";
import { getImageUrl } from "@/utils/constants";

interface AccommodationManagerProps {
	accommodations: Accommodation[];
	onChange: (accommodations: Accommodation[]) => void;
}

export default function AccommodationManager({
	accommodations,
	onChange,
}: AccommodationManagerProps) {
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
		<div className="animate-in slide-in-from-top-2 fade-in space-y-4 duration-300">
			{/* List of Existing Accommodations */}
			{accommodations.length > 0 && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{accommodations.map((item) => (
						<div
							key={item.id}
							className={`group relative flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-slate-800 ${editingId === item.id ? "border-forest-500 ring-2 ring-forest-100 dark:ring-forest-900" : "border-slate-200 dark:border-slate-700"} `}
						>
							<div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
								{item.images.length > 0 ? (
									<img
										alt={item.name}
										className="h-full w-full object-cover"
										src={getImageUrl(item.images[0])}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-slate-400">
										<Bed size={24} />
									</div>
								)}
							</div>
							<div className="min-w-0 grow pr-20">
								<h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
									{item.name}
								</h4>
								<div className="mt-1 flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
									<span className="flex items-center gap-1 font-semibold text-forest-600 dark:text-forest-400">
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
					<Plus size={20} /> เพิ่มประเภทที่พัก
				</Button>
			) : (
				<div className="animate-in zoom-in-95 rounded-xl border border-slate-200 bg-slate-50 p-6 duration-200 dark:border-slate-700 dark:bg-slate-900/50">
					<div className="mb-4 flex items-center justify-between">
						<h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
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
						<Button className="p-3!" type="button" variant="ghost" onClick={resetForm}>
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
							<span className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
								รูปตัวอย่างห้องพัก
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
											variant="dangerghost"
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
								{editingId ? "บันทึกการแก้ไข" : "ยืนยันห้องพักใหม่"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
