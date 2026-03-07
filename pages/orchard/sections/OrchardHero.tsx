import React from "react";
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

import { Orchard } from "@/interface/orchardInterface";
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
				<div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
					<ImageIcon size={48} />
				</div>
			);
		}

		if (images.length === 1) {
			return (
				<div className="w-full h-[300px] md:h-[500px] overflow-hidden bg-white dark:bg-slate-950">
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
			<div className="w-full h-[300px] md:h-[600px] grid grid-cols-1 md:grid-cols-4 gap-2 overflow-hidden bg-white dark:bg-slate-950">
				{/* Main Image (Left Half) */}
				<div className="md:col-span-2 h-full relative group cursor-pointer overflow-hidden">
					<img
						alt={orchard.name}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
				<div className="md:hidden w-full h-[50vh] relative overflow-hidden">
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
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
								</div>
							))}
						</div>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800">
							<ImageIcon size={48} />
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
						</div>
					)}

					{/* Navigation Buttons for Mobile */}
					{images.length > 1 && (
						<>
							<Button
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0"
								variant="ghost"
								onClick={onPrevImage}
							>
								<ChevronLeft size={24} />
							</Button>
							<Button
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0"
								variant="ghost"
								onClick={onNextImage}
							>
								<ChevronRight size={24} />
							</Button>
						</>
					)}
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:block">{renderImageGrid()}</div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
			</div>

			{/* Header Actions */}
			<div className="flex justify-between items-center mb-6">
				<Button
					className="bg-forest-800 hover:bg-forest-900 text-white shadow-lg pointer-events-auto rounded-full w-10 h-10 flex items-center justify-center !p-0 transition-transform hover:scale-105"
					title="ย้อนกลับ"
					variant="ghost"
					onClick={onBack}
				>
					<ArrowLeft size={20} />
				</Button>

				<div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-sm md:hidden">
					{images.length > 0
						? `${currentImageIndex + 1} / ${images.length}`
						: "ไม่มีข้อมูลรูปภาพ"}
				</div>

				<Button
					className="bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-sm pointer-events-auto rounded-full w-10 h-10 flex items-center justify-center !p-0 transition-transform hover:scale-105"
					title="แชร์"
					variant="ghost"
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
								className={`inline-block px-4 py-2 text-md font-bold rounded-lg border shadow-sm backdrop-blur-lg whitespace-nowrap ${statusInfo.color}`}
							>
								{statusInfo.label}
							</span>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
