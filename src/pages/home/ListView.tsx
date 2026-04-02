import type { Orchard } from "@/interfaces/orchardInterface";

import React from "react";
import { Search, MapPin, Route } from "lucide-react";

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
			className={`absolute inset-0 z-10 flex transform flex-col bg-white transition-transform duration-300 md:relative md:z-0 md:w-90 md:shrink-0 md:translate-x-0 md:border-r md:border-slate-200 lg:w-120 xl:w-150 dark:bg-slate-900 md:dark:border-slate-800 ${viewMode === "list" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
		>
			<div className="z-10 hidden shrink-0 border-b border-slate-100 bg-white px-4 py-4 shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
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
						<div className="mt-2 flex items-center justify-between">
							<div className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
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
						<div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
							<h3 className="mb-2 flex items-center font-bold text-blue-800 dark:text-blue-300">
								<Route className="mr-2" size={20} /> โหมดจัดเส้นทาง
							</h3>
							<p className="text-sm text-blue-600 dark:text-blue-400">
								แตะเลือกสวนจากรายการหรือแผนที่เพื่อนับเป็นจุดแวะพักตามลำดับ
							</p>
						</div>
						<div className="flex items-center justify-between px-1">
							<div className="text-sm font-medium text-slate-500 dark:text-slate-400">
								{routeIds.length > 0
									? `เลือกแล้ว ${routeIds.length} แห่ง`
									: "ยังไม่ได้เลือกสวน"}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="custom-scrollbar grow space-y-4 overflow-y-auto bg-slate-100 px-4 py-4 md:py-4 dark:bg-slate-950">
				{/* Mobile Sort/Count Header */}
				<div className="mb-2 flex flex-col gap-2 md:hidden">
					{isRouteMode && (
						<div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
							<h3 className="flex items-center text-sm font-bold text-blue-800 dark:text-blue-300">
								<Route className="mr-2" size={16} /> โหมดจัดเส้นทาง
							</h3>
							<p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
								เลือกสวนเพื่อเพิ่มในเส้นทาง
							</p>
						</div>
					)}
					<div className="flex items-center justify-between">
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
								className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
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
										className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
											isSelectedInRoute
												? "border-blue-500 bg-blue-50 shadow-md dark:bg-blue-900/20"
												: "border-transparent bg-white hover:border-slate-200 dark:bg-slate-800 dark:hover:border-slate-700"
										} `}
										role="button"
										tabIndex={0}
										onClick={() => onOrchardClick(orchard.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ")
												onOrchardClick(orchard.id);
										}}
									>
										<div
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white transition-colors ${isSelectedInRoute ? "bg-blue-600" : "bg-slate-200 group-hover:bg-slate-300 dark:bg-slate-700 dark:group-hover:bg-slate-600"} `}
										>
											{isSelectedInRoute ? (
												routeIndex + 1
											) : (
												<div className="h-3 w-3 rounded-full bg-slate-400" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<h4 className="truncate font-bold text-slate-900 dark:text-white">
												{orchard.name}
											</h4>
											<div className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
												<MapPin size={12} /> {orchard.address}
											</div>
										</div>
										{!isSelectedInRoute && (
											<div className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-slate-700">
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
					<div className="flex flex-col items-center py-20 text-center">
						<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
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
