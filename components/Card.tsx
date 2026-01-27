import React from "react";
import { MapPin, ChevronRight, Image as ImageIcon } from "lucide-react";

import { Orchard } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";

import { SocialLinks } from "./SocialLinks";

interface CardProps {
	orchard: Orchard;
	onClick?: () => void;
	isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({ orchard, onClick, isSelected }) => {
	const { getStatus, getServiceType } = useMasterData();

	const statusInfo = getStatus(orchard.status) ||
		getStatus("available") || {
			label: "Unknown",
			color: "bg-gray-100 text-gray-800",
			mapColor: "#888",
		};

	const coverImage = orchard.images.length > 0 ? orchard.images[0] : null;

	return (
		<div
			className={`
				group flex flex-col sm:flex-row bg-white dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
				border ${isSelected ? "border-forest-500 ring-2 ring-forest-500 shadow-lg" : "border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-forest-200 dark:hover:border-forest-800"}
				h-full min-h-[13rem] relative
			`}
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClick?.();
				}
			}}
		>
			{/* Image Section */}
			<div className="w-full sm:w-[200px] aspect-video sm:aspect-auto sm:h-auto bg-slate-200 dark:bg-slate-700 relative shrink-0 overflow-hidden">
				{coverImage ? (
					<img
						alt={orchard.name}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						src={coverImage}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-slate-400">
						<ImageIcon size={32} />
					</div>
				)}

				<div className="absolute top-2 left-2 max-w-[90%]">
					<span
						className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border shadow-sm backdrop-blur-lg whitespace-nowrap ${statusInfo.color}`}
					>
						{statusInfo.label}
					</span>
				</div>

				{orchard.images.length > 1 && (
					<div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
						+{orchard.images.length - 1} รูป
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className="p-4 flex flex-col flex-grow min-w-0">
				<div className="flex-grow">
					<div className="flex justify-between items-start gap-2 mb-1">
						<h3 className="text-lg font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
							{orchard.name}
						</h3>
						{isSelected && (
							<ChevronRight className="text-forest-500 shrink-0" size={20} />
						)}
					</div>

					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-3 min-w-0">
						<MapPin className="shrink-0 text-forest-600" size={16} />
						<span className="truncate">{orchard.address}</span>
					</div>

					<p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 font-normal leading-relaxed mb-4">
						{orchard.description}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-3 border-t border-slate-100 dark:border-slate-700 gap-3 mt-auto">
					<div className="flex flex-wrap gap-2">
						{orchard.types.map((typeId) => {
							const typeInfo = getServiceType(typeId);

							return typeInfo ? (
								<span
									key={typeId}
									className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg whitespace-nowrap"
								>
									{typeInfo.label}
								</span>
							) : null;
						})}
					</div>

					{/* Social Icons in Card */}
					{orchard.socialMedia && (
						<div
							className="self-end sm:self-auto"
							role="button"
							tabIndex={0}
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<SocialLinks
								className="flex gap-1.5"
								itemClassName="w-7 h-7"
								links={orchard.socialMedia}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
