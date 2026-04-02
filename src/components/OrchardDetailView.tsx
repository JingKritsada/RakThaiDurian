import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
	X,
	MapPin,
	Phone,
	Navigation,
	Image as ImageIcon,
	Sprout,
	Home,
	Users,
	Info,
} from "lucide-react";

import { Button } from "./Button";
import { SocialLinks } from "./SocialLinks";

import { useMasterData } from "@/providers/MasterDataContext";
import { getImageUrl } from "@/utils/constants";

interface OrchardDetailViewProps {
	orchard: Orchard;
	onClose?: () => void;
	variant?: "sheet" | "popup";
	onImageLoad?: () => void;
}

export const OrchardDetailView: React.FC<OrchardDetailViewProps> = ({
	orchard,
	onClose,
	variant = "sheet",
	onImageLoad,
}) => {
	const navigate = useNavigate();
	const { getStatus, getServiceType } = useMasterData();
	const statusInfo = getStatus(orchard.status);

	if (!statusInfo) return null;

	const isSheet = variant === "sheet";

	// Popup variant specific classes: wider width, transparent background (handled by parent/CSS)
	const containerClasses = isSheet
		? "w-full bg-white dark:bg-slate-900 rounded-t-3xl"
		: "w-100 lg:w-120 bg-transparent";

	return (
		<div className={containerClasses}>
			<div className={`flex flex-col gap-4 ${isSheet ? "p-6" : "p-5"}`}>
				{/* Header */}
				<div className="mt-0 mb-2 flex items-center justify-between">
					<div className="mr-4 flex min-w-0 gap-4">
						<h3 className="truncate text-2xl leading-tight font-bold text-slate-900 dark:text-white">
							{orchard.name}
						</h3>

						<span
							className={`inline-block rounded-lg border px-3 py-1 text-sm font-bold whitespace-nowrap shadow-sm backdrop-blur-lg ${statusInfo.color}`}
						>
							{statusInfo.label}
						</span>
					</div>

					{/* Close button for Popup (or Sheet explicit close) */}
					{onClose && (
						<Button
							aria-label="Close details"
							className="border-none! p-2!"
							variant="secondary"
							onClick={onClose}
						>
							<X size={20} />
						</Button>
					)}
				</div>

				{/* Image Gallery */}
				{orchard.images && orchard.images.length > 0 ? (
					<div className="group relative h-50 w-full overflow-hidden rounded-2xl bg-slate-200 shadow-md">
						<div className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto">
							{orchard.images.map((img, idx) => (
								<img
									key={idx}
									alt={`${orchard.name} - ${idx + 1}`}
									className="h-full w-full shrink-0 snap-center object-cover"
									src={getImageUrl(img)}
									onLoad={onImageLoad}
								/>
							))}
						</div>
						{orchard.images.length > 1 && (
							<div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
								{orchard.images.length} รูป
							</div>
						)}
					</div>
				) : (
					<div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
						<ImageIcon className="opacity-50" size={40} />
					</div>
				)}

				{/* Service Types */}
				<div className="hidden justify-between gap-1.5 md:flex">
					{orchard.types?.map((typeId) => {
						const typeInfo = getServiceType(typeId);

						return typeInfo ? (
							<span
								key={typeId}
								className="w-full rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-medium whitespace-nowrap text-slate-700 dark:bg-slate-700 dark:text-slate-200"
							>
								{typeInfo.label}
							</span>
						) : null;
					})}
				</div>

				{/* Location Section */}
				{orchard.address && (
					<div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-2 flex items-center gap-2 text-forest-700 dark:text-forest-400">
							<MapPin size={14} />
							<h4 className="text-xs font-bold">ข้อมูลสถานที่</h4>
						</div>
						<div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
							{orchard.address}
						</div>
					</div>
				)}

				{/* Features Tags */}
				{((orchard.additionalCrops?.length ?? 0) > 0 ||
					(orchard.packages?.length ?? 0) > 0 ||
					(orchard.accommodations?.length ?? 0) > 0) && (
					<div className="hidden flex-wrap justify-center gap-2 text-xs text-white md:flex">
						{(orchard.additionalCrops?.length ?? 0) > 0 && (
							<span className="flex items-center gap-1 rounded-full bg-forest-800/90 px-3 py-2 shadow-sm">
								<Sprout size={14} />
								สวนผสมผสาน
							</span>
						)}

						{(orchard.packages?.length ?? 0) > 0 && (
							<span className="flex items-center gap-1 rounded-full bg-forest-800/90 px-3 py-2 shadow-sm">
								<Users size={14} />
								แพ็กเกจ/กิจกรรม
							</span>
						)}

						{(orchard.accommodations?.length ?? 0) > 0 && (
							<span className="flex items-center gap-1 rounded-full bg-forest-800/90 px-3 py-2 shadow-sm">
								<Home size={14} />
								ที่พัก/โฮมสเตย์
							</span>
						)}
					</div>
				)}

				{/* Social Links */}
				{orchard.socialMedia && (
					<div className="flex flex-col items-center gap-2 pt-2 text-white!">
						<span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
							ช่องทางติดตาม
						</span>

						<div className="flex flex-row gap-3 text-white!">
							{orchard.phoneNumber && (
								<a
									className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white! shadow-sm transition-transform hover:scale-110"
									href={`tel:${orchard.phoneNumber}`}
								>
									<Phone size={14} />
								</a>
							)}
							<SocialLinks
								itemClassName="w-8 h-8 text-xs"
								links={orchard.socialMedia}
							/>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="mt-3 grid grid-cols-2 gap-3">
					<Button variant="secondary" onClick={() => navigate(`/orchard/${orchard.id}`)}>
						<Info size={16} strokeWidth={3} /> ดูข้อมูล
					</Button>
					<Button
						className="bg-blue-600 hover:bg-blue-700"
						variant="primary"
						onClick={() =>
							window.open(
								`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`,
								"_blank",
								"noreferrer"
							)
						}
					>
						<Navigation size={16} strokeWidth={3} /> นำทาง
					</Button>
				</div>
			</div>
		</div>
	);
};
