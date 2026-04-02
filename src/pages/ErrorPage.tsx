import React from "react";

import { Button } from "@/components/Button";
import { FuzzyText } from "@/components/FuzzyText";

interface ErrorPageProps {
	error: Error;
	reset: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
	return (
		<div className="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-between p-6">
			<div className="flex h-full w-full max-w-lg flex-col items-center justify-center gap-12 text-center">
				{/* Error Title Section */}
				<div className="flex w-full flex-col items-center justify-center font-mono">
					<div className="relative w-full">
						<FuzzyText
							baseIntensity={0.15}
							color="rgba(239, 68, 68, 0.9)"
							fontSize="9rem"
							fontWeight={700}
							hoverIntensity={0.35}
						>
							ERROR
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
							Something went wrong !
						</FuzzyText>
					</div>
				</div>

				{/* Error Message Section */}
				<div className="w-full rounded-lg border border-red-200 bg-red-50 px-6 py-4 dark:border-red-800 dark:bg-red-900/20">
					<p className="warp-break-words md:text-md text-xs leading-relaxed font-medium text-red-700 sm:text-sm dark:text-red-300">
						{error.message || "An unexpected error occurred."}
					</p>
				</div>

				{/* Action Button */}
				<div className="flex w-full justify-center">
					<Button
						className="w-full transform transition-all duration-200 hover:scale-105"
						size="lg"
						variant="danger"
						onClick={() => reset()}
					>
						ลองอีกครั้ง
					</Button>
				</div>
			</div>

			{/* Additional Info */}
			<div className="w-full text-center text-xs text-slate-500/50 sm:text-sm dark:text-slate-400/50">
				<p>
					หากยังพบปัญหานี้อยู่ กรุณาติดต่อฝ่ายสนับสนุน หรือรีเฟรชหน้าเว็บเพื่อแก้ไขปัญหา
				</p>
			</div>
		</div>
	);
};
