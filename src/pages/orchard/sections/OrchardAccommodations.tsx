import type { Orchard } from "@/interfaces/orchardInterface";

import { Home } from "lucide-react";

import MiniCarousel from "@/components/MiniCarousel";

interface OrchardAccommodationsProps {
	orchard: Orchard;
	hasPrecedingContent?: boolean;
}

export default function OrchardAccommodations({
	orchard,
	hasPrecedingContent = false,
}: OrchardAccommodationsProps) {
	if (!orchard.accommodations || orchard.accommodations.length === 0) return null;

	return (
		<div
			className={
				hasPrecedingContent ? "border-t border-slate-50 pt-6 dark:border-slate-700" : ""
			}
		>
			<div className="mb-4 flex items-center gap-2">
				<Home className="text-orange-500" size={20} />
				<h3 className="font-bold text-slate-800 dark:text-slate-200">ที่พักและโฮมสเตย์</h3>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{orchard.accommodations.map((acc, idx) => (
					<div
						key={idx}
						className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
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
							<h4 className="mb-1 font-bold text-slate-900 dark:text-white">
								{acc.name}
							</h4>
							<div className="mt-2 flex items-end justify-between">
								<span className="text-lg font-bold text-forest-600 dark:text-forest-400">
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
}
