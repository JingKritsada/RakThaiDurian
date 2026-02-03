import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getImageUrl } from "../utils/constants";

import { Button } from "./Button";

interface MiniCarouselProps {
	images: string[];
	alt: string;
	className?: string;
}

export const MiniCarousel: React.FC<MiniCarouselProps> = ({ images, alt, className }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	};

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	};

	if (!images || images.length === 0) return null;

	return (
		<div className={`relative overflow-hidden group/carousel ${className}`}>
			<div
				className="flex h-full w-full transition-transform duration-500 ease-in-out"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{images.map((img, index) => (
					<div key={index} className="w-full h-full shrink-0 relative">
						<img
							alt={`${alt} ${index + 1}`}
							className="w-full h-full object-cover"
							src={getImageUrl(img)}
						/>
					</div>
				))}
			</div>

			{/* Navigation */}
			{images.length > 1 && (
				<>
					<Button
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-md !p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm !w-auto !h-auto min-h-0 z-10"
						variant="none"
						onClick={handlePrev}
					>
						<ChevronLeft size={24} />
					</Button>
					<Button
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-md !p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 backdrop-blur-sm !w-auto !h-auto min-h-0 z-10"
						variant="none"
						onClick={handleNext}
					>
						<ChevronRight size={24} />
					</Button>

					{/* Dots */}
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
						{images.map((_, idx) => (
							<div
								key={idx}
								className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
									idx === currentIndex ? "bg-white scale-125" : "bg-white/50"
								}`}
							/>
						))}
					</div>
				</>
			)}

			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
		</div>
	);
};
