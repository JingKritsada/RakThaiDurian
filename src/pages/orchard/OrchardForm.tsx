import type { OrchardFormData } from "@/interfaces/orchardInterface";
import type { ImagePayload, ImageFile } from "@/interfaces/imageInterface";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Image, Layers, Map as MapIcon, Info, ArrowRight } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { useMasterData } from "@/providers/MasterDataContext";
import { useAlert } from "@/providers/AlertContext";
import { getErrorMessage } from "@/services/api";
import { DurianStatus, type OrchardType } from "@/utils/enum";
import orchardService from "@/services/orchardService";
import Button from "@/components/Button";
import TabButton from "@/components/TabButton";
import GeneralTab from "@/pages/orchard/tabs/GeneralTab";
import LocationTab from "@/pages/orchard/tabs/LocationTab";
import MediaTab from "@/pages/orchard/tabs/MediaTab";
import ServicesTab from "@/pages/orchard/tabs/ServicesTab";

type TabType = "general" | "location" | "media" | "services";
const TABS: TabType[] = ["general", "location", "media", "services"];

export default function OrchardForm() {
	const { user } = useAuth();
	const { statuses, serviceTypes, cropOptions, isLoading: isMasterDataLoading } = useMasterData();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const { id } = useParams();
	const isEditMode = !!id;

	const [activeTab, setActiveTab] = useState<TabType>("general");
	const [isLoading, setIsLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(isEditMode);
	const [isLocating, setIsLocating] = useState(false);

	const [formData, setFormData] = useState<OrchardFormData>({
		name: "",
		description: "",
		history: "",
		address: "",
		phoneNumber: "",
		lat: 0,
		lng: 0,
		status: DurianStatus.AVAILABLE,
		additionalCrops: [] as string[],
		images: [] as string[],
		videos: [] as string[],
		socialMedia: {
			line: "",
			facebook: "",
			instagram: "",
			tiktok: "",
			youtube: "",
		},
		accommodations: [],
		packages: [],
	});
	const [selectedTypes, setSelectedTypes] = useState<OrchardType[]>([]);

	// State for Extra Services toggles
	const [isMixedAgro, setIsMixedAgro] = useState(false);
	const [hasAccommodation, setHasAccommodation] = useState(false);
	const [hasPackage, setHasPackage] = useState(false);

	// State for Video Input
	const [tempVideoUrl, setTempVideoUrl] = useState("");

	useEffect(() => {
		if (isEditMode && id) {
			const loadOrchard = async () => {
				try {
					const orchard = await orchardService().getOrchardById(parseInt(id));

					if (orchard) {
						if (user && orchard.ownerId !== user.id) {
							showAlert("ข้อผิดพลาด", "คุณไม่มีสิทธิ์แก้ไขข้อมูลสวนนี้", "error");
							navigate("/owner");

							return;
						}

						setFormData({
							name: orchard.name,
							description: orchard.description,
							history: orchard.history || "",
							address: orchard.address,
							phoneNumber: orchard.phoneNumber || "",
							lat: orchard.lat,
							lng: orchard.lng,
							status: orchard.status,
							additionalCrops: orchard.additionalCrops || [],
							images: orchard.images || [],
							videos: orchard.videos || [],
							socialMedia: {
								line: orchard.socialMedia?.line || "",
								facebook: orchard.socialMedia?.facebook || "",
								instagram: orchard.socialMedia?.instagram || "",
								tiktok: orchard.socialMedia?.tiktok || "",
								youtube: orchard.socialMedia?.youtube || "",
							},
							accommodations: orchard.accommodations || [],
							packages: orchard.packages || [],
						});

						setSelectedTypes((orchard.types || []) as OrchardType[]);

						setIsMixedAgro((orchard.additionalCrops?.length ?? 0) > 0);
						setHasAccommodation((orchard.accommodations?.length ?? 0) > 0);
						setHasPackage((orchard.packages?.length ?? 0) > 0);
					} else {
						showAlert("ไม่พบข้อมูล", "ไม่พบข้อมูลสวนที่คุณต้องการแก้ไข", "error");
						navigate("/owner");
					}
				} catch (error) {
					showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
				} finally {
					setLoadingData(false);
				}
			};

			loadOrchard();
		}
	}, [id, isEditMode, navigate, user, showAlert]);

	const toggleType = (typeId: OrchardType) => {
		setSelectedTypes((prev) =>
			prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
		);
	};

	const handleSetCurrentLocation = () => {
		if (!navigator.geolocation) {
			showAlert("ข้อผิดพลาด", "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง", "error");

			return;
		}

		setIsLocating(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setFormData((prev) => ({
					...prev,
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}));

				setTimeout(() => {
					setIsLocating(false);
				}, 1000);
			},
			(error) => {
				if (error.code) {
					// GeolocationPositionError code is intentionally silenced; the user sees the alert below
				}
				showAlert(
					"ข้อผิดพลาด",
					"ไม่สามารถระบุตำแหน่งได้ กรุณาตรวจสอบการอนุญาตใช้งาน GPS",
					"error"
				);
				setIsLocating(false);
			}
		);
	};

	// Step Navigation Logic
	const handleNext = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		const currentIndex = TABS.indexOf(activeTab);

		if (currentIndex < TABS.length - 1) {
			setActiveTab(TABS[currentIndex + 1]);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleBack = () => {
		const currentIndex = TABS.indexOf(activeTab);

		if (currentIndex > 0) {
			setActiveTab(TABS[currentIndex - 1]);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		if (!formData.name || formData.lat === 0) {
			showAlert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", "warning");

			return;
		}

		setIsLoading(true);

		try {
			const payload = {
				name: formData.name,
				description: formData.description,
				history: formData.history,
				address: formData.address,
				phoneNumber: formData.phoneNumber,
				lat: formData.lat,
				lng: formData.lng,
				types: selectedTypes,
				status: formData.status,
				additionalCrops: formData.additionalCrops,
				videos: formData.videos,
				socialMedia: formData.socialMedia,
				accommodations: formData.accommodations,
				packages: formData.packages,
			};

			const imagePayload: ImagePayload = {
				orchardImages: formData.images as ImageFile[],
				packageImages: (formData.packages ?? []).reduce(
					(acc, pkg) => {
						acc[pkg.id] = pkg.images as ImageFile[];

						return acc;
					},
					{} as Record<string, ImageFile[]>
				),
				accommodationImages: (formData.accommodations ?? []).reduce(
					(acc, accommodation) => {
						acc[accommodation.id] = accommodation.images as ImageFile[];

						return acc;
					},
					{} as Record<string, ImageFile[]>
				),
			};

			if (isEditMode && id) {
				await orchardService().updateOrchard(parseInt(id), payload, imagePayload, {
					skipGlobalLoading: true,
				});
			} else {
				await orchardService().addOrchard(
					{
						...payload,
						ownerId: user.id,
					},
					imagePayload,
					{ skipGlobalLoading: true }
				);
			}

			showAlert("สำเร็จ", "บันทึกข้อมูลสวนเรียบร้อยแล้ว", "success");
			navigate("/owner");
		} catch (error) {
			showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
		} finally {
			setIsLoading(false);
		}
	};

	if (loadingData || isMasterDataLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-forest-500 border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950">
			<div className="mx-auto max-w-4xl px-4 pt-8">
				{/* Header */}
				<div className="mb-6 flex flex-col items-start gap-6">
					<div className="flex flex-col items-start gap-1">
						<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
							{isEditMode ? "แก้ไขข้อมูลสวน" : "ลงทะเบียนสวนใหม่"}
						</h1>
						<p className="mt-1 text-slate-500">
							กรอกข้อมูลให้ครบถ้วนเพื่อการประชาสัมพันธ์ที่มีประสิทธิภาพ
						</p>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="scrollbar-hide mb-6 overflow-x-auto">
					<div className="flex min-w-max gap-2">
						<TabButton<TabType>
							activeTab={activeTab}
							icon={Info}
							id="general"
							label="ข้อมูลทั่วไป"
							setActiveTab={setActiveTab}
						/>
						<TabButton<TabType>
							activeTab={activeTab}
							icon={MapIcon}
							id="location"
							label="ที่ตั้ง & แผนที่"
							setActiveTab={setActiveTab}
						/>
						<TabButton<TabType>
							activeTab={activeTab}
							icon={Image}
							id="media"
							label="รูปภาพ & สื่อ"
							setActiveTab={setActiveTab}
						/>
						<TabButton<TabType>
							activeTab={activeTab}
							icon={Layers}
							id="services"
							label="บริการเสริม"
							setActiveTab={setActiveTab}
						/>
					</div>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					{activeTab === "general" && (
						<GeneralTab
							formData={formData}
							selectedTypes={selectedTypes}
							serviceTypes={serviceTypes}
							setFormData={setFormData}
							statuses={statuses}
							toggleType={toggleType}
						/>
					)}

					{activeTab === "location" && (
						<LocationTab
							formData={formData}
							handleSetCurrentLocation={handleSetCurrentLocation}
							isLocating={isLocating}
							setFormData={setFormData}
						/>
					)}

					{activeTab === "media" && (
						<MediaTab
							formData={formData}
							setFormData={setFormData}
							setTempVideoUrl={setTempVideoUrl}
							tempVideoUrl={tempVideoUrl}
						/>
					)}

					{activeTab === "services" && (
						<ServicesTab
							cropOptions={cropOptions}
							formData={formData}
							hasAccommodation={hasAccommodation}
							hasPackage={hasPackage}
							isMixedAgro={isMixedAgro}
							setFormData={setFormData}
							setHasAccommodation={setHasAccommodation}
							setHasPackage={setHasPackage}
							setIsMixedAgro={setIsMixedAgro}
						/>
					)}

					{/* Footer Actions */}
					<div className="sticky bottom-0 z-10 -mx-4 flex flex-row justify-end gap-4 border-t border-slate-200 bg-slate-100/80 p-4 backdrop-blur-md sm:mx-0 sm:px-0 sm:py-6 dark:border-slate-800 dark:bg-slate-950/80">
						{isEditMode ? (
							<>
								<Button
									className="w-full flex-1 sm:w-auto sm:flex-initial"
									size="lg"
									type="button"
									variant="secondary"
									onClick={() => navigate("/owner")}
								>
									ยกเลิก
								</Button>
								<Button
									className="w-full flex-2 sm:w-auto sm:flex-initial"
									isLoading={isLoading}
									size="lg"
									type="submit"
									variant="primary"
								>
									<Save className="mr-2" size={20} /> บันทึกข้อมูลสวน
								</Button>
							</>
						) : (
							<>
								<Button
									className="w-full sm:w-auto"
									type="button"
									variant="secondary"
									onClick={
										activeTab !== "general"
											? handleBack
											: () => navigate("/owner")
									}
								>
									<ArrowLeft className="mr-2" size={20} /> ย้อนกลับ
								</Button>

								{activeTab !== "services" ? (
									<Button
										key="next-btn"
										className="w-full bg-forest-800! shadow-lg shadow-forest-900/20 sm:w-auto"
										type="button"
										onClick={handleNext}
									>
										ถัดไป <ArrowRight className="ml-2" size={20} />
									</Button>
								) : (
									<Button
										key="save-btn"
										className="w-full shadow-lg shadow-forest-900/20 sm:w-auto"
										isLoading={isLoading}
										type="submit"
									>
										<Save className="mr-2" size={20} /> บันทึกข้อมูลสวน
									</Button>
								)}
							</>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
