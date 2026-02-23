import React from "react";
import { Layers, ChevronLeft, ChevronRight } from "lucide-react";

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
			<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 hidden lg:block">
				<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
					<Layers className="text-red-600" /> วิดีโอและสื่อ
				</h2>

				<div className="space-y-4">
					{/* Main Video Display */}
					{videos.length > 0 && (
						<div className="relative group rounded-2xl overflow-hidden bg-black">
							{renderVideo(videos[currentVideoIndex])}

							{videos.length > 1 && (
								<>
									<Button
										className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full !p-2 backdrop-blur-sm !w-auto !h-auto min-h-0 transition-opacity"
										variant="ghost"
										onClick={onPrevVideo}
									>
										<ChevronLeft size={36} />
									</Button>
									<Button
										className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full !p-2 backdrop-blur-sm !w-auto !h-auto min-h-0 transition-opacity"
										variant="ghost"
										onClick={onNextVideo}
									>
										<ChevronRight size={36} />
									</Button>

									<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none">
										{currentVideoIndex + 1} / {videos.length}
									</div>
								</>
							)}
						</div>
					)}

					{/* Pictures Thumbnail Grid */}
					{images.length > 0 && (
						<div className="hidden md:grid grid-cols-6 gap-4 h-28">
							{images.slice(0, 6).map((img, idx) => (
								<div
									key={idx}
									className="relative rounded-xl overflow-hidden cursor-pointer group h-full border-2 border-transparent hover:border-forest-500 transition-all"
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
									{/* Overlay for +More images */}
									{idx === 5 && images.length > 6 && (
										<div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
											+{images.length - 6}
										</div>
									)}
								</div>
							))}
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
