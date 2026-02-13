import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit2, Sprout } from "lucide-react";

import { orchardService } from "../services/orchardService";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Orchard } from "../interface/orchardInterface";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export const OwnerDashboard: React.FC = () => {
	const { user } = useAuth();
	const { showConfirm, showAlert } = useAlert();
	const [orchards, setOrchards] = useState<Orchard[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = useCallback(async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const data = await orchardService.getOrchardsByOwner(user.id);

			setOrchards(data);
		} catch (error) {
			showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
		} finally {
			setIsLoading(false);
		}
	}, [user, showAlert]);

	useEffect(() => {
		if (user) {
			loadData();
		}
	}, [user, loadData]);

	const handleDelete = (id: number) => {
		showConfirm(
			"ยืนยันการลบ",
			"คุณต้องการลบข้อมูลสวนนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
			async () => {
				try {
					await orchardService.deleteOrchard(id);
					showAlert("สำเร็จ", "ลบข้อมูลสวนเรียบร้อยแล้ว", "success");
					loadData();
				} catch (error) {
					showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
				}
			},
			"error",
			"ยืนยันลบ",
			"ยกเลิก"
		);
	};

	return (
		<div className="h-full overflow-y-auto">
			<div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
				<div className="bg-forest-900 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
					<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
						<div>
							<h1 className="text-3xl font-bold mb-2">ระบบจัดการสวน</h1>
							<p className="text-forest-100 text-lg opacity-90">
								ยินดีต้อนรับ, คุณ{user?.name}
							</p>
						</div>
						<Link to="/owner/add">
							<Button
								className="bg-gold-400 hover:bg-gold-500 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-transform transform hover:scale-105 whitespace-nowrap !min-h-0"
								variant="none"
							>
								<Plus className="mr-2" size={22} />
								ลงทะเบียนสวนใหม่
							</Button>
						</Link>
					</div>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"
							/>
						))}
					</div>
				) : orchards.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
						<div className="bg-forest-50 dark:bg-forest-900/30 p-6 rounded-full mb-6">
							<Sprout className="text-forest-600 dark:text-forest-400" size={48} />
						</div>
						<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
							ยังไม่มีข้อมูลสวนในระบบ
						</h3>
						<p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
							เริ่มต้นสร้างตัวตนออนไลน์ให้สวนทุเรียนของคุณ
							เพื่อให้นักท่องเที่ยวและลูกค้าค้นพบได้ง่ายขึ้น
						</p>
						<Link to="/owner/add">
							<Button>เริ่มสร้างข้อมูลสวนแรกของคุณ</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{orchards.map((orchard) => (
							<div
								key={orchard.id}
								className="relative group bg-white dark:bg-slate-800 rounded-2xl p-1 pb-2 sm:pb-1 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
							>
								<div className="flex-grow">
									<Card orchard={orchard} />
								</div>

								{/* Action Buttons Toolbar */}
								<div className="mt-2 sm:mt-0 sm:absolute sm:top-4 sm:right-4 flex justify-end gap-3 p-3 sm:p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
									<Link to={`/owner/edit/${orchard.id}`}>
										<Button
											className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-forest-100 hover:text-forest-700 dark:hover:bg-forest-900 transition-colors shadow-sm whitespace-nowrap !min-h-0"
											variant="none"
										>
											<Edit2 size={16} /> แก้ไขข้อมูล
										</Button>
									</Link>
									<Button
										className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/70 text-red-600 dark:text-red-300 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors shadow-sm whitespace-nowrap !min-h-0"
										variant="none"
										onClick={() => handleDelete(orchard.id)}
									>
										<Trash2 size={16} /> ลบ
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
