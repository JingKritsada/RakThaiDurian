import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, XCircle } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { userService } from "@/services/userService";
import Button from "@/components/Button";
import { InputField } from "@/components/FormInputs";
import { getErrorMessage } from "@/services/api";

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

	const inputClass =
		"w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-forest-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800 transition-colors";

	return (
		<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
			<div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<div>
					<h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
						ข้อมูลส่วนตัว
					</h2>
					<p className="text-slate-500 dark:text-slate-400">
						จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ
					</p>
				</div>
				{!isEditing ? (
					<Button onClick={() => setIsEditing(true)}>แก้ไขโปรไฟล์</Button>
				) : (
					<div className="flex gap-3">
						<Button
							disabled={isLoading}
							variant="outline"
							onClick={() => {
								setIsEditing(false);
								// Reset back to user data
								if (user) {
									setFormData({
										name: user.name || "",
										email: user.email || "",
										username: user.username || "",
									});
								}
							}}
						>
							ยกเลิก
						</Button>
						<Button disabled={isLoading} onClick={handleSubmit}>
							{isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
						</Button>
					</div>
				)}
			</div>

			<form className="max-w-2xl space-y-6" onSubmit={handleSubmit}>
				<InputField
					disabled={!isEditing || isLoading}
					icon={User}
					inputClassName={inputClass}
					label="ชื่อ-นามสกุล"
					name="name"
					placeholder="กรุณากรอกชื่อ-นามสกุล"
					type="text"
					value={formData.name}
					onChange={handleChange}
				/>

				<InputField
					disabled={!isEditing || isLoading}
					icon={User}
					inputClassName={inputClass}
					label="ชื่อผู้ใช้ (Username)"
					name="username"
					placeholder="กรุณากรอกชื่อผู้ใช้"
					type="text"
					value={formData.username}
					onChange={handleChange}
				/>

				<InputField
					disabled={!isEditing || isLoading}
					icon={Mail}
					inputClassName={inputClass}
					label="อีเมล"
					name="email"
					placeholder="email@example.com"
					type="email"
					value={formData.email}
					onChange={handleChange}
				/>

				<div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
					<div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
						<div className="rounded-full bg-white p-3 shadow-sm dark:bg-slate-800">
							<Shield className="text-forest-600" size={24} />
						</div>
						<div>
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400">
								ระดับสิทธิ์
							</p>
							<p className="font-semibold text-slate-900 capitalize dark:text-white">
								Owner
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
			</form>
		</div>
	);
}
