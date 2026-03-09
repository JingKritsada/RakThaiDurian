import React from "react";
import { Users } from "lucide-react";

import { Orchard } from "@/interface/orchardInterface";
import { MiniCarousel } from "@/components/MiniCarousel";

interface OrchardPackagesProps {
	orchard: Orchard;
	hasPrecedingContent?: boolean;
}

export const OrchardPackages: React.FC<OrchardPackagesProps> = ({
	orchard,
	hasPrecedingContent = false,
}) => {
	if (!orchard.packages || orchard.packages.length === 0) return null;

	return (
		<div
			className={
				hasPrecedingContent ? "pt-6 border-t border-slate-50 dark:border-slate-700" : ""
			}
		>
			<div className="flex items-center gap-2 mb-4">
				<Users className="text-purple-500" size={20} />
				<h3 className="font-bold text-slate-800 dark:text-slate-200">แพ็คเกจท่องเที่ยว</h3>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{orchard.packages.map((pkg, idx) => (
					<div
						key={idx}
						className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/30"
					>
						{pkg.images && pkg.images.length > 0 && (
							<div className="h-40 w-full">
								<MiniCarousel
									alt={pkg.name}
									className="h-full w-full"
									images={pkg.images}
								/>
							</div>
						)}
						<div className="grow p-4">
							<div className="flex justify-between items-start mb-2">
								<h4 className="font-bold text-slate-900 dark:text-white">
									{pkg.name}
								</h4>
								<span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-lg whitespace-nowrap">
									{pkg.duration} ชม.
								</span>
							</div>
							<p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
								{pkg.includes}
							</p>
							<div className="flex justify-between items-center mt-auto">
								<span className="text-forest-600 dark:text-forest-400 font-bold text-lg">
									฿{pkg.price.toLocaleString()}
								</span>
								<div className="text-xs text-slate-400">
									{new Date(pkg.startDate).toLocaleDateString("th-TH")} -{" "}
									{new Date(pkg.endDate).toLocaleDateString("th-TH")}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
