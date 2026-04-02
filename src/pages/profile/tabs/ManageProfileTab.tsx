import React, { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, XCircle } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import { userService } from "@/services/userService";
import { Button } from "@/components/Button";
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
		<div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
				<div>
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
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
							disabled={isLoading}
						>
							ยกเลิก
						</Button>
						<Button onClick={handleSubmit} disabled={isLoading}>
							{isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
						</Button>
					</div>
				)}
			</div>

			<form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
				<InputField name="name" type="text" label="ชื่อ-นามสกุล" icon={User} value={formData.name} onChange={handleChange} disabled={!isEditing || isLoading} placeholder="กรุณากรอกชื่อ-นามสกุล" inputClassName={inputClass} />

				<InputField name="username" type="text" label="ชื่อผู้ใช้ (Username)" icon={User} value={formData.username} onChange={handleChange} disabled={!isEditing || isLoading} placeholder="กรุณากรอกชื่อผู้ใช้" inputClassName={inputClass} />

				<InputField name="email" type="email" label="อีเมล" icon={Mail} value={formData.email} onChange={handleChange} disabled={!isEditing || isLoading} placeholder="email@example.com" inputClassName={inputClass} />

				<div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
					<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-4">
						<div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm">
							<Shield className="text-forest-600" size={24} />
						</div>
						<div>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ระดับสิทธิ์</p>
							<p className="font-semibold text-slate-900 dark:text-white capitalize">
								{user?.role || "Owner"}
							</p>
						</div>
					</div>
					
					<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-4">
						<div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm">
							{user?.is_active !== false ? (
								<CheckCircle className="text-green-500" size={24} />
							) : (
								<XCircle className="text-red-500" size={24} />
							)}
						</div>
						<div>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-medium">สถานะบัญชี</p>
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
