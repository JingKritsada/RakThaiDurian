import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/Button";
import { getImageUrl } from "@/utils/constants";

interface OrchardHeroProps {
	orchard: Orchard;
	images: string[];
	currentImageIndex: number;
	statusInfo: { label: string; color: string } | null;
	onPrevImage: (e: React.MouseEvent) => void;
	onNextImage: (e: React.MouseEvent) => void;
	onBack: () => void;
	onShare: () => void;
}

export const OrchardHero: React.FC<OrchardHeroProps> = ({
	orchard,
	images,
	currentImageIndex,
	statusInfo,
	onPrevImage,
	onNextImage,
	onBack,
	onShare,
}) => {
	const renderImageGrid = () => {
		if (images.length === 0) {
			return (
				<div className="flex h-75 w-full items-center justify-center bg-slate-200 text-slate-400 md:h-100 dark:bg-slate-800">
					<ImageIcon size={48} />
				</div>
			);
		}

		if (images.length === 1) {
			return (
				<div className="h-75 w-full overflow-hidden bg-white md:h-125 dark:bg-slate-950">
					<img
						alt={orchard.name}
						className="h-full w-full object-cover"
						src={getImageUrl(images[0])}
					/>
				</div>
			);
		}

		// Grid for 2+ images
		return (
			<div className="grid h-75 w-full grid-cols-1 gap-2 overflow-hidden bg-white md:h-150 md:grid-cols-4 dark:bg-slate-950">
				{/* Main Image (Left Half) */}
				<div className="group relative h-full cursor-pointer overflow-hidden md:col-span-2">
					<img
						alt={orchard.name}
						className="h-full w-full object-cover transition-transform duration-500"
						src={getImageUrl(images[0])}
					/>
				</div>

				{/* Secondary Images Grid (Right Half) */}
				<div className="hidden h-full grid-cols-2 gap-2 md:col-span-2 md:grid">
					{images.slice(1, 5).map((img, idx) => (
						<div
							key={idx}
							className="group relative h-full cursor-pointer overflow-hidden"
						>
							<img
								alt={`${orchard.name} ${idx + 2}`}
								className="h-full w-full object-cover transition-transform duration-500"
								src={getImageUrl(img)}
							/>
							{/* Overlay for 'More' images if there are more than 5 */}
							{idx === 3 && images.length > 5 && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-bold text-white backdrop-blur-sm">
									+{images.length - 5}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<>
			{/* Top Image Section */}
			<div className="group relative w-full bg-slate-900">
				{/* Mobile Carousel View */}
				<div className="relative flex h-[40vh] w-full overflow-hidden md:hidden">
					{images.length > 0 ? (
						<div
							className="flex h-full w-full transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
						>
							{images.map((img, index) => (
								<div key={index} className="relative h-full w-full shrink-0">
									<img
										alt={`Orchard Media ${index + 1}`}
										className="h-full w-full object-cover"
										src={getImageUrl(img)}
									/>
									<div
										className="pointer-events-none absolute inset-0"
										style={{
											background:
												"linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
										}}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500 dark:bg-slate-800">
							<ImageIcon size={48} />
							<div
								className="pointer-events-none absolute inset-0"
								style={{
									background:
										"linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
								}}
							/>
						</div>
					)}

					{/* Navigation Buttons for Mobile */}
					{images.length > 1 && (
						<>
							<Button
								className="absolute top-1/2 left-6 z-10 -translate-y-1/2 border-none p-2!"
								variant="secondary"
								onClick={onPrevImage}
							>
								<ChevronLeft size={24} />
							</Button>
							<Button
								className="absolute top-1/2 right-6 z-10 -translate-y-1/2 border-none p-2!"
								variant="secondary"
								onClick={onNextImage}
							>
								<ChevronRight size={24} />
							</Button>
						</>
					)}
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:block">{renderImageGrid()}</div>
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							"linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
					}}
				/>
			</div>

			{/* Header Actions */}
			<div className="relative z-10 mx-auto -mt-28 max-w-7xl px-6">
				<div className="mb-6 flex items-center justify-between">
					<Button
						className="h-10 w-10 border-none p-0! transition-transform hover:scale-105"
						title="ย้อนกลับ"
						variant="secondary"
						onClick={onBack}
					>
						<ArrowLeft size={20} />
					</Button>

					<div className="rounded-full bg-white/30 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-md md:hidden dark:bg-slate-800/70">
						{images.length > 0
							? `${currentImageIndex + 1} / ${images.length}`
							: "ไม่มีข้อมูลรูปภาพ"}
					</div>

					<Button
						className="h-10 w-10 border-none p-0! transition-transform hover:scale-105"
						title="แชร์"
						variant="secondary"
						onClick={onShare}
					>
						<Share2 size={20} />
					</Button>
				</div>

				{/* Title Card */}
				<div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between gap-4">
							<h1 className="text-3xl leading-tight font-bold text-slate-900 dark:text-white">
								{orchard.name}
							</h1>
							{statusInfo && (
								<span
									className={`text-md hidden rounded-lg border px-4 py-2 font-bold whitespace-nowrap shadow-sm backdrop-blur-lg sm:block ${statusInfo.color}`}
								>
									{statusInfo.label}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
