import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/Button";
import FuzzyText from "@/components/FuzzyText";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-between p-6">
			<div className="flex h-full w-full max-w-lg flex-col items-center justify-center gap-12 text-center">
				{/* Error Title Section */}
				<div className="flex w-full flex-col items-center justify-center font-mono">
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
				<div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/20">
					<p className="wrap-break-words md:text-md text-xs leading-relaxed font-medium text-slate-700 sm:text-sm dark:text-slate-300">
						ขออภัย ไม่พบหน้าที่คุณร้องขอ กรุณาตรวจสอบ URL หรือกลับไปหน้าหลัก
					</p>
				</div>

				{/* Action Button */}
				<div className="flex w-full flex-row justify-center gap-2">
					<Button
						className="w-full transform transition-all duration-200 hover:scale-105"
						size="lg"
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
			<div className="text-center text-xs text-slate-500/50 sm:text-sm dark:text-slate-400/50">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
}
