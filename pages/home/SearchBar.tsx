import React from "react";
import { Search, Filter, List, Map as MapIcon } from "lucide-react";

import { InputField } from "@/components/FormInputs";
import { Button } from "@/components/Button";

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	isRouteMode: boolean;
	onOpenFilter: () => void;
	activeFilterCount: number;
	showFilterLabel?: boolean;
	showViewToggle?: boolean;
	viewMode?: "map" | "list";
	onSwitchViewMode?: (mode: "map" | "list") => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	searchQuery,
	onSearchChange,
	isRouteMode,
	onOpenFilter,
	activeFilterCount,
	showFilterLabel = false,
	showViewToggle = false,
	viewMode,
	onSwitchViewMode,
}) => {
	return (
		<div className="flex gap-3">
			<InputField
				className="w-full"
				disabled={isRouteMode}
				icon={Search}
				inputClassName={`w-full !h-full py-3.5 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none relative appearance-none`}
				placeholder="ค้นหารายชื่อสวนทุเรียน..."
				type="text"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
			/>

			{showViewToggle && onSwitchViewMode && (
				<div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700 h-[50px] items-center shrink-0">
					<Button
						className={`w-auto h-full flex items-center justify-center rounded-lg transition-all !px-3 !min-h-0 border-0 ${viewMode === "list" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white" : "text-slate-400 bg-transparent"}`}
						title="แสดงรายชื่อ"
						variant="ghost"
						onClick={() => onSwitchViewMode("list")}
					>
						<List size={20} />
					</Button>
					<Button
						className={`w-auto h-full flex items-center justify-center rounded-lg transition-all !px-3 !min-h-0 border-0 ${viewMode === "map" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white" : "text-slate-400 bg-transparent"}`}
						title="แสดงแผนที่"
						variant="ghost"
						onClick={() => onSwitchViewMode("map")}
					>
						<MapIcon size={20} />
					</Button>
				</div>
			)}

			<Button
				className={`relative ${showViewToggle ? "w-[50px] h-[50px] !p-0" : "px-4 py-3.5"} flex items-center justify-center shrink-0 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none`}
				disabled={isRouteMode}
				variant="ghost"
				onClick={onOpenFilter}
			>
				<Filter
					className={activeFilterCount > 0 ? "text-forest-600" : "text-slate-500"}
					size={20}
				/>
				{showFilterLabel && <span className="text-nowrap ml-2">ตัวกรอง</span>}
				{activeFilterCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
						{activeFilterCount}
					</span>
				)}
			</Button>
		</div>
	);
};
