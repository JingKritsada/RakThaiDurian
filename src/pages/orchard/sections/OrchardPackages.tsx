import type { Orchard } from "@/interfaces/orchardInterface";

import { Users } from "lucide-react";

import MiniCarousel from "@/components/MiniCarousel";

interface OrchardPackagesProps {
	orchard: Orchard;
	hasPrecedingContent?: boolean;
}

export default function OrchardPackages({
	orchard,
	hasPrecedingContent = false,
}: OrchardPackagesProps) {
	if (!orchard.packages || orchard.packages.length === 0) return null;

	return (
		<div
			className={
				hasPrecedingContent ? "border-t border-slate-50 pt-6 dark:border-slate-700" : ""
			}
		>
			<div className="mb-4 flex items-center gap-2">
				<Users className="text-purple-500" size={20} />
				<h3 className="font-bold text-slate-800 dark:text-slate-200">แพ็คเกจท่องเที่ยว</h3>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{orchard.packages.map((pkg, idx) => (
					<div
						key={idx}
						className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
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
							<div className="mb-2 flex items-start justify-between">
								<h4 className="font-bold text-slate-900 dark:text-white">
									{pkg.name}
								</h4>
								<span className="rounded-lg bg-purple-100 px-2 py-1 text-xs whitespace-nowrap text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
									{pkg.duration} ชม.
								</span>
							</div>
							<p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
								{pkg.includes}
							</p>
							<div className="mt-auto flex items-center justify-between">
								<span className="text-lg font-bold text-forest-600 dark:text-forest-400">
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
}
