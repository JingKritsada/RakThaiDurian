import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useAlert } from "../context/AlertContext";
import { Button } from "./Button";
import { Menu, X, Sun, Moon, Monitor, LogOut, User as UserIcon, Type } from "lucide-react";
import { FontSize } from "../interface/themeInterface";

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
	<div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
		<button
			onClick={() => setFontSize("small")}
			className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${fontSize === "small" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรเล็ก"
		>
			<span className="text-xs">ก</span>
		</button>
		<button
			onClick={() => setFontSize("medium")}
			className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${fontSize === "medium" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรปกติ"
		>
			<span className="text-sm">ก</span>
		</button>
		<button
			onClick={() => setFontSize("large")}
			className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${fontSize === "large" ? "bg-white dark:bg-slate-600 shadow-sm text-forest-800 dark:text-white font-bold" : "text-slate-400"}`}
			title="ขนาดตัวอักษรใหญ่"
		>
			<span className="text-lg">ก</span>
		</button>
	</div>
);

export const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const { theme, toggleTheme, fontSize, setFontSize } = useTheme();
	const { showConfirm } = useAlert();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
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
		<header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-3 group">
						<div className="w-10 h-10 bg-forest-800 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-forest-900 transition-colors">
							<span className="font-bold text-xl">ท</span>
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-lg text-slate-900 dark:text-white leading-none">
								ทุเรียน
								<span className="text-forest-600 dark:text-forest-400">รักไทย</span>
							</span>
							<span className="text-xs text-slate-500 dark:text-slate-400">
								สารบัญสวนคุณภาพ
							</span>
						</div>
					</Link>

					{/* Desktop Controls */}
					<div className="hidden md:flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-xs text-slate-400 font-medium mr-1">
								ขนาดอักษร
							</span>
							<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
						</div>

						<button
							onClick={toggleTheme}
							className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
							title="เปลี่ยนโหมดสี"
						>
							<ThemeIcon theme={theme} />
						</button>

						<div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

						{user ? (
							<div className="flex items-center gap-3">
								<Link to="/owner">
									<Button variant="ghost" className="!px-3 !rounded-xl">
										<UserIcon size={20} className="mr-2" />
										<span className="font-medium">{user.name}</span>
									</Button>
								</Link>
								<Button
									variant="secondary"
									onClick={handleLogout}
									className="!px-4 !py-2 !rounded-xl text-sm"
								>
									<LogOut size={18} className="mr-2" />
									ออกจากระบบ
								</Button>
							</div>
						) : (
							<Link to="/login">
								<Button className="!rounded-xl !py-2.5 !shadow-md shadow-forest-800/20">
									เข้าสู่ระบบเจ้าของสวน
								</Button>
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-in slide-in-from-top-2">
					<div className="flex flex-col gap-4">
						<div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
							<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
								<Type size={18} />
								<span className="text-sm font-medium">ขนาดตัวอักษร</span>
							</div>
							<FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />
						</div>

						<div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
							<span className="text-sm font-medium text-slate-600 dark:text-slate-300">
								โหมดการแสดงผล
							</span>
							<button
								onClick={toggleTheme}
								className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600"
							>
								<ThemeIcon theme={theme} />
								<span className="text-sm">
									{theme === "light"
										? "โหมดสว่าง"
										: theme === "dark"
											? "โหมดมืด"
											: "ตามระบบ"}
								</span>
							</button>
						</div>

						<div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>

						{user ? (
							<>
								<Link to="/owner" onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										variant="primary"
										className="w-full justify-center !bg-forest-800"
									>
										<UserIcon size={20} className="mr-2" />
										จัดการสวน ({user.name})
									</Button>
								</Link>
								<Button
									variant="danger"
									onClick={handleLogout}
									className="w-full justify-center"
								>
									<LogOut size={20} className="mr-2" />
									ออกจากระบบ
								</Button>
							</>
						) : (
							<Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
								<Button className="w-full justify-center !py-3">
									เข้าสู่ระบบเจ้าของสวน
								</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
};
