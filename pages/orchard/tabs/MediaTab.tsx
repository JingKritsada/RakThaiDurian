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

import { OrchardFormData, SocialMediaLinks } from "@/interface/orchardInterface";
import { Button } from "@/components/Button";
import { InputField } from "@/components/FormInputs";
import { LineIcon, TiktokIcon } from "@/utils/icons";
import { getImageUrl } from "@/utils/constants";
import { useAlert } from "@/context/AlertContext";

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
		<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-right-2 duration-300">
			<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
				<Image className="text-forest-600" /> รูปภาพและโซเชียล
			</h2>

			<div className="space-y-8">
				{/* Images */}
				<div>
					<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
						รูปภาพบรรยากาศสวน
					</span>
					<p className="text-xs text-slate-500 dark:text-slate-400 mb-4 ml-1">
						รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 10MB ต่อรูป ไม่จำกัดจำนวน
					</p>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{formData.images.map((img, index) => (
							<div
								key={index}
								className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
							>
								<img
									alt={`Preview ${index}`}
									className="w-full h-full object-cover"
									src={getImageUrl(img)}
								/>
								<Button
									className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity !w-auto !h-auto min-h-0"
									title="ลบรูปภาพ"
									type="button"
									variant="ghost"
									onClick={() => removeImage(index)}
								>
									<X size={14} />
								</Button>
							</div>
						))}

						<Button
							className="!h-full w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:border-forest-500 hover:text-forest-500 dark:hover:border-forest-400 dark:hover:text-forest-400 transition-colors bg-slate-50 dark:bg-slate-900/50"
							type="button"
							variant="ghost"
							onClick={() => imageInputRef.current?.click()}
						>
							<div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
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
				<div>
					<div className="flex items-center gap-2 mb-2 ml-1">
						<Video className="text-slate-700 dark:text-slate-300" size={18} />
						<h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
							วิดีโอ (ลิงก์จาก YouTube, TikTok)
						</h3>
					</div>

					<div className="flex gap-2 mb-4">
						<input
							className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm outline-none"
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
							className="!px-4"
							disabled={!tempVideoUrl}
							type="button"
							onClick={handleAddVideo}
						>
							<Plus size={20} /> เพิ่ม
						</Button>
					</div>

					{(formData.videos?.length ?? 0) > 0 && (
						<div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
							{formData.videos?.map((video, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
								>
									<div className="flex items-center gap-3 overflow-hidden">
										<div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-red-600 dark:text-red-400">
											<Youtube size={16} />
										</div>
										<a
											className="text-sm text-slate-600 dark:text-slate-300 truncate hover:text-blue-500 hover:underline"
											href={video}
											rel="noreferrer"
											target="_blank"
										>
											{video}
										</a>
									</div>
									<Button
										className="text-slate-400 hover:text-red-500 transition-colors p-1 !w-auto !h-auto min-h-0"
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
				<div className="pt-6 border-t border-slate-100 dark:border-slate-700">
					<div className="flex items-center gap-2 mb-4 ml-1">
						<Share2 className="text-forest-600 dark:text-forest-400" size={20} />
						<h3 className="text-lg font-bold text-slate-800 dark:text-white">
							ช่องทางการติดตาม (Social Media)
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					<p className="text-xs text-slate-500 mt-2 ml-1">
						* ใส่ลิงก์เต็ม (URL) ของโปรไฟล์เพื่อให้ลูกค้ากดไปที่แอปพลิเคชันได้ทันที
					</p>
				</div>
			</div>
		</div>
	);
};
