import React from "react";
import { Map } from "lucide-react";

export const MapPlaceholder: React.FC = () => {
	return (
		<div className="w-full h-full bg-slate-100 dark:bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center p-8 text-center animate-pulse">
			<div className="bg-slate-200 dark:bg-slate-600 p-4 rounded-full mb-4">
				<Map size={32} className="text-slate-400 dark:text-slate-300" />
			</div>
			<h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
				แผนที่สวนทุเรียน
			</h3>
			<p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
				ในเวอร์ชันจริง ส่วนนี้จะเป็นแผนที่ Interactive (เช่น Google Maps) แสดงพิกัดสวนต่างๆ
			</p>
		</div>
	);
};
