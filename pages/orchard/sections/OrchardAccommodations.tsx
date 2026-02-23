import React from "react";
import { Home } from "lucide-react";

import { Orchard } from "@/interface/orchardInterface";
import { MiniCarousel } from "@/components/MiniCarousel";

interface OrchardAccommodationsProps {
	orchard: Orchard;
	hasPrecedingContent?: boolean;
}

export const OrchardAccommodations: React.FC<OrchardAccommodationsProps> = ({
	orchard,
	hasPrecedingContent = false,
}) => {
	if (!orchard.accommodations || orchard.accommodations.length === 0) return null;

	return (
		<div
			className={
				hasPrecedingContent ? "pt-6 border-t border-slate-50 dark:border-slate-700" : ""
			}
		>
			<div className="flex items-center gap-2 mb-4">
				<Home className="text-orange-500" size={20} />
				<h3 className="font-bold text-slate-800 dark:text-slate-200">ที่พักและโฮมสเตย์</h3>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{orchard.accommodations.map((acc, idx) => (
					<div
						key={idx}
						className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/30"
					>
						{acc.images && acc.images.length > 0 && (
							<div className="h-40 w-full">
								<MiniCarousel
									alt={acc.name}
									className="h-full w-full"
									images={acc.images}
								/>
							</div>
						)}
						<div className="p-4">
							<h4 className="font-bold text-slate-900 dark:text-white mb-1">
								{acc.name}
							</h4>
							<div className="flex justify-between items-end mt-2">
								<span className="text-forest-600 dark:text-forest-400 font-bold text-lg">
									฿{acc.price.toLocaleString()}
								</span>
								<span className="text-xs text-slate-500">
									จำนวน: {acc.quantity} ห้อง
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
