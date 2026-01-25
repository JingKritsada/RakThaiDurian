import { InputHTMLAttributes, TextareaHTMLAttributes, ElementType, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface BaseFieldProps {
	label: string;
	error?: string;
	className?: string;
}

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {
	icon?: LucideIcon | ElementType;
	suffix?: ReactNode;
}

export interface TextAreaFieldProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {
	icon?: LucideIcon | ElementType;
}

export interface ToggleSwitchProps extends BaseFieldProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	description?: string;
}

export interface InputOption {
	id: string;
	label: string;
	category?: string;
}

export interface MultiSelectFieldProps extends BaseFieldProps {
	options: InputOption[];
	value: string[];
	onChange: (selectedIds: string[]) => void;
	placeholder?: string;
}
