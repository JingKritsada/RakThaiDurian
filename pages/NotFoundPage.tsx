import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { FuzzyText } from "../components/FuzzyText";

export const NotFoundPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-between w-full h-[calc(100vh-120px)] p-6">
			<div className="flex flex-col items-center justify-center w-full h-full max-w-lg gap-12 text-center">
				{/* Error Title Section */}
				<div className="flex flex-col items-center justify-center w-full font-mono">
					<div className="relative w-full">
						<FuzzyText
							baseIntensity={0.15}
							color="rgba(156, 163, 175, 1)"
							fontSize="9rem"
							fontWeight={700}
							hoverIntensity={0.35}
						>
							404
						</FuzzyText>
					</div>

					<div className="relative w-full">
						<FuzzyText
							baseIntensity={0.12}
							color="rgba(156, 163, 175, 0.9)"
							fontSize="2rem"
							fontWeight={500}
							hoverIntensity={0.25}
						>
							This page could not be found.
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="w-full px-6 py-4 border rounded-lg bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
					<p className="text-xs font-medium leading-relaxed break-words sm:text-sm md:text-md text-slate-700 dark:text-slate-300">
						ขออภัย ไม่พบหน้าที่คุณร้องขอ กรุณาตรวจสอบ URL หรือกลับไปหน้าหลัก
					</p>
				</div>

				{/* Action Button */}
				<div className="flex flex-row justify-center w-full gap-2">
					<Button
						className="w-full px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105"
						variant="secondary"
						onClick={() => {
							navigate(-1);
						}}
					>
						ย้อนกลับ
					</Button>
				</div>
			</div>

			{/* Additional Info */}
			<div className="text-xs text-center sm:text-sm text-slate-500/50 dark:text-slate-400/50">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
};
