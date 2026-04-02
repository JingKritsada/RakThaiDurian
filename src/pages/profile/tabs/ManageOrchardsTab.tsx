import type { Orchard } from "@/interfaces/orchardInterface";

import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, Sprout } from "lucide-react";

import orchardService from "@/services/orchardService";
import { getErrorMessage } from "@/services/api";
import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function ManageOrchardsTab() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { showConfirm, showAlert } = useAlert();
	const [orchards, setOrchards] = useState<Orchard[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = useCallback(async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const data = await orchardService().getOrchardsByOwner(user.id);

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
					await orchardService().deleteOrchard(id);
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
		<div className="space-y-6">
			<div className="relative overflow-hidden rounded-3xl bg-forest-900 p-8 text-white shadow-xl">
				<div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
				<div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div>
						<h1 className="mb-2 text-3xl font-bold">ระบบจัดการสวน</h1>
						<p className="text-lg text-forest-100 opacity-90">
							ดูแลข้อมูลและแก้ไขสวนของคุณ
						</p>
					</div>
					<Link to="/owner/add">
						<Button
							className="dark:bg-opacity-50 transform font-semibold! whitespace-nowrap shadow-xl transition-transform hover:scale-105 dark:border-none"
							size="lg"
							variant="secondary"
						>
							<Plus size={22} strokeWidth={3} />
							ลงทะเบียนสวนใหม่
						</Button>
					</Link>
				</div>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
						/>
					))}
				</div>
			) : orchards.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-24 dark:border-slate-700 dark:bg-slate-800">
					<div className="mb-6 rounded-full bg-forest-50 p-6 dark:bg-forest-900/30">
						<Sprout className="text-forest-600 dark:text-forest-400" size={48} />
					</div>
					<h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
						ยังไม่มีข้อมูลสวนในระบบ
					</h3>
					<p className="mb-8 max-w-md text-center text-slate-500 dark:text-slate-400">
						เริ่มต้นสร้างตัวตนออนไลน์ให้สวนทุเรียนของคุณ
						เพื่อให้นักท่องเที่ยวและลูกค้าค้นพบได้ง่ายขึ้น
					</p>
					<Link to="/owner/add">
						<Button size="lg">เริ่มสร้างข้อมูลสวนแรกของคุณ</Button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{orchards.map((orchard) => (
						<div
							key={orchard.id}
							className="group relative flex h-full flex-col rounded-2xl bg-white p-1 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800"
						>
							<div className="grow">
								<Card
									orchard={orchard}
									onClick={() => navigate(`/owner/edit/${orchard.id}`)}
								/>
							</div>

							<div className="z-10 mt-1 flex justify-end gap-3 px-4 py-2 transition-opacity duration-200 sm:absolute sm:top-4 sm:right-4 sm:mt-0 sm:p-0 sm:opacity-80 sm:group-hover:opacity-100">
								<Link to={`/owner/edit/${orchard.id}`}>
									<Button variant="secondary">
										<Edit2 size={16} /> แก้ไข
									</Button>
								</Link>
								<Button variant="danger" onClick={() => handleDelete(orchard.id)}>
									<Trash2 size={16} /> ลบ
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
