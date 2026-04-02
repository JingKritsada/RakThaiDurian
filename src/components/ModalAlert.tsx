import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

import { Button } from "./Button";

import { Z_INDEX } from "@/utils/zIndex";

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
	success: <CheckCircle className="h-12 w-12 text-green-500" />,
	error: <AlertCircle className="h-12 w-12 text-red-500" />,
	warning: <AlertTriangle className="h-12 w-12 text-amber-500" />,
	info: <Info className="h-12 w-12 text-blue-500" />,
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
		<div
			className="animate-in fade-in fixed inset-0 flex items-center justify-center p-4 duration-200"
			style={{ zIndex: Z_INDEX.alertModal }}
		>
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
				role="button"
				tabIndex={0}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			/>

			<div className="animate-in zoom-in-95 relative w-full max-w-sm scale-100 transform rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-800">
				<Button
					className="absolute top-4 right-4 p-2! dark:hover:bg-slate-900"
					size="sm"
					variant="ghost"
					onClick={onClose}
				>
					<X size={20} />
				</Button>

				<div className="flex flex-col items-center text-center">
					<div className={`mb-6 rounded-full p-4 ${bgColors[type]}`}>{icons[type]}</div>

					<h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
						{title}
					</h3>

					<p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
						{message}
					</p>

					<div className="flex w-full gap-3">
						{isConfirm ? (
							<>
								<Button
									className="w-full"
									size="md"
									variant="secondary"
									onClick={onClose}
								>
									{cancelText}
								</Button>
								<Button
									className="w-full"
									size="md"
									variant={type === "error" ? "danger" : "primary"}
									onClick={() => {
										if (onConfirm) onConfirm();
										onClose();
									}}
								>
									{confirmText}
								</Button>
							</>
						) : (
							<Button className="w-full" size="md" onClick={onClose}>
								{confirmText}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
