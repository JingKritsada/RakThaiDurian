import { useState, useEffect } from "react";
import { X, ArrowUpDown, Check, MapPin, RefreshCw } from "lucide-react";

import Button from "@/components/Button";
import { type OrchardType } from "@/utils/enum";
import { useMasterData } from "@/providers/MasterDataContext";
import { Z_INDEX } from "@/utils/zIndex";

interface FilterSheetProps {
	isOpen: boolean;
	onClose: () => void;
	currentSort: "default" | "nearest";
	currentFilters: OrchardType[];
	onApply: (sort: "default" | "nearest", filters: OrchardType[]) => void;
	onReset?: () => void;
}

export default function FilterSheet({
	isOpen,
	onClose,
	currentSort,
	currentFilters,
	onApply,
	onReset,
}: FilterSheetProps) {
	const { serviceTypes, isLoading } = useMasterData();
	const [tempSort, setTempSort] = useState<"default" | "nearest">(currentSort);
	const [tempFilters, setTempFilters] = useState<OrchardType[]>(currentFilters);

	// Sync state when modal opens
	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line
			setTempSort(currentSort);

			setTempFilters(currentFilters);
		}
	}, [isOpen, currentSort, currentFilters]);

	const toggleFilter = (typeId: OrchardType) => {
		setTempFilters((prev) =>
			prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
		);
	};

	const handleApply = () => {
		onApply(tempSort, tempFilters);
		onClose();
	};

	const handleLocalReset = () => {
		setTempSort("default");
		setTempFilters([]);
		if (onReset) onReset();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4"
			style={{ zIndex: Z_INDEX.filterModal }}
		>
			{/* Backdrop */}
			<div
				className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			{/* Modal Content */}
			<div className="animate-in slide-in-from-bottom sm:zoom-in-95 relative flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl duration-300 sm:max-w-md sm:rounded-3xl dark:bg-slate-900">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-5 pt-6 pb-4 dark:border-slate-800">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">
						ตัวกรองและจัดเรียง
					</h3>
					<Button className="p-2!" size="md" variant="ghost" onClick={onClose}>
						<X size={24} />
					</Button>
				</div>

				{/* Scrollable Content */}
				<div className="grow space-y-8 overflow-y-auto p-5">
					{/* Section 1: Sort */}
					<div>
						<h4 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
							จัดเรียงตาม (Sort By)
						</h4>
						<div className="space-y-3">
							<label
								className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
									tempSort === "default"
										? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
										: "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
								} `}
							>
								<div className="flex items-center gap-3">
									<div
										className={`rounded-full p-2 ${tempSort === "default" ? "bg-forest-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
									>
										<ArrowUpDown size={20} />
									</div>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											ค่าเริ่มต้น
										</div>
										<div className="text-xs text-slate-500">
											ไม่มีการเรียงลำดับ
										</div>
									</div>
								</div>
								<input
									checked={tempSort === "default"}
									className="hidden"
									name="sort"
									type="radio"
									onChange={() => setTempSort("default")}
								/>
								{tempSort === "default" && <CheckCircleIcon />}
							</label>

							<label
								className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all ${
									tempSort === "nearest"
										? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
										: "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
								} `}
							>
								<div className="flex items-center gap-3">
									<div
										className={`rounded-full p-2 ${tempSort === "nearest" ? "bg-forest-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
									>
										<MapPin size={20} />
									</div>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											ใกล้ตัวคุณที่สุด
										</div>
										<div className="text-xs text-slate-500">
											เรียงตามระยะทาง
										</div>
									</div>
								</div>
								<input
									checked={tempSort === "nearest"}
									className="hidden"
									name="sort"
									type="radio"
									onChange={() => setTempSort("nearest")}
								/>
								{tempSort === "nearest" && <CheckCircleIcon />}
							</label>
						</div>
					</div>

					{/* Section 2: Filter */}
					<div>
						<h4 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
							ประเภทบริการ (Filter)
						</h4>

						{isLoading ? (
							<div className="h-20 animate-pulse rounded-xl bg-slate-200" />
						) : (
							<div className="grid grid-cols-2 gap-3">
								{serviceTypes.map((type) => {
									const isSelected = tempFilters.includes(type.id as OrchardType);

									return (
										<Button
											key={type.id}
											className={`relative flex h-18 flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all ${
												isSelected
													? "border-forest-500 bg-forest-50 text-forest-800 dark:bg-forest-900/20 dark:text-forest-300"
													: "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
											} `}
											variant="ghost"
											onClick={() => toggleFilter(type.id as OrchardType)}
										>
											{isSelected && (
												<div className="absolute top-2 right-2 text-forest-600">
													<Check size={16} strokeWidth={3} />
												</div>
											)}
											<span className="text-md text-center font-semibold">
												{type.label}
											</span>
										</Button>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="rounded-b-3xl border-t border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
					<div className="flex gap-3">
						<Button
							className="flex-1 rounded-xl! py-3!"
							size="lg"
							variant="secondary"
							onClick={handleLocalReset}
						>
							<RefreshCw className="mr-2" size={18} /> ล้างค่า
						</Button>
						<Button
							className="flex-1 rounded-xl! py-3! text-lg! shadow-lg shadow-forest-900/20"
							size="lg"
							onClick={handleApply}
						>
							ดูผลลัพธ์
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function CheckCircleIcon() {
	return (
		<div className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-500 text-white">
			<Check size={14} strokeWidth={3} />
		</div>
	);
}
