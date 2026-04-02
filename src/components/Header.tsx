import type { FontSize } from "@/interfaces/themeInterface";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Monitor, LogOut, User as UserIcon, Type } from "lucide-react";

import Button from "@/components/Button";
import { useAuth } from "@/providers/AuthContext";
import { useTheme } from "@/providers/ThemeContext";
import { useAlert } from "@/providers/AlertContext";
import { Z_INDEX } from "@/utils/zIndex";

function ThemeIcon({ theme }: { theme: string }) {
	switch (theme) {
		case "light":
			return <Sun size={20} />;
		case "dark":
			return <Moon size={20} />;
		case "system":
			return <Monitor size={20} />;
		default:
			return <Sun size={20} />;
	}
}
function FontSizeControls({
	fontSize,
	setFontSize,
}: {
	fontSize: FontSize;
	setFontSize: (size: FontSize) => void;
}) {
	return (
		<div className="flex h-full items-center gap-0.5 rounded-xl border border-slate-300 bg-transparent p-0.5 text-slate-700 dark:border-slate-600 dark:text-slate-200">
			<Button
				className={`rounded-ld flex aspect-square h-full min-h-0! items-center justify-center p-0! transition-all ${fontSize === "small" ? "bg-slate-200 font-bold text-forest-800 shadow-sm dark:bg-slate-600 dark:text-white" : "text-slate-400"}`}
				title="ขนาดตัวอักษรเล็ก"
				variant="none"
				onClick={() => setFontSize("small")}
			>
				<span className="text-xs">ก</span>
			</Button>
			<Button
				className={`rounded-ld flex aspect-square h-full min-h-0! items-center justify-center p-0! transition-all ${fontSize === "medium" ? "bg-slate-200 font-bold text-forest-800 shadow-sm dark:bg-slate-600 dark:text-white" : "text-slate-400"}`}
				title="ขนาดตัวอักษรปกติ"
				variant="none"
				onClick={() => setFontSize("medium")}
			>
				<span className="text-sm">ก</span>
			</Button>
			<Button
				className={`flex aspect-square h-full min-h-0! items-center justify-center rounded-lg p-0! transition-all ${fontSize === "large" ? "bg-slate-200 font-bold text-forest-800 shadow-sm dark:bg-slate-600 dark:text-white" : "text-slate-400"}`}
				title="ขนาดตัวอักษรใหญ่"
				variant="none"
				onClick={() => setFontSize("large")}
			>
				<span className="text-lg">ก</span>
			</Button>
		</div>
	);
}

export default function Header() {
	const { user, logout } = useAuth();
	const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
	const { showConfirm } = useAlert();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		isMobileMenuOpen && setIsMobileMenuOpen(false);
		showConfirm(
			"ยืนยันการออกจากระบบ",
			"คุณต้องการออกจากระบบใช่หรือไม่?",
			async () => {
				await logout();
				navigate("/");
				setIsMobileMenuOpen(false);
			},
			"warning",
			"ออกจากระบบ"
		);
	};

	return (
		<>
			{isMobileMenuOpen && (
				<div
					aria-hidden="true"
					className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-md duration-200 md:hidden"
					style={{ zIndex: Z_INDEX.mobileNavBackdrop }}
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
			<header
				className="sticky top-0 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
				style={{ zIndex: Z_INDEX.mobileNavHeader }}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6">
					<div className="flex h-18 items-center justify-between py-3">
						{/* Logo */}
						<Link
							className="group flex h-full items-center gap-3 transition-transform hover:scale-105"
							to="/"
						>
							<div className="flex aspect-square h-full items-center justify-center rounded-xl bg-forest-800 text-white shadow-md transition-colors group-hover:bg-forest-900">
								<span className="font-heading text-xl font-bold">ท</span>
							</div>
							<div className="flex flex-col">
								<span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
									ทุเรียน
									<span className="font-heading text-forest-600 dark:text-forest-400">
										รักไทย
									</span>
								</span>
								<span className="text-xs text-slate-500 dark:text-slate-400">
									สารบัญสวนคุณภาพ
								</span>
							</div>
						</Link>

						{/* Desktop Controls */}
						<div className="hidden h-full items-center gap-2 md:flex">
							<div className="flex h-full items-center gap-2">
								<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
							</div>

							<Button
								className="aspect-square h-full p-0!"
								title="เปลี่ยนโหมดสี"
								variant="outline"
								onClick={toggleTheme}
							>
								<ThemeIcon theme={theme} />
							</Button>

							<div className="mx-2 h-full w-px bg-slate-200 dark:bg-slate-700" />

							{user ? (
								<div className="flex h-full items-center gap-2">
									<Link className="h-full" to="/owner">
										<Button
											className="aspect-square h-full p-0!"
											variant="secondary"
										>
											<UserIcon size={20} strokeWidth={3} />
										</Button>
									</Link>
									<Button
										className="h-full"
										variant="secondary"
										onClick={handleLogout}
									>
										<LogOut className="mr-2" size={20} strokeWidth={3} />
										ออกจากระบบ
									</Button>
								</div>
							) : (
								<Link to="/login">
									<Button className="h-full" variant="primary">
										เข้าสู่ระบบเจ้าของสวน
									</Button>
								</Link>
							)}
						</div>

						{/* Mobile Menu Button */}
						<Button
							className="aspect-square h-full p-0! md:hidden"
							variant="ghost"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="animate-in slide-in-from-top-2 border-t border-slate-200 bg-white p-4 shadow-xl md:hidden dark:border-slate-800 dark:bg-slate-900">
						<div className="flex flex-col gap-2">
							<div className="flex h-14 items-center justify-between rounded-2xl bg-slate-100 p-2 pl-4 dark:bg-slate-800">
								<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
									<Type size={18} />
									<span className="text-sm font-medium">ขนาดตัวอักษร</span>
								</div>
								<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
							</div>

							<div className="flex h-14 items-center justify-between rounded-2xl bg-slate-100 p-2 pl-4 dark:bg-slate-800">
								<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
									โหมดการแสดงผล
								</span>
								<Button className="gap-3" variant="outline" onClick={toggleTheme}>
									<ThemeIcon theme={theme} />
									<span className="text-sm">
										{theme === "light"
											? "โหมดสว่าง"
											: theme === "dark"
												? "โหมดมืด"
												: "ตามระบบ"}
									</span>
								</Button>
							</div>

							<div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />

							{user ? (
								<>
									<Link to="/owner" onClick={() => setIsMobileMenuOpen(false)}>
										<Button
											className="w-full justify-center py-3!"
											size="md"
											variant="primary"
										>
											<UserIcon className="mr-2" size={20} strokeWidth={3} />
											จัดการสวน ({user.name})
										</Button>
									</Link>
									<Button
										className="w-full justify-center py-3!"
										size="md"
										variant="danger"
										onClick={handleLogout}
									>
										<LogOut className="mr-2" size={20} strokeWidth={3} />
										ออกจากระบบ
									</Button>
								</>
							) : (
								<Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										className="w-full justify-center py-3!"
										size="md"
										variant="primary"
									>
										เข้าสู่ระบบเจ้าของสวน
									</Button>
								</Link>
							)}
						</div>
					</div>
				)}
			</header>
		</>
	);
}
