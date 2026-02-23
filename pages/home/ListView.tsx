import React from "react";
import { Search, MapPin, Route } from "lucide-react";

import { Orchard } from "@/interface/orchardInterface";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SearchBar } from "@/pages/home/SearchBar";

interface ListViewProps {
	filteredOrchards: Orchard[];
	isLoading: boolean;
	isRouteMode: boolean;
	routeIds: number[];
	selectedOrchardId: number | undefined;
	viewMode: "map" | "list";
	searchQuery: string;
	activeFilterCount: number;
	onSearchChange: (value: string) => void;
	onOrchardClick: (id: number) => void;
	onOpenFilter: () => void;
	onClearFilters: () => void;
}

export const ListView: React.FC<ListViewProps> = ({
	filteredOrchards,
	isLoading,
	isRouteMode,
	routeIds,
	selectedOrchardId,
	viewMode,
	searchQuery,
	activeFilterCount,
	onSearchChange,
	onOrchardClick,
	onOpenFilter,
	onClearFilters,
}) => {
	return (
		<div
			className={`
				absolute inset-0 z-10 bg-white dark:bg-slate-900 transition-transform duration-300 transform flex flex-col
			 	lg:relative lg:translate-x-0 lg:w-[480px] xl:w-[600px] lg:shrink-0 lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:z-0
				${viewMode === "list" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
			`}
		>
			<div className="hidden md:block p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-sm shrink-0">
				<div className="mb-4">
					<SearchBar
						showFilterLabel
						activeFilterCount={activeFilterCount}
						isRouteMode={isRouteMode}
						searchQuery={searchQuery}
						onOpenFilter={onOpenFilter}
						onSearchChange={onSearchChange}
					/>
				</div>

				{!isRouteMode ? (
					<>
						<div className="mt-2 flex justify-between items-center">
							<div className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
								ผลลัพธ์:{" "}
								<span className="text-forest-700 dark:text-forest-400">
									{filteredOrchards.length}
								</span>{" "}
								รายการ
							</div>
						</div>
					</>
				) : (
					<div>
						<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
							<h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
								<Route className="mr-2" size={20} /> โหมดจัดเส้นทาง
							</h3>
							<p className="text-sm text-blue-600 dark:text-blue-400">
								แตะเลือกสวนจากรายการหรือแผนที่เพื่อนับเป็นจุดแวะพักตามลำดับ
							</p>
						</div>
						<div className="flex justify-between items-center px-1">
							<div className="text-sm font-medium text-slate-500 dark:text-slate-400">
								{routeIds.length > 0
									? `เลือกแล้ว ${routeIds.length} แห่ง`
									: "ยังไม่ได้เลือกสวน"}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950">
				{/* Mobile Sort/Count Header */}
				<div className="md:hidden flex flex-col gap-2 mb-2">
					{isRouteMode && (
						<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
							<h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center">
								<Route className="mr-2" size={16} /> โหมดจัดเส้นทาง
							</h3>
							<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
								เลือกสวนเพื่อเพิ่มในเส้นทาง
							</p>
						</div>
					)}
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-slate-500 dark:text-slate-400">
							{isRouteMode
								? routeIds.length > 0
									? `เลือกแล้ว ${routeIds.length} แห่ง`
									: "ยังไม่เลือก"
								: `พบ ${filteredOrchards.length} สวน`}
						</span>
					</div>
				</div>

				{isLoading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"
							/>
						))}
					</div>
				) : filteredOrchards.length > 0 ? (
					<div className="space-y-4 pb-24 md:pb-4">
						{filteredOrchards.map((orchard) => {
							const isSelectedInRoute = routeIds.includes(orchard.id);
							const routeIndex = routeIds.indexOf(orchard.id);

							if (isRouteMode) {
								return (
									<div
										key={orchard.id}
										className={`
											relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group
											${
												isSelectedInRoute
													? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md"
													: "bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
											}
										`}
										role="button"
										tabIndex={0}
										onClick={() => onOrchardClick(orchard.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												onOrchardClick(orchard.id);
										}}
									>
										<div
											className={`
												w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 transition-colors
												${isSelectedInRoute ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600"}
											`}
										>
											{isSelectedInRoute ? (
												routeIndex + 1
											) : (
												<div className="w-3 h-3 rounded-full bg-slate-400" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<h4 className="font-bold text-slate-900 dark:text-white truncate">
												{orchard.name}
											</h4>
											<div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
												<MapPin size={12} /> {orchard.address}
											</div>
										</div>
										{!isSelectedInRoute && (
											<div className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
												เลือก
											</div>
										)}
									</div>
								);
							}

							return (
								<Card
									key={orchard.id}
									isSelected={selectedOrchardId === orchard.id}
									orchard={orchard}
									onClick={() => onOrchardClick(orchard.id)}
								/>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center text-center py-20">
						<div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Search className="text-slate-400" size={32} />
						</div>
						<h3 className="text-lg font-medium text-slate-900 dark:text-white">
							ไม่พบข้อมูลตามเงื่อนไข
						</h3>
						<p className="text-slate-500 dark:text-slate-400">
							ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง
						</p>
						<Button className="mt-4" variant="ghost" onClick={onClearFilters}>
							ล้างตัวกรองทั้งหมด
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
