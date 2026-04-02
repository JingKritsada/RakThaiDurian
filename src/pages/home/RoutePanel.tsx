import React from "react";
import { Navigation, Flag, Timer } from "lucide-react";

import Button from "@/components/Button";
import { Z_INDEX } from "@/utils/zIndex";

interface RoutePanelProps {
	routeIds: number[];
	routeStats: { distance: number; time: number };
	isRouting: boolean;
	showMapControls: boolean;
	openGoogleMapsRoute: () => void;
	onClearRoute: () => void;
}

export default function RoutePanel({
	routeIds,
	routeStats,
	isRouting,
	showMapControls,
	openGoogleMapsRoute,
	onClearRoute,
}: RoutePanelProps) {
	if (!showMapControls || routeIds.length === 0) return null;

	return (
		<div
			className="absolute right-4 bottom-8 left-4 md:left-1/2 md:w-auto md:min-w-105 md:-translate-x-1/2"
			style={{ zIndex: Z_INDEX.mapPanel }}
		>
			<div className="animate-in slide-in-from-bottom rounded-2xl border border-slate-200 bg-white p-5 shadow-xl duration-300 dark:border-slate-800 dark:bg-slate-900">
				<div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
					<div>
						<h3 className="flex items-center text-lg font-bold text-slate-900 dark:text-white">
							<Flag className="mr-2 h-5 w-5 fill-blue-500 text-blue-500" />
							ทริปของคุณ
						</h3>
						<div className="mt-1 pl-7 text-xs text-slate-500">
							{routeIds.length} จุดแวะพัก
						</div>
					</div>
					<div className="text-right">
						{isRouting ? (
							<div className="flex items-center gap-2 text-sm text-slate-400">
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
								กำลังคำนวณ...
							</div>
						) : (
							<>
								<div className="flex items-center justify-end gap-2 text-lg font-bold text-slate-900 dark:text-white">
									<Timer className="h-5 w-5 text-forest-600" />
									<span>
										{Math.floor(routeStats.time / 60) > 0
											? `${Math.floor(routeStats.time / 60)} ชม. `
											: ""}
										{Math.round(routeStats.time % 60)} นาที
									</span>
								</div>
								<div className="mt-1 text-xs text-slate-500">
									ระยะทางรวม {routeStats.distance.toFixed(1)} กม.
								</div>
							</>
						)}
					</div>
				</div>
				<div className="flex gap-3">
					<Button className="flex-1" size="lg" variant="secondary" onClick={onClearRoute}>
						ล้างค่า
					</Button>
					<Button
						className="flex-3 bg-blue-600 hover:bg-blue-700"
						disabled={routeIds.length === 0}
						size="lg"
						variant="primary"
						onClick={openGoogleMapsRoute}
					>
						<Navigation size={18} strokeWidth={3} />
						นำทาง
					</Button>
				</div>
			</div>
		</div>
	);
}
