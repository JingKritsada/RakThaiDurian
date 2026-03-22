import React from "react";
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

import type { Orchard } from "@/interfaces/orchardInterface";
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
				<div className="w-full h-75 md:h-100 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
					<ImageIcon size={48} />
				</div>
			);
		}

		if (images.length === 1) {
			return (
				<div className="w-full h-75 md:h-125 overflow-hidden bg-white dark:bg-slate-950">
					<img
						alt={orchard.name}
						className="w-full h-full object-cover"
						src={getImageUrl(images[0])}
					/>
				</div>
			);
		}

		// Grid for 2+ images
		return (
			<div className="w-full h-75 md:h-150 grid grid-cols-1 md:grid-cols-4 gap-2 overflow-hidden bg-white dark:bg-slate-950">
				{/* Main Image (Left Half) */}
				<div className="md:col-span-2 h-full relative group cursor-pointer overflow-hidden">
					<img
						alt={orchard.name}
						className="w-full h-full object-cover transition-transform duration-500"
						src={getImageUrl(images[0])}
					/>
				</div>

				{/* Secondary Images Grid (Right Half) */}
				<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
					{images.slice(1, 5).map((img, idx) => (
						<div
							key={idx}
							className="relative h-full overflow-hidden group cursor-pointer"
						>
							<img
								alt={`${orchard.name} ${idx + 2}`}
								className="w-full h-full object-cover transition-transform duration-500"
								src={getImageUrl(img)}
							/>
							{/* Overlay for 'More' images if there are more than 5 */}
							{idx === 3 && images.length > 5 && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold backdrop-blur-sm">
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
			<div className="relative w-full bg-slate-900 group">
				{/* Mobile Carousel View */}
				<div className="flex md:hidden w-full h-[40vh] relative overflow-hidden">
					{images.length > 0 ? (
						<div
							className="flex h-full w-full transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
						>
							{images.map((img, index) => (
								<div key={index} className="w-full h-full shrink-0 relative">
									<img
										alt={`Orchard Media ${index + 1}`}
										className="w-full h-full object-cover"
										src={getImageUrl(img)}
									/>
									<div
										className="absolute inset-0 pointer-events-none"
										style={{
											background:
												"linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
										}}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800">
							<ImageIcon size={48} />
							<div
								className="absolute inset-0 pointer-events-none"
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
								className="absolute left-6 top-1/2 -translate-y-1/2 p-2! border-none z-10"
								variant="secondary"
								onClick={onPrevImage}
							>
								<ChevronLeft size={24} />
							</Button>
							<Button
								className="absolute right-6 top-1/2 -translate-y-1/2 p-2! border-none z-10"
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
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
					}}
				/>
			</div>

			{/* Header Actions */}
			<div className="max-w-7xl mx-auto -mt-28 px-6 relative z-10">
				<div className="flex justify-between items-center mb-6">
					<Button
						className="w-10 h-10 p-0! transition-transform hover:scale-105 border-none"
						title="ย้อนกลับ"
						variant="secondary"
						onClick={onBack}
					>
						<ArrowLeft size={20} />
					</Button>

					<div className="bg-white/30 dark:bg-slate-800/70 text-slate-200 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-sm md:hidden">
						{images.length > 0
							? `${currentImageIndex + 1} / ${images.length}`
							: "ไม่มีข้อมูลรูปภาพ"}
					</div>

					<Button
						className="w-10 h-10 p-0! transition-transform hover:scale-105 border-none"
						title="แชร์"
						variant="secondary"
						onClick={onShare}
					>
						<Share2 size={20} />
					</Button>
				</div>

				{/* Title Card */}
				<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
					<div className="flex flex-col gap-2">
						<div className="flex justify-between items-center gap-4">
							<h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
								{orchard.name}
							</h1>
							{statusInfo && (
								<span
									className={`hidden sm:block px-4 py-2 text-md font-bold rounded-lg border shadow-sm backdrop-blur-lg whitespace-nowrap ${statusInfo.color}`}
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
