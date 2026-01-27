import React from "react";
import { X, MapPin, Phone, Navigation, Image as ImageIcon } from "lucide-react";

import { Orchard } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";

import { SocialLinks } from "./SocialLinks";

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
	const { getStatus, getServiceType } = useMasterData();
	const statusInfo = getStatus(orchard.status);

	if (!statusInfo) return null;

	const isSheet = variant === "sheet";

	// Popup variant specific classes: wider width, transparent background (handled by parent/CSS)
	const containerClasses = isSheet
		? "w-full bg-white dark:bg-slate-900 rounded-t-3xl"
		: "w-[480px] bg-transparent";

	return (
		<div className={containerClasses}>
			{isSheet && (
				<div
					className="sticky top-0 bg-white dark:bg-slate-900 pt-2 pb-1 z-20 flex justify-center rounded-t-3xl"
					role="button"
					tabIndex={0}
					onClick={onClose}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") onClose?.();
					}}
				>
					<div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
				</div>
			)}

			<div className={`flex flex-col gap-4 ${isSheet ? "p-6 pt-2 pb-8" : "p-5"}`}>
				{/* Header */}
				<div className="flex justify-between items-start">
					<div className="flex flex-col gap-2 mr-2 min-w-0 flex-1">
						<h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
							{orchard.name}
						</h3>

						<span
							className={`w-fit inline-block px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm backdrop-blur-lg whitespace-nowrap ${statusInfo.color}`}
						>
							{statusInfo.label}
						</span>
					</div>

					{/* Close button for Popup (or Sheet explicit close) */}
					{onClose && (
						<button
							aria-label="Close details"
							className={`p-1.5 rounded-full transition-colors shrink-0 ${
								isSheet
									? "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
									: "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300"
							}`}
							onClick={onClose}
						>
							<X size={20} />
						</button>
					)}
				</div>

				{/* Image Gallery */}
				{orchard.images && orchard.images.length > 0 ? (
					<div className="relative rounded-2xl overflow-hidden bg-slate-200 h-[200px] w-full shadow-md group">
						<div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
							{orchard.images.map((img, idx) => (
								<img
									key={idx}
									alt={`${orchard.name} - ${idx + 1}`}
									className="w-full h-full object-cover shrink-0 snap-center"
									src={img}
									onLoad={onImageLoad}
								/>
							))}
						</div>
						{orchard.images.length > 1 && (
							<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
								{orchard.images.length} รูป
							</div>
						)}
					</div>
				) : (
					<div className="h-40 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
						<ImageIcon className="opacity-50" size={40} />
					</div>
				)}

				{/* Service Types */}
				<div className="flex justify-between gap-1.5">
					{orchard.types.map((typeId) => {
						const typeInfo = getServiceType(typeId);

						return typeInfo ? (
							<span
								key={typeId}
								className="w-full py-2 px-3 text-sm font-medium text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg whitespace-nowrap"
							>
								{typeInfo.label}
							</span>
						) : null;
					})}
				</div>

				{/* Location Section */}
				{orchard.address && (
					<div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
						<div className="flex items-center gap-2 mb-1 text-forest-700 dark:text-forest-400">
							<MapPin size={14} />
							<h4 className="font-bold text-xs">ข้อมูลสถานที่</h4>
						</div>
						<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
							{orchard.address}
						</p>
					</div>
				)}

				{/* Features Tags */}
				{(orchard.isMixedAgro || orchard.hasPackage || orchard.hasAccommodation) && (
					<div className="flex flex-wrap gap-2 justify-center text-white text-[10px] font-bold">
						{orchard.isMixedAgro && (
							<span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest-800/90 shadow-sm">
								<MapPin size={12} />
								สวนแบบผสมผสาน
							</span>
						)}

						{orchard.hasPackage && (
							<span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest-800/90 shadow-sm">
								<MapPin size={12} />
								มีแพ็กเกจ/กิจกรรม
							</span>
						)}

						{orchard.hasAccommodation && (
							<span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest-800/90 shadow-sm">
								<MapPin size={12} />
								มีที่พัก/โฮมสเตย์
							</span>
						)}
					</div>
				)}

				{/* Social Links */}
				{orchard.socialMedia && (
					<div className="flex flex-col items-center gap-2 pt-2 !text-white">
						<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
							ช่องทางติดตาม
						</span>

						<div className="flex flex-row gap-3 text-white">
							{orchard.phoneNumber && (
								<a
									className="flex items-center justify-center w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform bg-green-500"
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
				<div className="grid grid-cols-2 gap-3 mt-2">
					{orchard.phoneNumber ? (
						<a
							className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 !text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-forest-900/20 whitespace-nowrap"
							href={`tel:${orchard.phoneNumber}`}
						>
							<Phone size={16} /> โทรติดต่อ
						</a>
					) : (
						<button
							disabled
							className="flex items-center justify-center gap-2 bg-slate-200 text-slate-400 py-3 rounded-xl font-bold text-sm cursor-not-allowed whitespace-nowrap"
						>
							<Phone size={16} /> ไม่มีเบอร์
						</button>
					)}
					<a
						className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 !text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap"
						href={`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`}
						rel="noreferrer"
						target="_blank"
					>
						<Navigation size={16} /> นำทาง
					</a>
				</div>
			</div>
		</div>
	);
};
