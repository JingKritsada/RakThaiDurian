import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "./Button";

export type AlertType = "success" | "error" | "warning" | "info";

export interface ModalAlertProps {
	isOpen: boolean;
	type: AlertType;
	title: string;
	message: string;
	isConfirm?: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
}

const icons = {
	success: <CheckCircle className="w-12 h-12 text-green-500" />,
	error: <AlertCircle className="w-12 h-12 text-red-500" />,
	warning: <AlertTriangle className="w-12 h-12 text-amber-500" />,
	info: <Info className="w-12 h-12 text-blue-500" />,
};

const bgColors = {
	success: "bg-green-50 dark:bg-green-900/20",
	error: "bg-red-50 dark:bg-red-900/20",
	warning: "bg-amber-50 dark:bg-amber-900/20",
	info: "bg-blue-50 dark:bg-blue-900/20",
};

export const ModalAlert: React.FC<ModalAlertProps> = ({
	isOpen,
	type,
	title,
	message,
	isConfirm,
	onClose,
	onConfirm,
	confirmText = "ตกลง",
	cancelText = "ยกเลิก",
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			<div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 transform scale-100 transition-all animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
				>
					<X size={20} />
				</button>

				<div className="flex flex-col items-center text-center">
					<div className={`p-4 rounded-full mb-4 ${bgColors[type]}`}>{icons[type]}</div>

					<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
						{title}
					</h3>

					<p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
						{message}
					</p>

					<div className="flex gap-3 w-full">
						{isConfirm ? (
							<>
								<Button
									variant="secondary"
									onClick={onClose}
									className="flex-1 !rounded-xl"
								>
									{cancelText}
								</Button>
								<Button
									onClick={() => {
										if (onConfirm) onConfirm();
										onClose();
									}}
									className={`flex-1 !rounded-xl ${type === "error" ? "!bg-red-600 hover:!bg-red-700" : ""}`}
								>
									{confirmText}
								</Button>
							</>
						) : (
							<Button onClick={onClose} className="w-full !rounded-xl">
								{confirmText}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
