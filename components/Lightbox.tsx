import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { getImageUrl } from "../utils/constants";

import { Button } from "./Button";

interface LightboxProps {
	isOpen: boolean;
	onClose: () => void;
	images: string[];
	currentIndex: number;
	setIndex: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
	isOpen,
	onClose,
	images,
	currentIndex,
	setIndex,
}) => {
	// Handle locking body scroll
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen || images.length === 0) return null;

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
	};

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
	};

	return (
		<div
			className="fixed inset-0 z-[100] bg-black/95 flex flex-col pt-16 animate-in fade-in duration-200"
			role="button"
			tabIndex={0}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
		>
			{/* Main Image Area */}
			<div
				className="flex-1 min-h-0 w-full flex items-center justify-center p-4 relative"
				role="button"
				tabIndex={0}
				onClick={(e) => {
					if (e.target === e.currentTarget) {
						onClose();
					}
				}}
				onKeyDown={(e) => {
					if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
						onClose();
					}
				}}
			>
				<div className=" relative max-w-full max-h-full flex justify-center items-center">
					<img
						alt={`Gallery ${currentIndex + 1}`}
						className="w-[90vw] h-[80vh] object-cover rounded-xl shadow-2xl"
						src={getImageUrl(images[currentIndex])}
					/>

					<Button
						className="absolute right-4 top-10 -translate-y-1/2 text-white/80 hover:text-white hover:bg-black/50 rounded-full !p-3 w-14 h-14 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all z-20"
						variant="none"
						onClick={onClose}
					>
						<X size={36} />
					</Button>

					{/* Navigation Buttons */}
					{images.length > 1 && (
						<>
							<Button
								className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-black/50 rounded-full !p-3 w-14 h-14 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all z-20"
								variant="none"
								onClick={handlePrev}
							>
								<ChevronLeft size={36} />
							</Button>
							<Button
								className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-black/50 rounded-full !p-3 w-14 h-14 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all z-20"
								variant="none"
								onClick={handleNext}
							>
								<ChevronRight size={36} />
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Thumbnails Footer */}
			<div className="bg-black/90 w-full p-4 flex justify-center overflow-x-auto gap-3 shrink-0 backdrop-blur-md border-t border-white/10">
				<div className="flex gap-2 min-w-min px-4">
					{images.map((img, idx) => (
						<button
							key={idx}
							className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${
								idx === currentIndex
									? "border-forest-500 scale-105 opacity-100 ring-2 ring-forest-500/50"
									: "border-transparent opacity-50 hover:opacity-80 hover:scale-105"
							}`}
							onClick={() => setIndex(idx)}
						>
							<img
								alt={`Thumbnail ${idx + 1}`}
								className="w-full h-full object-cover"
								src={getImageUrl(img)}
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
