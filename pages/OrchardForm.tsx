import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orchardService } from "../services/orchardService";
import { useAuth } from "../context/AuthContext";
import { useMasterData } from "../context/MasterDataContext";
import { useAlert } from "../context/AlertContext";
import {
	OrchardType,
	DurianStatus,
	SocialMediaLinks,
	Accommodation,
	Package,
} from "../interface/orchardInterface";
import { Button } from "../components/Button";
import { LocationPicker } from "../components/LocationPicker";
import {
	InputField,
	TextAreaField,
	ToggleSwitch,
	MultiSelectField,
} from "../components/FormInputs";
import { AccommodationManager } from "../components/AccommodationManager";
import { PackageManager } from "../components/PackageManager";
import {
	ArrowLeft,
	Save,
	MapPin,
	AlignLeft,
	Home,
	Phone,
	Locate,
	Image,
	X,
	Upload,
	Share2,
	Facebook,
	Instagram,
	Youtube,
	BookOpen,
	Video,
	Plus,
	Trash2,
	Info,
	Layers,
	Map as MapIcon,
	ArrowRight,
} from "lucide-react";
import { LineIcon, TiktokIcon } from "../utils/icons";

type TabType = "general" | "location" | "media" | "services";
const TABS: TabType[] = ["general", "location", "media", "services"];

