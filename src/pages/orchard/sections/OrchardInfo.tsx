import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { Phone, Info } from "lucide-react";

interface OrchardInfoProps {
	orchard: Orchard;
	getServiceType: (id: string | number) => { label: string } | null | undefined;
}

export default function OrchardInfo({ orchard, getServiceType }: OrchardInfoProps) {
	return (
		<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
			<h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">
				<Info className="text-forest-600" /> ข้อมูลทั่วไป
			</h2>

			<div className="space-y-6">
				<div>
					<span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
						รายละเอียดและจุดเด่น
					</span>
					<p className="leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
						{orchard.description}
					</p>
				</div>

				{orchard.history && (
					<div>
						<span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
							ประวัติความเป็นมา
						</span>
						<p className="leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-slate-300">
							{orchard.history}
						</p>
					</div>
				)}

				{orchard.phoneNumber && (
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
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
									className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
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
}
