import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Monitor, LogOut, User as UserIcon, Type } from "lucide-react";

import { Button } from "./Button";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAlert } from "@/context/AlertContext";
import { FontSize } from "@/interface/themeInterface";
import { Z_INDEX } from "@/utils/zIndex";

const ThemeIcon = ({ theme }: { theme: string }) => {
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
};
const FontSizeControls = ({
	fontSize,
	setFontSize,
}: {
	fontSize: FontSize;
	setFontSize: (size: FontSize) => void;
}) => (
	<div className="flex items-center h-full p-0.5 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 gap-0.5 rounded-xl">
		<Button
			className={`h-full aspect-square flex items-center justify-center rounded-ld transition-all p-0! min-h-0! ${fontSize === "small" ? "bg-slate-200 dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรเล็ก"
			variant="none"
			onClick={() => setFontSize("small")}
		>
			<span className="text-xs">ก</span>
		</Button>
		<Button
			className={`h-full aspect-square flex items-center justify-center rounded-ld transition-all p-0! min-h-0! ${fontSize === "medium" ? "bg-slate-200 dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรปกติ"
			variant="none"
			onClick={() => setFontSize("medium")}
		>
			<span className="text-sm">ก</span>
		</Button>
		<Button
			className={`h-full aspect-square flex items-center justify-center rounded-lg transition-all p-0! min-h-0! ${fontSize === "large" ? "bg-slate-200 dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรใหญ่"
			variant="none"
			onClick={() => setFontSize("large")}
		>
			<span className="text-lg">ก</span>
		</Button>
	</div>
);

export const Header: React.FC = () => {
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
					className="fixed inset-0 bg-black/60 backdrop-blur-md md:hidden animate-in fade-in duration-200"
					style={{ zIndex: Z_INDEX.mobileNavBackdrop }}
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
			<header
				className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
				style={{ zIndex: Z_INDEX.mobileNavHeader }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex justify-between items-center h-18 py-3">
						{/* Logo */}
						<Link
							className="flex items-center gap-3 h-full group hover:scale-105 transition-transform"
							to="/"
						>
							<div className="h-full aspect-square bg-forest-800 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-forest-900 transition-colors">
								<span className="font-heading font-bold text-xl">ท</span>
							</div>
							<div className="flex flex-col">
								<span className="font-heading font-bold text-lg text-slate-900 dark:text-white">
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
						<div className="hidden md:flex items-center gap-2 h-full">
							<div className="flex items-center gap-2 h-full">
								<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
							</div>

							<Button
								className="h-full aspect-square p-0!"
								title="เปลี่ยนโหมดสี"
								variant="outline"
								onClick={toggleTheme}
							>
								<ThemeIcon theme={theme} />
							</Button>

							<div className="h-full w-px bg-slate-200 dark:bg-slate-700 mx-2" />

							{user ? (
								<div className="flex items-center gap-2 h-full">
									<Link className="h-full" to="/owner">
										<Button
											className="h-full aspect-square p-0!"
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
							className="md:hidden h-full aspect-square p-0!"
							variant="ghost"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-in slide-in-from-top-2">
						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 pl-4 rounded-2xl h-14">
								<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
									<Type size={18} />
									<span className="text-sm font-medium">ขนาดตัวอักษร</span>
								</div>
								<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
							</div>

							<div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 pl-4 rounded-2xl h-14">
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

							<div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

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
};