export const OrchardForm: React.FC = () => {
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

	// Refs for file inputs need to be separate or managed carefully if components unmount
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		history: "",
		address: "",
		phoneNumber: "",
		lat: 0,
		lng: 0,
		status: DurianStatus.Available as DurianStatus,
		isMixedAgro: false,
		additionalCrops: [] as string[],
		images: [] as string[],
		videos: [] as string[],
		socialMedia: {
			line: "",
			facebook: "",
			instagram: "",
			tiktok: "",
			youtube: "",
		} as SocialMediaLinks,
		hasAccommodation: false,
		accommodations: [] as Accommodation[],
		hasPackage: false,
		packages: [] as Package[],
	});
	const [selectedTypes, setSelectedTypes] = useState<OrchardType[]>([]);

	// State for Video Input
	const [tempVideoUrl, setTempVideoUrl] = useState("");

	useEffect(() => {
		if (isEditMode && id) {
			const loadOrchard = async () => {
				try {
					const orchard = await orchardService.getOrchardById(parseInt(id));
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
							isMixedAgro: orchard.isMixedAgro || false,
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
							hasAccommodation: orchard.hasAccommodation || false,
							accommodations: orchard.accommodations || [],
							hasPackage: orchard.hasPackage || false,
							packages: orchard.packages || [],
						});
						setSelectedTypes(orchard.types);
					} else {
						showAlert("ไม่พบข้อมูล", "ไม่พบข้อมูลสวนที่คุณต้องการแก้ไข", "error");
						navigate("/owner");
					}
				} catch (e) {
					console.error(e);
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

	const handleLocationChange = (lat: number, lng: number) => {
		setFormData((prev) => ({ ...prev, lat, lng }));
	};

	const handleSocialChange = (key: keyof SocialMediaLinks, value: string) => {
		setFormData((prev) => ({
			...prev,
			socialMedia: {
				...prev.socialMedia,
				[key]: value,
			},
		}));
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
				setIsLocating(false);
			},
			(error) => {
				console.error(error);
				showAlert(
					"ข้อผิดพลาด",
					"ไม่สามารถระบุตำแหน่งได้ กรุณาตรวจสอบการอนุญาตใช้งาน GPS",
					"error"
				);
				setIsLocating(false);
			}
		);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const MAX_SIZE_MB = 10;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

		Array.from(files).forEach((file: File) => {
			if (file.size > MAX_SIZE_BYTES) {
				showAlert(
					"ไฟล์ขนาดใหญ่เกินไป",
					`ไฟล์ ${file.name} มีขนาดใหญ่เกิน ${MAX_SIZE_MB}MB`,
					"warning"
				);
				return;
			}

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				if (reader.result && typeof reader.result === "string") {
					setFormData((prev) => ({
						...prev,
						images: [...prev.images, reader.result as string],
					}));
				}
			};
		});

		if (imageInputRef.current) {
			imageInputRef.current.value = ""; // Reset input
		}
	};

	const removeImage = (indexToRemove: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, index) => index !== indexToRemove),
		}));
	};

	const handleAddVideo = () => {
		if (tempVideoUrl.trim() === "") return;
		if (formData.videos.includes(tempVideoUrl)) {
			showAlert("ข้อมูลซ้ำ", "ลิงก์วิดีโอนี้ถูกเพิ่มไปแล้ว", "info");
			return;
		}

		setFormData((prev) => ({
			...prev,
			videos: [...prev.videos, tempVideoUrl],
		}));
		setTempVideoUrl("");
	};

	const handleRemoveVideo = (indexToRemove: number) => {
		setFormData((prev) => ({
			...prev,
			videos: prev.videos.filter((_, index) => index !== indexToRemove),
		}));
	};

	// Step Navigation Logic
	const handleNext = (e?: React.MouseEvent) => {
		// Prevent default form submission or event propagation if triggered by click
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		// Validation
		if (activeTab === "general") {
			if (!formData.name.trim()) {
				showAlert("ข้อมูลไม่ครบถ้วน", "กรุณาระบุชื่อสวนทุเรียน", "warning");
				return;
			}
			if (!formData.description.trim()) {
				showAlert("ข้อมูลไม่ครบถ้วน", "กรุณาระบุรายละเอียดและจุดเด่น", "warning");
				return;
			}
		} else if (activeTab === "location") {
			if (!formData.address.trim()) {
				showAlert("ข้อมูลไม่ครบถ้วน", "กรุณาระบุที่อยู่", "warning");
				return;
			}
			if (formData.lat === 0 || formData.lng === 0) {
				showAlert("ข้อมูลไม่ครบถ้วน", "กรุณาระบุตำแหน่งพิกัดบนแผนที่", "warning");
				return;
			}
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

		// Additional validation check before submit
		if (!formData.name || !formData.description || !formData.address || formData.lat === 0) {
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
				isMixedAgro: formData.isMixedAgro,
				additionalCrops: formData.isMixedAgro ? formData.additionalCrops : [],
				images: formData.images,
				videos: formData.videos,
				socialMedia: formData.socialMedia,
				hasAccommodation: formData.hasAccommodation,
				accommodations: formData.hasAccommodation ? formData.accommodations : [],
				hasPackage: formData.hasPackage,
				packages: formData.hasPackage ? formData.packages : [],
			};

			if (isEditMode && id) {
				await orchardService.updateOrchard(parseInt(id), payload);
			} else {
				await orchardService.addOrchard({
					...payload,
					ownerId: user.id,
				});
			}

			showAlert("สำเร็จ", "บันทึกข้อมูลสวนเรียบร้อยแล้ว", "success");
			navigate("/owner");
		} catch (error) {
			console.error(error);
			showAlert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const TabButton = ({
		id,
		label,
		icon: Icon,
	}: {
		id: TabType;
		label: string;
		icon: React.ElementType;
	}) => (
		<button
			type="button"
			onClick={() => setActiveTab(id)}
			className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap
        ${
			activeTab === id
				? "bg-forest-800 text-white shadow-md shadow-forest-900/20"
				: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
		}
      `}
		>
			<Icon size={18} />
			<span>{label}</span>
		</button>
	);

	if (loadingData || isMasterDataLoading) {
		return (
			<div className="flex justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-500 border-t-transparent"></div>
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/owner")}
						className="pl-0 hover:bg-transparent text-slate-500 hover:text-forest-700 mb-2"
					>
						{isEditMode ? (
							<>
								<ArrowLeft size={20} className="mr-1" /> ย้อนกลับ
							</>
						) : (
							<>
								<X size={20} className="mr-1" /> ยกเลิก
							</>
						)}
					</Button>
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
								{isEditMode ? "แก้ไขข้อมูลสวน" : "ลงทะเบียนสวนใหม่"}
							</h1>
							<p className="text-slate-500 mt-1">
								กรอกข้อมูลให้ครบถ้วนเพื่อการประชาสัมพันธ์ที่มีประสิทธิภาพ
							</p>
						</div>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
					<div className="flex gap-2 min-w-max">
						<TabButton id="general" label="ข้อมูลทั่วไป" icon={Info} />
						<TabButton id="location" label="ที่ตั้ง & แผนที่" icon={MapIcon} />
						<TabButton id="media" label="รูปภาพ & สื่อ" icon={Image} />
						<TabButton id="services" label="บริการเสริม" icon={Layers} />
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Tab 1: General Information */}
					{activeTab === "general" && (
						<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-left-2 duration-300">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<Info className="text-forest-600" /> ข้อมูลพื้นฐาน
							</h2>

							{/* Status Section */}
							<div className="mb-8">
								<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">
									สถานะผลผลิตปัจจุบัน
								</label>
								<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
									{statuses.map((statusOption) => (
										<div
											key={statusOption.id}
											onClick={() =>
												setFormData({
													...formData,
													status: statusOption.id as DurianStatus,
												})
											}
											className={`
                                cursor-pointer rounded-xl border-2 p-4 flex items-center justify-center text-center transition-all h-full
                                ${
									formData.status === statusOption.id
										? `bg-white dark:bg-slate-800 border-forest-500 shadow-md transform scale-105`
										: "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
								}
                            `}
										>
											<div className="flex flex-col items-center gap-2">
												<div
													className={`w-3 h-3 rounded-full ${statusOption.color.split(" ")[0]}`}
												></div>
												<span
													className={`font-semibold text-sm ${formData.status === statusOption.id ? "text-forest-700 dark:text-forest-400" : "text-slate-600 dark:text-slate-400"}`}
												>
													{statusOption.label}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<InputField
									label="ชื่อสวนทุเรียน"
									placeholder="เช่น สวนทุเรียนลุงสมหมาย"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									icon={Home}
									required
								/>

								<InputField
									label="เบอร์โทรศัพท์ติดต่อ"
									placeholder="08X-XXX-XXXX"
									type="tel"
									value={formData.phoneNumber}
									onChange={(e) =>
										setFormData({ ...formData, phoneNumber: e.target.value })
									}
									icon={Phone}
								/>

								<div className="col-span-1 md:col-span-2">
									<TextAreaField
										label="รายละเอียดและจุดเด่น"
										placeholder="บรรยายความพิเศษของสวน พันธุ์ทุเรียนที่มี ฯลฯ"
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										rows={3}
										icon={AlignLeft}
										required
									/>
								</div>

								<div className="col-span-1 md:col-span-2">
									<TextAreaField
										label="ประวัติความเป็นมา (Story)"
										placeholder="เล่าเรื่องราวความเป็นมาของสวน แรงบันดาลใจ หรือจุดเริ่มต้น..."
										value={formData.history}
										onChange={(e) =>
											setFormData({ ...formData, history: e.target.value })
										}
										rows={3}
										icon={BookOpen}
									/>
								</div>

								<div className="col-span-1 md:col-span-2 mt-2">
									<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 ml-1">
										ประเภทบริการ (เลือกได้มากกว่า 1 ข้อ)
									</label>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
										{serviceTypes.map((type) => (
											<div
												key={type.id}
												onClick={() => toggleType(type.id as OrchardType)}
												className={`
                            cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 text-center transition-all
                            ${
								selectedTypes.includes(type.id as OrchardType)
									? "bg-forest-50 dark:bg-forest-900/30 border-forest-500 text-forest-800 dark:text-forest-300 shadow-sm"
									: "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-forest-200"
							}
                          `}
											>
												<span className="font-semibold text-sm">
													{type.label}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Tab 2: Location & Map */}
					{activeTab === "location" && (
						<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-right-2 duration-300">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<MapPin className="text-forest-600" /> ที่ตั้งและแผนที่
							</h2>

							<div className="grid grid-cols-1 gap-6">
								<div>
									<TextAreaField
										label="ที่อยู่ / สถานที่ตั้ง (ข้อความ)"
										placeholder="บ้านเลขที่, หมู่, ตำบล, อำเภอ, จังหวัด..."
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										rows={3}
										icon={MapPin}
										required
									/>
								</div>

								<div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
									<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
										<label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
											ตำแหน่งพิกัดบนแผนที่ (GPS){" "}
											<span className="text-red-500">*</span>
											<p className="text-xs font-normal text-slate-500 mt-1">
												แตะที่แผนที่เพื่อปักหมุดตำแหน่งสวนของคุณ
											</p>
										</label>

										<button
											type="button"
											onClick={handleSetCurrentLocation}
											disabled={isLocating}
											className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 text-forest-700 dark:text-forest-300 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 hover:border-forest-500 transition-all disabled:opacity-50"
										>
											{isLocating ? (
												<div className="animate-spin rounded-full h-4 w-4 border-2 border-forest-600 border-t-transparent"></div>
											) : (
												<Locate size={16} />
											)}
											{isLocating ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
										</button>
									</div>

									<div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm">
										<LocationPicker
											lat={formData.lat}
											lng={formData.lng}
											onChange={handleLocationChange}
										/>
									</div>

									<div className="flex gap-4 mt-3 px-1 text-xs text-slate-500 font-mono">
										<span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
											Latitude: {formData.lat ? formData.lat.toFixed(6) : "-"}
										</span>
										<span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
											Longitude:{" "}
											{formData.lng ? formData.lng.toFixed(6) : "-"}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Tab 3: Media & Social */}
					{activeTab === "media" && (
						<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-right-2 duration-300">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<Image className="text-forest-600" /> รูปภาพและโซเชียล
							</h2>

							<div className="space-y-8">
								{/* Images */}
								<div>
									<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
										รูปภาพบรรยากาศสวน
									</label>
									<p className="text-xs text-slate-500 dark:text-slate-400 mb-4 ml-1">
										รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 10MB ต่อรูป
										ไม่จำกัดจำนวน
									</p>

									<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{formData.images.map((img, index) => (
											<div
												key={index}
												className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
											>
												<img
													src={img}
													alt={`Preview ${index}`}
													className="w-full h-full object-cover"
												/>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
													title="ลบรูปภาพ"
												>
													<X size={14} />
												</button>
											</div>
										))}

										<button
											type="button"
											onClick={() => imageInputRef.current?.click()}
											className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:border-forest-500 hover:text-forest-500 dark:hover:border-forest-400 dark:hover:text-forest-400 transition-colors bg-slate-50 dark:bg-slate-900/50"
										>
											<div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
												<Upload size={20} />
											</div>
											<span className="text-xs font-medium">เพิ่มรูปภาพ</span>
										</button>
									</div>
									<input
										ref={imageInputRef}
										type="file"
										multiple
										accept="image/*"
										className="hidden"
										onChange={handleImageUpload}
									/>
								</div>

								{/* Videos */}
								<div>
									<div className="flex items-center gap-2 mb-2 ml-1">
										<Video
											className="text-slate-700 dark:text-slate-300"
											size={18}
										/>
										<h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
											วิดีโอ (ลิงก์จาก YouTube, TikTok)
										</h3>
									</div>

									<div className="flex gap-2 mb-4">
										<input
											type="text"
											placeholder="วางลิงก์วิดีโอที่นี่..."
											className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none"
											value={tempVideoUrl}
											onChange={(e) => setTempVideoUrl(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddVideo();
												}
											}}
										/>
										<Button
											type="button"
											onClick={handleAddVideo}
											className="!px-4"
											disabled={!tempVideoUrl}
										>
											<Plus size={20} /> เพิ่ม
										</Button>
									</div>

									{formData.videos.length > 0 && (
										<div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
											{formData.videos.map((video, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
												>
													<div className="flex items-center gap-3 overflow-hidden">
														<div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 text-red-600 dark:text-red-400">
															<Youtube size={16} />
														</div>
														<a
															href={video}
															target="_blank"
															rel="noreferrer"
															className="text-sm text-slate-600 dark:text-slate-300 truncate hover:text-blue-500 hover:underline"
														>
															{video}
														</a>
													</div>
													<button
														type="button"
														onClick={() => handleRemoveVideo(index)}
														className="text-slate-400 hover:text-red-500 transition-colors p-1"
													>
														<Trash2 size={18} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Social Media */}
								<div className="pt-6 border-t border-slate-100 dark:border-slate-700">
									<div className="flex items-center gap-2 mb-4 ml-1">
										<Share2
											className="text-forest-600 dark:text-forest-400"
											size={20}
										/>
										<h3 className="text-lg font-bold text-slate-800 dark:text-white">
											ช่องทางการติดตาม (Social Media)
										</h3>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<InputField
											label="Line (Link to Profile)"
											placeholder="https://line.me/ti/p/~yourid"
											value={formData.socialMedia.line}
											onChange={(e) =>
												handleSocialChange("line", e.target.value)
											}
											icon={LineIcon}
										/>
										<InputField
											label="Facebook (URL)"
											placeholder="https://facebook.com/yourpage"
											value={formData.socialMedia.facebook}
											onChange={(e) =>
												handleSocialChange("facebook", e.target.value)
											}
											icon={Facebook}
										/>
										<InputField
											label="Instagram (URL)"
											placeholder="https://instagram.com/yourprofile"
											value={formData.socialMedia.instagram}
											onChange={(e) =>
												handleSocialChange("instagram", e.target.value)
											}
											icon={Instagram}
										/>
										<InputField
											label="TikTok (URL)"
											placeholder="https://tiktok.com/@yourprofile"
											value={formData.socialMedia.tiktok}
											onChange={(e) =>
												handleSocialChange("tiktok", e.target.value)
											}
											icon={TiktokIcon}
										/>
										<InputField
											label="YouTube (URL)"
											placeholder="https://youtube.com/c/yourchannel"
											value={formData.socialMedia.youtube}
											onChange={(e) =>
												handleSocialChange("youtube", e.target.value)
											}
											icon={Youtube}
										/>
									</div>
									<p className="text-xs text-slate-500 mt-2 ml-1">
										* ใส่ลิงก์เต็ม (URL)
										ของโปรไฟล์เพื่อให้ลูกค้ากดไปที่แอปพลิเคชันได้ทันที
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Tab 4: Extra Services */}
					{activeTab === "services" && (
						<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-in slide-in-from-right-2 duration-300">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<Layers className="text-forest-600" /> บริการเสริมและสินค้าอื่น
							</h2>

							<div className="space-y-8">
								{/* Mixed Agriculture */}
								<div className="space-y-4">
									<ToggleSwitch
										label="เป็นสวนเกษตรผสมผสาน"
										description="หากสวนของคุณมีการปลูกพืชผักหรือผลไม้อื่นๆ แซมในสวนทุเรียน"
										checked={formData.isMixedAgro}
										onChange={(val) =>
											setFormData({ ...formData, isMixedAgro: val })
										}
									/>

									{formData.isMixedAgro && (
										<div className="animate-in slide-in-from-top-2 fade-in duration-300 pl-4 border-l-4 border-forest-100 dark:border-forest-900/50">
											<MultiSelectField
												label="พืชที่ปลูกเพิ่มเติม (ผัก/ผลไม้)"
												placeholder="เลือกพืชที่ปลูกในสวน..."
												options={cropOptions}
												value={formData.additionalCrops}
												onChange={(val) =>
													setFormData({
														...formData,
														additionalCrops: val,
													})
												}
											/>
											<p className="text-xs text-slate-500 mt-2 ml-1">
												* สามารถเลือกได้มากกว่า 1 รายการ
											</p>
										</div>
									)}
								</div>

								{/* Accommodation */}
								<div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
									<ToggleSwitch
										label="มีบริการที่พัก/โฮมสเตย์"
										description="เปิดให้บริหารที่พักแก่นักท่องเที่ยว"
										checked={formData.hasAccommodation}
										onChange={(val) =>
											setFormData({ ...formData, hasAccommodation: val })
										}
									/>

									{formData.hasAccommodation && (
										<div className="pl-0 sm:pl-4 sm:border-l-4 sm:border-forest-100 dark:sm:border-forest-900/50">
											<AccommodationManager
												accommodations={formData.accommodations}
												onChange={(updated) =>
													setFormData({
														...formData,
														accommodations: updated,
													})
												}
											/>
										</div>
									)}
								</div>

								{/* Packages */}
								<div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
									<ToggleSwitch
										label="มีแพ็กเกจท่องเที่ยว/กิจกรรม"
										description="กิจกรรมบุฟเฟต์, Workshop หรือแพ็กเกจท่องเที่ยว"
										checked={formData.hasPackage}
										onChange={(val) =>
											setFormData({ ...formData, hasPackage: val })
										}
									/>

									{formData.hasPackage && (
										<div className="pl-0 sm:pl-4 sm:border-l-4 sm:border-forest-100 dark:sm:border-forest-900/50">
											<PackageManager
												packages={formData.packages}
												onChange={(updated) =>
													setFormData({ ...formData, packages: updated })
												}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Footer Actions */}
					<div className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 border-t border-slate-200 dark:border-slate-800 -mx-4 sm:mx-0 flex flex-col sm:flex-row justify-end gap-4 z-10">
						{isEditMode ? (
							<>
								<Button
									variant="secondary"
									type="button"
									onClick={() => navigate("/owner")}
									className="w-full sm:w-auto order-2 sm:order-1"
								>
									ยกเลิก
								</Button>
								<Button
									type="submit"
									isLoading={isLoading}
									className="w-full sm:w-auto order-1 sm:order-2 shadow-lg shadow-forest-900/20"
								>
									<Save size={20} className="mr-2" /> บันทึกข้อมูลสวน
								</Button>
							</>
						) : (
							<>
								{/* Hide back button on first tab */}
								{activeTab !== "general" && (
									<Button
										variant="secondary"
										type="button"
										onClick={handleBack}
										className="w-full sm:w-auto order-2 sm:order-1"
									>
										<ArrowLeft size={20} className="mr-2" /> ย้อนกลับ
									</Button>
								)}

								{activeTab !== "services" ? (
									<Button
										key="next-btn"
										type="button"
										onClick={handleNext}
										className="w-full sm:w-auto order-1 sm:order-2 shadow-lg shadow-forest-900/20 !bg-forest-800"
									>
										ถัดไป <ArrowRight size={20} className="ml-2" />
									</Button>
								) : (
									<Button
										key="save-btn"
										type="submit"
										isLoading={isLoading}
										className="w-full sm:w-auto order-1 sm:order-2 shadow-lg shadow-forest-900/20"
									>
										<Save size={20} className="mr-2" /> บันทึกข้อมูลสวน
									</Button>
								)}
							</>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};
