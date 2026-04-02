import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { MapPin, ChevronRight, Image as ImageIcon } from "lucide-react";

import { useMasterData } from "@/providers/MasterDataContext";
import { getImageUrl } from "@/utils/constants";

interface CardProps {
	orchard: Orchard;
	onClick?: () => void;
	isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({ orchard, onClick, isSelected }) => {
	const { getStatus, getServiceType } = useMasterData();

	const statusInfo = getStatus(orchard.status) ?? {
		id: orchard.status,
		label: orchard.status,
		color: "bg-gray-100 text-gray-700 border-gray-300",
		mapColor: "#808080",
	};

	const coverImage = orchard.images.length > 0 ? orchard.images[0] : null;

	return (
		<div
			className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 sm:flex-row md:flex-col xl:flex-row dark:bg-slate-800 ${isSelected ? "border-forest-500 shadow-lg ring-2 ring-forest-500" : "border-slate-100 shadow-sm hover:border-forest-200 hover:shadow-xl dark:border-slate-700 dark:hover:border-forest-800"} relative h-full min-h-52`}
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
			<div
				className={`relative aspect-video h-auto w-full shrink-0 overflow-hidden bg-slate-200 sm:aspect-auto sm:h-64 sm:max-h-64 sm:w-56 md:aspect-video md:h-auto md:max-h-full md:w-full xl:aspect-auto xl:h-64 xl:max-h-64 xl:w-56 dark:bg-slate-700`}
			>
				{coverImage ? (
					<img
						alt={orchard.name}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						src={getImageUrl(coverImage)}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-slate-400">
						<ImageIcon size={32} />
					</div>
				)}

				<div className="absolute top-2 left-2 max-w-[90%]">
					<span
						className={`inline-block rounded-lg border px-3 py-1 text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-lg ${statusInfo.color}`}
					>
						{statusInfo.label}
					</span>
				</div>

				{orchard.images.length > 1 && (
					<div className="absolute right-2 bottom-2 rounded-md bg-black/50 px-1.5 py-0.5 text-sm text-white backdrop-blur-sm">
						+{orchard.images.length - 1} รูป
					</div>
				)}
			</div>

			{/* Content Section */}
			<div className="flex min-w-0 grow flex-col p-4">
				<div className="grow">
					<div className="mb-1 flex items-start justify-between gap-2">
						<h3 className="truncate text-lg leading-tight font-bold text-slate-900 transition-colors group-hover:text-forest-700 dark:text-white dark:group-hover:text-forest-400">
							{orchard.name}
						</h3>
						{isSelected && (
							<ChevronRight className="shrink-0 text-forest-500" size={20} />
						)}
					</div>

					<div className="mb-3 flex min-w-0 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
						<MapPin className="shrink-0 text-forest-600" size={16} />
						<span className="truncate">{orchard.address}</span>
					</div>

					<p className="mb-4 line-clamp-3 text-sm leading-relaxed font-normal whitespace-pre-wrap text-slate-600 dark:text-slate-300">
						{orchard.description}
					</p>
				</div>

				<div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
					{orchard.types?.map((typeId) => {
						const typeInfo = getServiceType(typeId);

						return typeInfo ? (
							<span
								key={typeId}
								className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-slate-700 dark:bg-slate-700 dark:text-slate-200"
							>
								{typeInfo.label}
							</span>
						) : null;
					})}
				</div>
			</div>
		</div>
	);
};
