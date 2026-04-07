import { useState, useEffect } from "react";
import { CheckCircle, Mail, Pen, Shield, User, XCircle } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { userService } from "@/services/userService";
import Button from "@/components/Button";
import { InputField } from "@/components/FormInputs";
import { getErrorMessage } from "@/services/api";
import { USER_ROLE_LABELS } from "@/utils/constants";

export default function ManageProfileTab() {
	const { user } = useAuth();
	const { showAlert } = useAlert();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		username: "",
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				username: user.username || "",
			});
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setIsLoading(true);
		try {
			// This relies on updateProfile API existing in userService.
			// It might need to be implemented or adjusted if your backend takes different fields.
			if (userService.updateProfile) {
				await userService.updateProfile(formData);
				showAlert("สำเร็จ", "อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว", "success");
				setIsEditing(false);
			} else {
				showAlert("แจ้งเตือน", "ไม่พบเมธอดในการอัปเดตโปรไฟล์", "warning");
			}
		} catch (error) {
			showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
		} finally {
			setIsLoading(false);
		}
	};

	const inputClassname =
		"border bg-white text-slate-900 shadow-sm outline-none dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800 transition-colors";

	return (
		<div className="space-y-6">
			<div className="relative overflow-hidden rounded-3xl bg-forest-900 p-8 text-white shadow-xl">
				<div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
				<div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div>
						<h1 className="mb-2 text-3xl font-bold">จัดการข้อมูลส่วนตัว</h1>
						<p className="text-lg text-forest-100 opacity-90">
							ปรับข้อมูลและแก้ไขโปรไฟล์ของคุณ
						</p>
					</div>

					{isEditing ? (
						<div className="flex w-full flex-row gap-3 sm:w-auto">
							<Button
								className="dark:bg-opacity-50 transform font-semibold! whitespace-nowrap shadow-xl transition-transform dark:border-none"
								size="lg"
								variant="secondary"
								onClick={() => setIsEditing(false)}
							>
								ยกเลิก
							</Button>

							<Button
								className="dark:bg-opacity-50 transform font-semibold! whitespace-nowrap shadow-xl transition-transform dark:border-none"
								size="lg"
								variant="secondary"
								onClick={handleSubmit}
							>
								บันทึก
							</Button>
						</div>
					) : (
						<Button
							className="dark:bg-opacity-50 transform font-semibold! whitespace-nowrap shadow-xl transition-transform dark:border-none"
							size="lg"
							variant="secondary"
							onClick={() => setIsEditing(true)}
						>
							<Pen size={22} strokeWidth={3} />
							แก้ไขข้อมูลส่วนตัว
						</Button>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm duration-300 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
				<div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-6 dark:border-slate-700">
					<div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
						<div className="rounded-full bg-white p-3 shadow-sm dark:bg-slate-800">
							<Shield className="text-green-500" size={24} />
						</div>
						<div>
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								ระดับสิทธิ์
							</p>
							<p className="font-semibold text-slate-900 capitalize dark:text-white">
								{user?.role
									? USER_ROLE_LABELS[user.role as keyof typeof USER_ROLE_LABELS]
									: "ไม่ทราบสิทธิ์"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
						<div className="rounded-full bg-white p-3 shadow-sm dark:bg-slate-800">
							{user?.is_active !== false ? (
								<CheckCircle className="text-green-500" size={24} />
							) : (
								<XCircle className="text-red-500" size={24} />
							)}
						</div>
						<div>
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								สถานะบัญชี
							</p>
							<p className="font-semibold text-slate-900 dark:text-white">
								{user?.is_active !== false ? "เปิดใช้งาน" : "ระงับการใช้งาน"}
							</p>
						</div>
					</div>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<InputField
						disabled={!isEditing || isLoading}
						icon={User}
						inputClassName={inputClassname}
						label="ชื่อ-นามสกุล"
						name="name"
						placeholder="กรุณากรอกชื่อ-นามสกุล"
						type="text"
						value={formData.name}
						onChange={handleChange}
					/>

					<InputField
						required
						disabled={!isEditing || isLoading}
						icon={User}
						inputClassName={inputClassname}
						label="ชื่อผู้ใช้ (Username)"
						name="username"
						placeholder="กรุณากรอกชื่อผู้ใช้"
						type="text"
						value={formData.username}
						onChange={handleChange}
					/>

					<InputField
						required
						disabled={!isEditing || isLoading}
						icon={Mail}
						inputClassName={inputClassname}
						label="อีเมล"
						name="email"
						placeholder="email@example.com"
						type="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</form>
			</div>
		</div>
	);
}
