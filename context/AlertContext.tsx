import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ModalAlert, AlertType } from "../components/ModalAlert";

interface AlertState {
	isOpen: boolean;
	type: AlertType;
	title: string;
	message: string;
	isConfirm: boolean;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
}

interface AlertContextType {
	showAlert: (title: string, message: string, type?: AlertType, confirmText?: string) => void;
	showConfirm: (
		title: string,
		message: string,
		onConfirm: () => void,
		type?: AlertType,
		confirmText?: string,
		cancelText?: string
	) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [alertState, setAlertState] = useState<AlertState>({
		isOpen: false,
		type: "info",
		title: "",
		message: "",
		isConfirm: false,
	});

	const showAlert = useCallback(
		(title: string, message: string, type: AlertType = "info", confirmText?: string) => {
			setAlertState({
				isOpen: true,
				type,
				title,
				message,
				isConfirm: false,
				confirmText,
			});
		},
		[]
	);

	const showConfirm = useCallback(
		(
			title: string,
			message: string,
			onConfirm: () => void,
			type: AlertType = "warning",
			confirmText?: string,
			cancelText?: string
		) => {
			setAlertState({
				isOpen: true,
				type,
				title,
				message,
				isConfirm: true,
				onConfirm,
				confirmText,
				cancelText,
			});
		},
		[]
	);

	const closeAlert = () => {
		setAlertState((prev) => ({ ...prev, isOpen: false }));
	};

	return (
		<AlertContext.Provider value={{ showAlert, showConfirm }}>
			{children}
			<ModalAlert {...alertState} onClose={closeAlert} />
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) throw new Error("useAlert must be used within an AlertProvider");
	return context;
};
