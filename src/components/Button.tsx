import React, { type ButtonHTMLAttributes } from "react";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "danger"
	| "ghost"
	| "outline"
	| "dangerghost"
	| "none";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
	xs: "px-3 py-1 text-xs gap-1.5 rounded-md",
	sm: "px-4 py-1.5 text-sm gap-2 rounded-lg",
	md: "px-5 py-2.5 text-base gap-2.5 rounded-xl",
	lg: "px-6 py-3 text-lg gap-3 rounded-xl",
};

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-forest-800 hover:bg-forest-900 text-white shadow-sm hover:shadow-md",
	secondary:
		"bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm",
	danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
	ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-forest-800 dark:hover:text-white",
	dangerghost: "opacity-75 hover:opacity-100 bg-red-600 text-white",
	outline:
		"bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
	none: "",
};

export default function Button({
	children,
	variant = "primary",
	size = "md",
	isLoading = false,
	leftIcon,
	rightIcon,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	const baseStyle =
		"font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

	return (
		<button
			className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					{leftIcon}
					{children}
					{rightIcon}
				</>
			)}
		</button>
	);
}

export function LoadingSpinner(): React.ReactNode {
	return (
		<span className="flex items-center gap-2">
			<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					fill="currentColor"
				/>
			</svg>
			กำลังประมวลผล...
		</span>
	);
}
