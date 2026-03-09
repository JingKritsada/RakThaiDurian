import React from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";

import { Button } from "@/components/Button";
import { Lightbox } from "@/components/Lightbox";
import { getImageUrl } from "@/utils/constants";

interface OrchardGalleryProps {
	images: string[];
	videos: string[];
	currentVideoIndex: number;
	isLightboxOpen: boolean;
	lightboxIndex: number;
	onPrevVideo: () => void;
	onNextVideo: () => void;
	onOpenLightbox: (index: number) => void;
	onCloseLightbox: () => void;
	setLightboxIndex: (index: number) => void;
	renderVideo: (url: string) => React.ReactNode;
}

export const OrchardGallery: React.FC<OrchardGalleryProps> = ({
	images,
	videos,
	currentVideoIndex,
	isLightboxOpen,
	lightboxIndex,
	onPrevVideo,
	onNextVideo,
	onOpenLightbox,
	onCloseLightbox,
	setLightboxIndex,
	renderVideo,
}) => {
	return (
		<>
			<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
				<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
					<Image className="text-forest-600" /> วิดีโอและสื่อ
				</h2>

				<div className="flex flex-col gap-6">
					{/* Main Video Display */}
					{videos.length > 0 && (
						<div className="relative group rounded-2xl overflow-hidden bg-black">
							{renderVideo(videos[currentVideoIndex])}

							{videos.length > 1 && (
								<>
									<Button
										className="absolute left-4 top-1/2 -translate-y-1/2 p-2! border-none"
										variant="secondary"
										onClick={onPrevVideo}
									>
										<ChevronLeft size={30} />
									</Button>
									<Button
										className="absolute right-4 top-1/2 -translate-y-1/2 p-2! border-none"
										variant="secondary"
										onClick={onNextVideo}
									>
										<ChevronRight size={30} />
									</Button>

									<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none">
										{currentVideoIndex + 1} / {videos.length}
									</div>
								</>
							)}
						</div>
					)}

					{/* Pictures Thumbnail Grid */}
					{images.length > 0 ? (
						<div className="grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-4">
							{images.slice(0, 6).map((img, idx) => (
								<div
									key={idx}
									className={`relative rounded-xl overflow-hidden cursor-pointer group w-full h-full aspect-square border-2 border-transparent hover:border-forest-500 transition-all${idx === 5 ? " hidden md:block" : ""}`}
									role="button"
									tabIndex={0}
									onClick={() => onOpenLightbox(idx)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											onOpenLightbox(idx);
										}
									}}
								>
									<img
										alt={`Thumbnail ${idx + 1}`}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										src={getImageUrl(img)}
									/>

									{/* Overlay for +More images on mobile (5-col grid) */}
									{idx === 4 && images.length > 5 && (
										<div className="md:hidden absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
											+{images.length - 5}
										</div>
									)}

									{/* Overlay for +More images on desktop (6-col grid) */}
									{idx === 5 && images.length > 6 && (
										<div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
											+{images.length - 6}
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
							<div className="bg-forest-50 dark:bg-forest-900/30 p-6 rounded-full mb-6">
								<Image className="text-forest-600 dark:text-forest-400" size={36} />
							</div>
							<span className="text-lg font-medium text-slate-900 dark:text-white mb-2">
								ยังไม่มีข้อมูลรูปภาพในสวน
							</span>
						</div>
					)}
				</div>
			</section>

			{/* Lightbox Component */}
			<Lightbox
				currentIndex={lightboxIndex}
				images={images}
				isOpen={isLightboxOpen}
				setIndex={setLightboxIndex}
				onClose={onCloseLightbox}
			/>
		</>
	);
};
