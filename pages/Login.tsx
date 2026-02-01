import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { Button } from "../components/Button";
import { InputField } from "../components/FormInputs";

export const Login: React.FC = () => {
	const [username, setUsername] = useState("owner");
	const [password, setPassword] = useState("123456");
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
			<div className="min-h-full flex items-center justify-center p-4 sm:p-6 transition-colors">
				<div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100 dark:border-slate-700 my-8">
					<div className="text-center mb-10">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-100 dark:bg-forest-900/50 text-forest-700 dark:text-forest-400 mb-4">
							<Lock size={32} />
						</div>
						<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
							เข้าสู่ระบบเจ้าของสวน
						</h1>
						<p className="text-slate-500 dark:text-slate-400">
							กรุณาระบุข้อมูลเพื่อจัดการสวนของคุณ
						</p>
					</div>

					{error && (
						<div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300">
							<AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
							<span className="text-sm font-medium">{error}</span>
						</div>
					)}

					<form className="space-y-6 mb-0" onSubmit={handleSubmit}>
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
									className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors !p-0 rounded-full"
									tabIndex={-1}
									type="button"
									variant="none"
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
								className="w-full justify-center py-3.5 text-lg shadow-lg shadow-forest-900/20"
								isLoading={isSubmitting}
								type="submit"
							>
								เข้าสู่ระบบ
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
