import type { OrchardFormData, SocialMediaLinks } from "@/interfaces/orchardInterface";

import React, { useRef } from "react";
import {
	Image,
	X,
	Upload,
	Share2,
	Facebook,
	Instagram,
	Youtube,
	Video,
	Plus,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/Button";
import { InputField } from "@/components/FormInputs";
import { LineIcon, TiktokIcon } from "@/utils/icons";
import { getImageUrl } from "@/utils/constants";
import { useAlert } from "@/providers/AlertContext";

interface MediaTabProps {
	formData: OrchardFormData;
	setFormData: React.Dispatch<React.SetStateAction<OrchardFormData>>;
	tempVideoUrl: string;
	setTempVideoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const MediaTab: React.FC<MediaTabProps> = ({
	formData,
	setFormData,
	tempVideoUrl,
	setTempVideoUrl,
}) => {
	const { showAlert } = useAlert();
	const imageInputRef = useRef<HTMLInputElement>(null);

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
					setFormData((prev) => ({
						...prev,
						images: [...prev.images, reader.result as string],
					}));
				}
			};
		});

		if (imageInputRef.current) {
			imageInputRef.current.value = "";
		}
	};

	const removeImage = (indexToRemove: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, index) => index !== indexToRemove),
		}));
	};

	const handleAddVideo = () => {
		if (tempVideoUrl.trim() === "") return;
		if (formData.videos?.includes(tempVideoUrl)) {
			showAlert("ข้อมูลซ้ำ", "ลิงก์วิดีโอนี้ถูกเพิ่มไปแล้ว", "info");

			return;
		}

		setFormData((prev) => ({
			...prev,
			videos: [...(prev.videos ?? []), tempVideoUrl],
		}));
		setTempVideoUrl("");
	};

	const handleRemoveVideo = (indexToRemove: number) => {
		setFormData((prev) => ({
			...prev,
			videos: (prev.videos ?? []).filter((_, index) => index !== indexToRemove),
		}));
	};

	const handleSocialChange = (key: keyof SocialMediaLinks, value: string) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: {
				...prev.socialMedia,
				[key]: value,
			},
		}));
	};

	return (
		<div className="animate-in slide-in-from-right-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm duration-300 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
			<h2 className="mt-1 mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
				<Image className="text-forest-600" /> รูปภาพและโซเชียล
			</h2>

			<div className="space-y-8">
				{/* Images */}
				<div className="space-y-4 border-t border-slate-100 pt-6 dark:border-slate-700">
					<div>
						<span className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
							รูปภาพบรรยากาศสวน
						</span>
						<p className="mb-4 ml-1 text-xs text-slate-500 dark:text-slate-400">
							รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 10MB ต่อรูป ไม่จำกัดจำนวน
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{formData.images.map((img, index) => (
							<div
								key={index}
								className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
							>
								<img
									alt={`Preview ${index}`}
									className="h-full w-full object-cover"
									src={getImageUrl(img)}
								/>
								<Button
									className="absolute top-1 right-1 p-1.5!"
									size="xs"
									title="ลบรูปภาพ"
									type="button"
									variant="dangerghost"
									onClick={() => removeImage(index)}
								>
									<X size={14} />
								</Button>
							</div>
						))}

						<Button
							className="flex aspect-square h-full! w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-forest-500 hover:text-forest-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-forest-400 dark:hover:text-forest-400"
							type="button"
							variant="ghost"
							onClick={() => imageInputRef.current?.click()}
						>
							<div className="rounded-full bg-white p-3 shadow-sm dark:bg-slate-800">
								<Upload size={20} />
							</div>
							<span className="text-xs font-medium">เพิ่มรูปภาพ</span>
						</Button>
					</div>
					<input
						ref={imageInputRef}
						multiple
						accept="image/*"
						className="hidden"
						type="file"
						onChange={handleImageUpload}
					/>
				</div>

				{/* Videos */}
				<div className="border-t border-slate-100 pt-4 dark:border-slate-700">
					<div className="mb-2 ml-1 flex items-center gap-2">
						<Video className="text-slate-700 dark:text-slate-300" size={18} />
						<h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
							วิดีโอ (ลิงก์จาก YouTube, TikTok)
						</h3>
					</div>

					<div className="mb-4 flex gap-2">
						<input
							className="grow rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
							placeholder="วางลิงก์วิดีโอที่นี่..."
							type="text"
							value={tempVideoUrl}
							onChange={(e) => setTempVideoUrl(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddVideo();
								}
							}}
						/>
						<Button
							className="px-4!"
							disabled={!tempVideoUrl}
							type="button"
							onClick={handleAddVideo}
						>
							<Plus size={20} /> เพิ่ม
						</Button>
					</div>

					{(formData.videos?.length ?? 0) > 0 && (
						<div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
							{formData.videos?.map((video, index) => (
								<div
									key={index}
									className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800"
								>
									<div className="flex items-center gap-3 overflow-hidden">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
											<Youtube size={16} />
										</div>
										<a
											className="truncate text-sm text-slate-600 hover:text-blue-500 hover:underline dark:text-slate-300"
											href={video}
											rel="noreferrer"
											target="_blank"
										>
											{video}
										</a>
									</div>
									<Button
										className="h-auto! min-h-0 w-auto! p-1 text-slate-400 transition-colors hover:text-red-500"
										type="button"
										variant="ghost"
										onClick={() => handleRemoveVideo(index)}
									>
										<Trash2 size={18} />
									</Button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Social Media */}
				<div className="border-t border-slate-100 pt-6 dark:border-slate-700">
					<div className="mb-4 ml-1 flex items-center gap-2">
						<Share2 className="text-forest-600 dark:text-forest-400" size={20} />
						<h3 className="text-lg font-bold text-slate-800 dark:text-white">
							ช่องทางการติดตาม (Social Media)
						</h3>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<InputField
							icon={LineIcon}
							label="Line (Link to Profile)"
							placeholder="https://line.me/ti/p/~yourid"
							value={formData.socialMedia?.line ?? ""}
							onChange={(e) => handleSocialChange("line", e.target.value)}
						/>
						<InputField
							icon={Facebook}
							label="Facebook (URL)"
							placeholder="https://facebook.com/yourpage"
							value={formData.socialMedia?.facebook ?? ""}
							onChange={(e) => handleSocialChange("facebook", e.target.value)}
						/>
						<InputField
							icon={Instagram}
							label="Instagram (URL)"
							placeholder="https://instagram.com/yourprofile"
							value={formData.socialMedia?.instagram ?? ""}
							onChange={(e) => handleSocialChange("instagram", e.target.value)}
						/>
						<InputField
							icon={TiktokIcon}
							label="TikTok (URL)"
							placeholder="https://tiktok.com/@yourprofile"
							value={formData.socialMedia?.tiktok ?? ""}
							onChange={(e) => handleSocialChange("tiktok", e.target.value)}
						/>
						<InputField
							icon={Youtube}
							label="YouTube (URL)"
							placeholder="https://youtube.com/c/yourchannel"
							value={formData.socialMedia?.youtube ?? ""}
							onChange={(e) => handleSocialChange("youtube", e.target.value)}
						/>
					</div>
					<p className="mt-2 ml-1 text-xs text-slate-500">
						* ใส่ลิงก์เต็ม (URL) ของโปรไฟล์เพื่อให้ลูกค้ากดไปที่แอปพลิเคชันได้ทันที
					</p>
				</div>
			</div>
		</div>
	);
};
