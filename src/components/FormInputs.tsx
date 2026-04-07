import type {
	InputFieldProps,
	TextAreaFieldProps,
	ToggleSwitchProps,
	MultiSelectFieldProps,
} from "@/interfaces/inputInterface";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check, ChevronUp } from "lucide-react";

import Button from "@/components/Button";

export function InputField({
	label,
	error,
	className = "",
	inputClassName = "",
	icon: Icon,
	suffix,
	...props
}: InputFieldProps) {
	return (
		<div className={className}>
			{label && (
				<label className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
					{label} {props.required && <span className="text-red-500">*</span>}
				</label>
			)}

			<div className="relative h-full">
				<input
					className={` ${
						inputClassName
							? inputClassName
							: "border bg-white text-slate-900 shadow-sm outline-none dark:bg-slate-700 dark:text-white"
					} ${Icon ? "pl-12" : "pl-4"} ${suffix ? "pr-12" : "pr-4"} ${error ? "border-red-500" : "border-slate-300 dark:border-slate-600"} relative h-12 w-full rounded-xl border bg-white py-3.5 text-slate-900 shadow-sm transition-all outline-none dark:bg-slate-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
					{...props}
				/>
				{Icon && <Icon className="absolute top-3.5 left-4 text-slate-400" size={20} />}
				{suffix && <div className="absolute top-1.5 right-2 text-slate-400">{suffix}</div>}
			</div>
			{error && <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>}
		</div>
	);
}

export function TextAreaField({
	label,
	error,
	className = "",
	inputClassName = "",
	icon: Icon,
	...props
}: TextAreaFieldProps) {
	return (
		<div className={className}>
			<label className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
				{label} {props.required && <span className="text-red-500">*</span>}
			</label>
			<div className="relative">
				<textarea
					className={` ${
						inputClassName
							? inputClassName
							: "w-full resize-none rounded-xl border bg-white p-4 text-slate-900 shadow-sm transition-all outline-none dark:bg-slate-700 dark:text-white"
					} ${Icon ? "pl-12" : ""} ${error ? "border-red-500" : "border-slate-300 dark:border-slate-600"} `}
					{...props}
				/>
				{Icon && <Icon className="absolute top-4 left-4 text-slate-400" size={20} />}
			</div>
			{error && <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>}
		</div>
	);
}

export function ToggleSwitch({
	label,
	description,
	checked,
	onChange,
	className = "",
}: ToggleSwitchProps) {
	return (
		<div
			className={`flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50 ${className}`}
		>
			<div>
				<div className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</div>
				{description && (
					<div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
						{description}
					</div>
				)}
			</div>
			<button
				className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-forest-600" : "bg-slate-200 dark:bg-slate-600"} `}
				type="button"
				onClick={() => onChange(!checked)}
			>
				<span className="sr-only">Use setting</span>
				<span
					aria-hidden="true"
					className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-3" : "translate-x-0"} `}
				/>
			</button>
		</div>
	);
}

export function MultiSelectField({
	label,
	options,
	value,
	onChange,
	placeholder = "เลือกรายการ...",
	error,
	className = "",
}: MultiSelectFieldProps) {
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
		<div ref={containerRef} className={className}>
			<label className="mb-2 ml-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
				{label}
			</label>

			<div className="relative">
				<div
					className={`flex min-h-13.5 w-full cursor-pointer flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 dark:bg-slate-700 ${error ? "border-red-500" : "border-slate-300 hover:border-forest-500 dark:border-slate-600"} ${isOpen ? "border-forest-500 ring-2 ring-forest-200" : ""} `}
					role="button"
					tabIndex={0}
					onClick={() => setIsOpen(!isOpen)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
					}}
				>
					{selectedOptions.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{selectedOptions.map((opt) => (
								<span
									key={opt.id}
									className="inline-flex items-center gap-2 rounded-lg border border-forest-200 bg-forest-100 px-3 py-2 text-xs font-medium text-forest-800 dark:border-forest-800 dark:bg-forest-900/40 dark:text-forest-300"
								>
									{opt.label}
									<Button
										className="bg-danger-200! bg-opcity-0! hover:bg-opacity-100! min-h-0! w-auto! p-1!"
										type="button"
										variant="dangerghost"
										onClick={(e) => {
											e.stopPropagation();
											handleSelect(opt.id);
										}}
									>
										<X size={14} strokeWidth={3} />
									</Button>
								</span>
							))}
						</div>
					) : (
						<span className="px-1 text-slate-400">{placeholder}</span>
					)}

					{isOpen ? (
						<ChevronUp className="ml-auto shrink-0 text-slate-400" size={20} />
					) : (
						<ChevronDown className="ml-auto shrink-0 text-slate-400" size={20} />
					)}
				</div>

				{/* Dropdown Menu */}
				{isOpen && (
					<div className="animate-in fade-in zoom-in-95 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl duration-100 dark:border-slate-700 dark:bg-slate-800">
						{options.length > 0 ? (
							<div className="p-1">
								{options.map((option) => {
									const isSelected = value.includes(option.id);

									return (
										<div
											key={option.id}
											aria-selected={isSelected}
											className={`mb-0.5 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${
												isSelected
													? "bg-forest-50 text-forest-900 dark:bg-forest-900/30 dark:text-forest-200"
													: "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
											} `}
											role="option"
											tabIndex={0}
											onClick={() => handleSelect(option.id)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ")
													handleSelect(option.id);
											}}
										>
											<span>{option.label}</span>
											{isSelected && (
												<Check
													className="text-forest-600 dark:text-forest-400"
													size={16}
												/>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className="p-4 text-center text-sm text-slate-500">
								ไม่พบข้อมูล
							</div>
						)}
					</div>
				)}
			</div>

			{error && <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>}
		</div>
	);
}
