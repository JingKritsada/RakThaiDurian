import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { getErrorMessage } from "@/services/api";
import Button from "@/components/Button";
import { InputField } from "@/components/FormInputs";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			await login(username, password, { skipGlobalLoading: true });
			navigate("/owner");
		} catch (err: unknown) {
			setError(getErrorMessage(err));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="h-full overflow-y-auto">
			<div className="flex min-h-full items-center justify-center p-4 transition-colors sm:p-6">
				<div className="my-8 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl sm:p-10 dark:border-slate-700 dark:bg-slate-800">
					<div className="mb-10 text-center">
						<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-400">
							<Lock size={32} />
						</div>
						<h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
							เข้าสู่ระบบเจ้าของสวน
						</h1>
						<p className="text-slate-500 dark:text-slate-400">
							กรุณาระบุข้อมูลเพื่อจัดการสวนของคุณ
						</p>
					</div>

					{error && (
						<div className="mb-8 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
							<span className="text-sm font-medium">{error}</span>
						</div>
					)}

					<form className="mb-0 space-y-6" onSubmit={handleSubmit}>
						<InputField
							required
							icon={Mail}
							label="ชื่อผู้ใช้ (Username)"
							placeholder="ระบุชื่อผู้ใช้ของคุณ"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<InputField
							required
							icon={Lock}
							label="รหัสผ่าน (Password)"
							placeholder="ระบุรหัสผ่าน"
							suffix={
								<Button
									className="rounded-full! p-2! transition-colors"
									tabIndex={-1}
									type="button"
									variant="ghost"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</Button>
							}
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<div className="pt-2">
							<Button
								className="w-full"
								isLoading={isSubmitting}
								size="lg"
								type="submit"
								variant="primary"
							>
								เข้าสู่ระบบ
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
