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
			<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
				<h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">
					<Image className="text-forest-600" /> วิดีโอและสื่อ
				</h2>

				<div className="flex flex-col gap-6">
					{/* Main Video Display */}
					{videos.length > 0 && (
						<div className="group relative overflow-hidden rounded-2xl bg-black">
							{renderVideo(videos[currentVideoIndex])}

							{videos.length > 1 && (
								<>
									<Button
										className="absolute top-1/2 left-4 -translate-y-1/2 border-none p-2!"
										variant="secondary"
										onClick={onPrevVideo}
									>
										<ChevronLeft size={30} />
									</Button>
									<Button
										className="absolute top-1/2 right-4 -translate-y-1/2 border-none p-2!"
										variant="secondary"
										onClick={onNextVideo}
									>
										<ChevronRight size={30} />
									</Button>

									<div className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
										{currentVideoIndex + 1} / {videos.length}
									</div>
								</>
							)}
						</div>
					)}

					{/* Pictures Thumbnail Grid */}
					{images.length > 0 ? (
						<div className="grid grid-cols-5 gap-2 md:grid-cols-6 md:gap-4">
							{images.slice(0, 6).map((img, idx) => (
								<div
									key={idx}
									className={`group relative aspect-square h-full w-full cursor-pointer overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-forest-500${idx === 5 ? "hidden md:block" : ""}`}
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
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
										src={getImageUrl(img)}
									/>

									{/* Overlay for +More images on mobile (5-col grid) */}
									{idx === 4 && images.length > 5 && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white backdrop-blur-sm md:hidden">
											+{images.length - 5}
										</div>
									)}

									{/* Overlay for +More images on desktop (6-col grid) */}
									{idx === 5 && images.length > 6 && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white backdrop-blur-sm">
											+{images.length - 6}
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-10 dark:border-slate-700 dark:bg-slate-800">
							<div className="mb-6 rounded-full bg-forest-50 p-6 dark:bg-forest-900/30">
								<Image className="text-forest-600 dark:text-forest-400" size={36} />
							</div>
							<span className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
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
