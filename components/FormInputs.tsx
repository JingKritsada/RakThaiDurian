import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import {
	InputFieldProps,
	TextAreaFieldProps,
	ToggleSwitchProps,
	MultiSelectFieldProps,
} from "../interface/inputInterface";

// --- Components ---

export const InputField: React.FC<InputFieldProps> = ({
	label,
	error,
	className = "",
	icon: Icon,
	suffix,
	...props
}) => {
	return (
		<div className={className}>
			<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
				{label} {props.required && <span className="text-red-500">*</span>}
			</label>
			<div className="relative">
				<input
					className={`
            w-full h-[54px] py-3.5 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all outline-none relative appearance-none
            ${Icon ? "pl-12" : "pl-4"}
            ${suffix ? "pr-12" : "pr-4"}
            ${
				error
					? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
					: "border-slate-300 dark:border-slate-600 focus:border-forest-500 focus:ring-2 focus:ring-forest-200"
			}
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          `}
					{...props}
				/>
				{Icon && <Icon className="absolute left-3 top-[17px] text-slate-400" size={20} />}
				{suffix && (
					<div className="absolute right-3 top-[15px] text-slate-400">{suffix}</div>
				)}
			</div>
			{error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
		</div>
	);
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
	label,
	error,
	className = "",
	icon: Icon,
	...props
}) => {
	return (
		<div className={className}>
			<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
				{label} {props.required && <span className="text-red-500">*</span>}
			</label>
			<div className="relative">
				<textarea
					className={`
            w-full p-4 rounded-xl border bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all outline-none resize-none
            ${Icon ? "pl-12" : ""}
            ${
				error
					? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
					: "border-slate-300 dark:border-slate-600 focus:border-forest-500 focus:ring-2 focus:ring-forest-200"
			}
          `}
					{...props}
				/>
				{Icon && <Icon className="absolute left-3 top-3.5 text-slate-400" size={20} />}
			</div>
			{error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
		</div>
	);
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	label,
	description,
	checked,
	onChange,
	className = "",
}) => {
	return (
		<div
			className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}
		>
			<div>
				<div className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</div>
				{description && (
					<div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
						{description}
					</div>
				)}
			</div>
			<button
				type="button"
				onClick={() => onChange(!checked)}
				className={`
          relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2
          ${checked ? "bg-forest-600" : "bg-slate-200 dark:bg-slate-600"}
        `}
			>
				<span className="sr-only">Use setting</span>
				<span
					aria-hidden="true"
					className={`
            pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
				/>
			</button>
		</div>
	);
};

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
	label,
	options,
	value,
	onChange,
	placeholder = "เลือกรายการ...",
	error,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (optionId: string) => {
		if (value.includes(optionId)) {
			onChange(value.filter((id) => id !== optionId));
		} else {
			onChange([...value, optionId]);
		}
	};

	const selectedOptions = options.filter((opt) => value.includes(opt.id));

	return (
		<div className={className} ref={containerRef}>
			<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
				{label}
			</label>

			<div className="relative">
				<div
					onClick={() => setIsOpen(!isOpen)}
					className={`
            w-full min-h-[54px] px-3 py-2 rounded-xl border bg-white dark:bg-slate-700 cursor-pointer flex items-center justify-between flex-wrap gap-2
            ${
				error
					? "border-red-500"
					: "border-slate-300 dark:border-slate-600 hover:border-forest-500"
			}
            ${isOpen ? "ring-2 ring-forest-200 border-forest-500" : ""}
          `}
				>
					{selectedOptions.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{selectedOptions.map((opt) => (
								<span
									key={opt.id}
									className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border border-forest-200 dark:border-forest-800"
								>
									{opt.label}
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleSelect(opt.id);
										}}
										className="ml-1.5 hover:text-forest-900 focus:outline-none"
									>
										<X size={14} />
									</button>
								</span>
							))}
						</div>
					) : (
						<span className="text-slate-400 px-1">{placeholder}</span>
					)}
					<ChevronDown size={20} className="text-slate-400 shrink-0 ml-auto" />
				</div>

				{/* Dropdown Menu */}
				{isOpen && (
					<div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-100">
						{options.length > 0 ? (
							<div className="p-1">
								{options.map((option) => {
									const isSelected = value.includes(option.id);
									return (
										<div
											key={option.id}
											onClick={() => handleSelect(option.id)}
											className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm mb-0.5
                        ${
							isSelected
								? "bg-forest-50 dark:bg-forest-900/30 text-forest-900 dark:text-forest-200"
								: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
						}
                      `}
										>
											<span>{option.label}</span>
											{isSelected && (
												<Check
													size={16}
													className="text-forest-600 dark:text-forest-400"
												/>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className="p-4 text-center text-slate-500 text-sm">
								ไม่พบข้อมูล
							</div>
						)}
					</div>
				)}
			</div>
			{error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
		</div>
	);
};
