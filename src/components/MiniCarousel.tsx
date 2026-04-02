import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "@/components/Button";
import { getImageUrl } from "@/utils/constants";

interface MiniCarouselProps {
	images: string[];
	alt: string;
	className?: string;
}

export default function MiniCarousel({ images, alt, className }: MiniCarouselProps) {
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
		<div className={`group/carousel relative overflow-hidden ${className}`}>
			<div
				className="flex h-full w-full transition-transform duration-500 ease-in-out"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{images.map((img, index) => (
					<div key={index} className="relative h-full w-full shrink-0">
						<img
							alt={`${alt} ${index + 1}`}
							className="h-full w-full object-cover"
							src={getImageUrl(img)}
						/>
					</div>
				))}
			</div>

			{/* Navigation */}
			{images.length > 1 && (
				<>
					<Button
						className="absolute top-1/2 left-2 z-10 h-auto! min-h-0 w-auto! -translate-y-1/2 rounded-md bg-black/30 p-1! text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/carousel:opacity-100 hover:bg-black/50"
						variant="ghost"
						onClick={handlePrev}
					>
						<ChevronLeft size={24} />
					</Button>
					<Button
						className="absolute top-1/2 right-2 z-10 h-auto! min-h-0 w-auto! -translate-y-1/2 rounded-md bg-black/30 p-1! text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/carousel:opacity-100 hover:bg-black/50"
						variant="ghost"
						onClick={handleNext}
					>
						<ChevronRight size={24} />
					</Button>

					{/* Dots */}
					<div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
						{images.map((_, idx) => (
							<div
								key={idx}
								className={`h-1.5 w-1.5 rounded-full shadow-sm transition-all duration-300 ${
									idx === currentIndex ? "scale-125 bg-white" : "bg-white/50"
								}`}
							/>
						))}
					</div>
				</>
			)}

			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
		</div>
	);
}
