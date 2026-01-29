import React, { useState, useEffect } from "react";
import { X, ArrowUpDown, Check, MapPin, RefreshCw } from "lucide-react";

import { OrchardType } from "../interface/orchardInterface";
import { useMasterData } from "../context/MasterDataContext";

import { Button } from "./Button";

interface FilterSheetProps {
	isOpen: boolean;
	onClose: () => void;
	currentSort: "default" | "nearest";
	currentFilters: OrchardType[];
	onApply: (sort: "default" | "nearest", filters: OrchardType[]) => void;
	onReset?: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
	isOpen,
	onClose,
	currentSort,
	currentFilters,
	onApply,
	onReset,
}) => {
	const { serviceTypes, isLoading } = useMasterData();
	const [tempSort, setTempSort] = useState<"default" | "nearest">(currentSort);
	const [tempFilters, setTempFilters] = useState<OrchardType[]>(currentFilters);

	// Sync state when modal opens
	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line
			setTempSort(currentSort);
			// eslint-disable-next-line
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
		<div className="fixed inset-0 z-[2500] flex items-end sm:items-center justify-center sm:p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			{/* Modal Content */}
			<div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">
						ตัวกรองและจัดเรียง
					</h3>
					<Button
						className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors !min-h-0 !w-auto"
						variant="none"
						onClick={onClose}
					>
						<X size={24} />
					</Button>
				</div>

				{/* Scrollable Content */}
				<div className="flex-grow overflow-y-auto p-5 space-y-8">
					{/* Section 1: Sort */}
					<div>
						<h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
							จัดเรียงตาม (Sort By)
						</h4>
						<div className="space-y-3">
							<label
								className={`
                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                ${
					tempSort === "default"
						? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
						: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
				}
              `}
							>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${tempSort === "default" ? "bg-forest-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
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
								className={`
                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                ${
					tempSort === "nearest"
						? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
						: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
				}
              `}
							>
								<div className="flex items-center gap-3">
									<div
										className={`p-2 rounded-full ${tempSort === "nearest" ? "bg-forest-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
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
						<h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
							ประเภทบริการ (Filter)
						</h4>

						{isLoading ? (
							<div className="animate-pulse h-20 bg-slate-200 rounded-xl" />
						) : (
							<div className="grid grid-cols-2 gap-3">
								{serviceTypes.map((type) => {
									const isSelected = tempFilters.includes(type.id as OrchardType);

									return (
										<Button
											key={type.id}
											className={`
                        relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all h-24
                        ${
							isSelected
								? "border-forest-500 bg-forest-50 dark:bg-forest-900/20 text-forest-800 dark:text-forest-300"
								: "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
						}
                      `}
											variant="none"
											onClick={() => toggleFilter(type.id as OrchardType)}
										>
											{isSelected && (
												<div className="absolute top-2 right-2 text-forest-600">
													<Check size={16} strokeWidth={3} />
												</div>
											)}
											<span className="font-semibold text-sm text-center">
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
				<div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl">
					<div className="flex gap-3">
						<Button
							className="flex-1 !py-3 !rounded-xl"
							variant="secondary"
							onClick={handleLocalReset}
						>
							<RefreshCw className="mr-2" size={18} /> ล้างค่า
						</Button>
						<Button
							className="flex-[2] !py-3 !rounded-xl !text-lg shadow-lg shadow-forest-900/20"
							onClick={handleApply}
						>
							ดูผลลัพธ์
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const CheckCircleIcon = () => (
	<div className="w-6 h-6 rounded-full bg-forest-500 flex items-center justify-center text-white">
		<Check size={14} strokeWidth={3} />
	</div>
);
