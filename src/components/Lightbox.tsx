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
			className="animate-in fade-in fixed inset-0 flex flex-col bg-black/95 pt-9 duration-200"
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
				className="relative flex min-h-0 w-full flex-1 items-center justify-center p-4"
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
				<div className="relative flex max-h-full max-w-full items-center justify-center">
					<img
						alt={`Gallery ${currentIndex + 1}`}
						className="h-[80vh] max-w-[90vw] rounded-xl object-cover shadow-2xl"
						src={getImageUrl(images[currentIndex])}
					/>

					<Button
						className="bg-opacity-50 dark:bg-opacity-50 absolute top-4 right-4 border-none! p-3! backdrop-blur-md"
						variant="secondary"
						onClick={onClose}
					>
						<X size={32} strokeWidth={3} />
					</Button>
				</div>
			</div>

			{/* Thumbnails Footer */}
			<div className="flex w-full shrink-0 justify-center gap-3 overflow-x-auto border-t border-white/10 bg-black/90 p-4 backdrop-blur-md">
				<div className="flex min-w-min gap-2 px-4">
					{images.map((img, idx) => (
						<button
							key={idx}
							className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
								idx === currentIndex
									? "scale-105 border-forest-500 opacity-100 ring-2 ring-forest-500/50"
									: "border-transparent opacity-50 hover:scale-105 hover:opacity-80"
							}`}
							onClick={() => setIndex(idx)}
						>
							<img
								alt={`Thumbnail ${idx + 1}`}
								className="h-full w-full object-cover"
								src={getImageUrl(img)}
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
