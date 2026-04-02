import React from "react";
import { Search, Filter, List, Map as MapIcon } from "lucide-react";

import { InputField } from "@/components/FormInputs";
import Button from "@/components/Button";

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

export default function SearchBar({
	searchQuery,
	onSearchChange,
	isRouteMode,
	onOpenFilter,
	activeFilterCount,
	showFilterLabel = false,
	showViewToggle = false,
	viewMode,
	onSwitchViewMode,
}: SearchBarProps) {
	return (
		<div className="flex flex-row gap-2">
			<InputField
				className="w-full"
				disabled={isRouteMode}
				icon={Search}
				inputClassName={`w-full h-full! py-3.5 ${isRouteMode ? "opacity-50 cursor-not-allowed" : ""} border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all outline-none relative appearance-none`}
				placeholder="ค้นหารายชื่อสวน..."
				type="text"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
			/>

			{showViewToggle && onSwitchViewMode && (
				<div className="flex h-12.5 shrink-0 items-center rounded-xl border border-slate-300 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
					<Button
						className={`flex aspect-square h-full w-auto items-center justify-center rounded-lg border-none p-0! transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${viewMode === "list" ? "bg-white shadow-md dark:bg-slate-600" : ""}`}
						title="แสดงรายชื่อ"
						variant="ghost"
						onClick={() => onSwitchViewMode("list")}
					>
						<List size={20} />
					</Button>
					<Button
						className={`flex aspect-square h-full w-auto items-center justify-center rounded-lg border-none p-0! transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${viewMode === "map" ? "bg-white shadow-md dark:bg-slate-600" : ""}`}
						title="แสดงแผนที่"
						variant="ghost"
						onClick={() => onSwitchViewMode("map")}
					>
						<MapIcon size={20} />
					</Button>
				</div>
			)}

			<Button
				className={`relative ${showViewToggle ? "h-12.5 w-12.5 p-0!" : "p-4!"} flex shrink-0 items-center justify-center ${isRouteMode ? "cursor-not-allowed opacity-50" : ""} rounded-xl border border-slate-300 bg-slate-50 text-slate-900 shadow-sm transition-all outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white`}
				disabled={isRouteMode}
				variant="ghost"
				onClick={onOpenFilter}
			>
				<Filter
					className={activeFilterCount > 0 ? "text-forest-600" : "text-slate-500"}
					size={20}
				/>
				{showFilterLabel && (
					<span className="ml-2 hidden text-nowrap lg:block">ตัวกรอง</span>
				)}
				{activeFilterCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
						{activeFilterCount}
					</span>
				)}
			</Button>
		</div>
	);
}
