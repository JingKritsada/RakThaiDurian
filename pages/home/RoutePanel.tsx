import React from "react";
import { Navigation, Flag, Timer } from "lucide-react";

import { Button } from "@/components/Button";
import { Z_INDEX } from "@/utils/zIndex";

interface RoutePanelProps {
	routeIds: number[];
	routeStats: { distance: number; time: number };
	isRouting: boolean;
	showMapControls: boolean;
	openGoogleMapsRoute: () => void;
	onClearRoute: () => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
	routeIds,
	routeStats,
	isRouting,
	showMapControls,
	openGoogleMapsRoute,
	onClearRoute,
}) => {
	if (!showMapControls || routeIds.length === 0) return null;

	return (
		<div
			className="absolute bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-105"
			style={{ zIndex: Z_INDEX.mapPanel }}
		>
			<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
				<div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
					<div>
						<h3 className="font-bold text-slate-900 dark:text-white flex items-center text-lg">
							<Flag className="w-5 h-5 mr-2 text-blue-500 fill-blue-500" />
							ทริปของคุณ
						</h3>
						<div className="text-xs text-slate-500 mt-1 pl-7">
							{routeIds.length} จุดแวะพัก
						</div>
					</div>
					<div className="text-right">
						{isRouting ? (
							<div className="flex items-center gap-2 text-sm text-slate-400">
								<div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
								กำลังคำนวณ...
							</div>
						) : (
							<>
								<div className="flex items-center justify-end gap-2 font-bold text-slate-900 dark:text-white text-lg">
									<Timer className="w-5 h-5 text-forest-600" />
									<span>
										{Math.floor(routeStats.time / 60) > 0
											? `${Math.floor(routeStats.time / 60)} ชม. `
											: ""}
										{Math.round(routeStats.time % 60)} นาที
									</span>
								</div>
								<div className="text-xs text-slate-500 mt-1">
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
						นำทางด้วย Google Maps
					</Button>
				</div>
			</div>
		</div>
	);
};
