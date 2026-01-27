import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost" | "none";
	isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	isLoading,
	className = "",
	disabled,
	...props
}) => {
	// Updated base style: Rounded-xl, font-medium, proper padding
	const baseStyle =
		"px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base";

	const variants = {
		primary:
			"bg-forest-800 hover:bg-forest-900 text-white focus:ring-forest-500 shadow-sm hover:shadow-md",
		secondary:
			"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500 shadow-sm",
		danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
		ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-forest-800 dark:hover:text-white",
		none: "",
	};

	return (
		<button
			className={`${baseStyle} ${variants[variant]} ${className}`}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-3 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
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
				</>
			) : (
				children
			)}
		</button>
	);
};
