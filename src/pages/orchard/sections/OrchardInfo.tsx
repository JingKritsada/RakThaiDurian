import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { Phone, Info } from "lucide-react";


interface OrchardInfoProps {
	orchard: Orchard;
	getServiceType: (id: string | number) => { label: string } | null | undefined;
}

export const OrchardInfo: React.FC<OrchardInfoProps> = ({ orchard, getServiceType }) => {
	return (
		<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
			<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
				<Info className="text-forest-600" /> ข้อมูลทั่วไป
			</h2>

			<div className="space-y-6">
				<div>
					<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
						รายละเอียดและจุดเด่น
					</span>
					<p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
						{orchard.description}
					</p>
				</div>

				{orchard.history && (
					<div>
						<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
							ประวัติความเป็นมา
						</span>
						<p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
							{orchard.history}
						</p>
					</div>
				)}

				{orchard.phoneNumber && (
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
							<Phone size={20} />
						</div>
						<div>
							<span className="block text-sm font-bold text-slate-700 dark:text-slate-300">
								เบอร์โทรศัพท์ติดต่อ
							</span>
							<a
								className="text-lg font-semibold text-green-600 hover:underline"
								href={`tel:${orchard.phoneNumber}`}
							>
								{orchard.phoneNumber}
							</a>
						</div>
					</div>
				)}

				{orchard.types && orchard.types.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-2">
						{orchard.types.map((typeId) => {
							const typeInfo = getServiceType(typeId);

							if (!typeInfo) return null;

							return (
								<span
									key={typeId}
									className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
								>
									{typeInfo.label}
								</span>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
};
