import React, { useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "./Button";

import { getImageUrl } from "@/utils/constants";
import { Z_INDEX } from "@/utils/zIndex";

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

	// Handle keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				setIndex((currentIndex - 1 + images.length) % images.length);
			} else if (e.key === "ArrowRight") {
				setIndex((currentIndex + 1) % images.length);
			} else if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, currentIndex, images.length, setIndex, onClose]);

	if (!isOpen || images.length === 0) return null;

	return (
		<div
			className="fixed inset-0 bg-black/95 flex flex-col pt-9 animate-in fade-in duration-200"
			role="button"
			style={{ zIndex: Z_INDEX.lightbox }}
			tabIndex={0}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={() => {}}
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
						className="max-w-[90vw] h-[80vh] object-cover rounded-xl shadow-2xl"
						src={getImageUrl(images[currentIndex])}
					/>

					<Button
						className="absolute right-4 top-4 p-3! bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md border-none!"
						variant="secondary"
						onClick={onClose}
					>
						<X size={32} strokeWidth={3} />
					</Button>
				</div>
			</div>

			{/* Thumbnails Footer */}
			<div className="bg-black/90 w-full p-4 flex justify-center overflow-x-auto gap-3 shrink-0 backdrop-blur-md border-t border-white/10">
				<div className="flex gap-2 min-w-min px-4">
					{images.map((img, idx) => (
						<button
							key={idx}
							className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all duration-200 border-2 ${
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
