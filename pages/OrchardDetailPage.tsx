import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import {
	ArrowLeft,
	Share2,
	MapPin,
	Phone,
	Info,
	Layers,
	Image as ImageIcon,
	Sprout,
	Home,
	Users,
	Navigation,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
} from "lucide-react";

import { orchardService } from "../services/orchardService";
import { getErrorMessage } from "../services/api";
import { useMasterData } from "../context/MasterDataContext";
import { getImageUrl } from "../utils/constants";
import { useAlert } from "../context/AlertContext";
import { Orchard } from "../interface/orchardInterface";
import { Button } from "../components/Button";
import { OrchardMap } from "../components/OrchardMap";
import { SocialLinks } from "../components/SocialLinks";
import { MiniCarousel } from "../components/MiniCarousel";
import { Lightbox } from "../components/Lightbox";

export const OrchardDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const { getStatus, getServiceType, getCrop } = useMasterData();

	const [orchard, setOrchard] = useState<Orchard | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Carousel State
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [images, setImages] = useState<string[]>([]);
	const [videos, setVideos] = useState<string[]>([]);

	// Map Ref for location reset
	const mapRef = useRef<L.Map | null>(null);

	// Lightbox State
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const openLightbox = (index: number) => {
		setLightboxIndex(index);
		setIsLightboxOpen(true);
	};

	const closeLightbox = () => {
		setIsLightboxOpen(false);
	};

	useEffect(() => {
		const loadOrchard = async () => {
			if (!id) return;
			try {
				setIsLoading(true);
				const data = await orchardService.getOrchardById(parseInt(id));

				if (data) {
					setOrchard(data);

					// Separate images and videos
					if (data.images) {
						setImages(data.images);
					}
					if (data.videos) {
						setVideos(data.videos);
					}
				} else {
					showAlert("ไม่พบข้อมูล", "ไม่พบข้อมูลสวนที่คุณต้องการ", "error");
					navigate(-1);
				}
			} catch (error) {
				showAlert("ข้อผิดพลาด", getErrorMessage(error), "error");
			} finally {
				setIsLoading(false);
			}
		};

		loadOrchard();
	}, [id, navigate, showAlert]);

	const handleShare = async () => {
		const url = window.location.href;
		const title = orchard?.name || "Durian Love Thailand";
		const text = `Check out ${title} on Durian Love Thailand!`;

		// Try Native Share API first (Mobile preferred)
		if (navigator.share) {
			try {
				await navigator.share({
					title,
					text,
					url,
				});

				return;
			} catch (error) {
				// If user cancelled share, simply return
				if ((error as Error).name === "AbortError") return;
			}
		}

		// Fallback to Clipboard
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard
				.writeText(url)
				.then(() => {
					showAlert("สำเร็จ", "คัดลอกลิงก์เรียบร้อยแล้ว", "success");
				})
				.catch((err) => {
					showAlert(
						"ขออภัย",
						"ไม่สามารถคัดลอกลิงก์ได้ (เบราว์เซอร์อาจไม่รองรับในโหมดนี้)",
						err.message.toString()
					);
				});
		} else {
			// Deep fallback for older browsers or insecure contexts
			try {
				const textArea = document.createElement("textarea");

				textArea.value = url;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
				showAlert("สำเร็จ", "คัดลอกลิงก์เรียบร้อยแล้ว", "success");
			} catch (err) {
				showAlert("ขออภัย", "ไม่สามารถแชร์ได้ในขณะนี้", err.message.toString());
			}
		}
	};

	const handleNextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (currentImageIndex < images.length - 1) {
			setCurrentImageIndex(currentImageIndex + 1);
		} else {
			setCurrentImageIndex(0); // Loop back
		}
	};

	const handlePrevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (currentImageIndex > 0) {
			setCurrentImageIndex(currentImageIndex - 1);
		} else {
			setCurrentImageIndex(images.length - 1); // Loop to last
		}
	};

	const handleNextVideo = () => {
		if (currentVideoIndex < videos.length - 1) {
			setCurrentVideoIndex(currentVideoIndex + 1);
		} else {
			setCurrentVideoIndex(0);
		}
	};

	const handlePrevVideo = () => {
		if (currentVideoIndex > 0) {
			setCurrentVideoIndex(currentVideoIndex - 1);
		} else {
			setCurrentVideoIndex(videos.length - 1);
		}
	};

	const getYoutubeId = (url: string) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);

		return match && match[2].length === 11 ? match[2] : null;
	};

	const renderVideo = (url: string) => {
		const videoId = getYoutubeId(url);

		if (videoId) {
			return (
				<div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
					<iframe
						allowFullScreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						className="w-full h-full"
						src={`https://www.youtube.com/embed/${videoId}`}
						title="YouTube video player"
					/>
				</div>
			);
		}

		return (
			<div className="w-full p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-center">
				<a className="text-blue-600 underline" href={url} rel="noreferrer" target="_blank">
					Watch Video ({url})
				</a>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-500 border-t-transparent" />
			</div>
		);
	}

	if (!orchard) return null;

	const statusInfo = getStatus(orchard.status);
	const hasServices =
		orchard.additionalCrops.length > 0 ||
		orchard.accommodations.length > 0 ||
		orchard.packages.length > 0;

	// Image Grid Logic for Desktop
	const renderImageGrid = () => {
		if (images.length === 0) {
			return (
				<div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
					<ImageIcon size={48} />
				</div>
			);
		}

		if (images.length === 1) {
			return (
				<div className="w-full h-[300px] md:h-[500px] overflow-hidden bg-white dark:bg-slate-950">
					<img
						alt={orchard.name}
						className="w-full h-full object-cover"
						src={getImageUrl(images[0])}
					/>
				</div>
			);
		}

		// Grid for 2+ images
		return (
			<div className="w-full h-[300px] md:h-[600px] grid grid-cols-1 md:grid-cols-4 gap-2 overflow-hidden bg-white dark:bg-slate-950">
				{/* Main Image (Left Half) */}
				<div className="md:col-span-2 h-full relative group cursor-pointer overflow-hidden">
					<img
						alt={orchard.name}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						src={getImageUrl(images[0])}
					/>
				</div>

				{/* Secondary Images Grid (Right Half) */}
				<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
					{images.slice(1, 5).map((img, idx) => (
						<div
							key={idx}
							className="relative h-full overflow-hidden group cursor-pointer"
						>
							<img
								alt={`${orchard.name} ${idx + 2}`}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								src={getImageUrl(img)}
							/>
							{/* Overlay for 'More' images if there are more than 5 */}
							{idx === 3 && images.length > 5 && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold backdrop-blur-sm">
									+{images.length - 5}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
			{/* Top Image Section */}
			<div className="relative w-full bg-slate-900 group">
				{/* Mobile Carousel View (visible only on small screens) */}
				<div className="md:hidden w-full h-[50vh] relative overflow-hidden">
					{images.length > 0 ? (
						<div
							className="flex h-full w-full transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
						>
							{images.map((img, index) => (
								<div key={index} className="w-full h-full shrink-0 relative">
									<img
										alt={`Orchard Media ${index + 1}`}
										className="w-full h-full object-cover"
										src={getImageUrl(img)}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
								</div>
							))}
						</div>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800">
							<ImageIcon size={48} />
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
						</div>
					)}

					{/* Navigation Buttons for Mobile */}
					{images.length > 1 && (
						<>
							<Button
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0"
								variant="none"
								onClick={handlePrevImage}
							>
								<ChevronLeft size={24} />
							</Button>
							<Button
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0"
								variant="none"
								onClick={handleNextImage}
							>
								<ChevronRight size={24} />
							</Button>
						</>
					)}
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:block">{renderImageGrid()}</div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
			</div>

			{/* Main Content Layout */}
			<div className="max-w-7xl mx-auto px-4 py-8 pb-24 -mt-36 sm:-mt-40 md:-mt-36 relative z-10">
				{/* Header Actions (Moved here) */}
				<div className="flex justify-between items-center mb-6">
					<Button
						className="bg-forest-800 hover:bg-forest-900 text-white shadow-lg pointer-events-auto rounded-full w-10 h-10 flex items-center justify-center !p-0 transition-transform hover:scale-105"
						title="ย้อนกลับ"
						variant="none"
						onClick={() => navigate(`/?selected=${id}`)}
					>
						<ArrowLeft size={20} />
					</Button>

					<div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-sm md:hidden">
						{images.length > 0
							? `${currentImageIndex + 1} / ${images.length}`
							: "ไม่มีข้อมูลรูปภาพ"}
					</div>

					<Button
						className="bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-sm pointer-events-auto rounded-full w-10 h-10 flex items-center justify-center !p-0 transition-transform hover:scale-105"
						title="แชร์"
						variant="none"
						onClick={handleShare}
					>
						<Share2 size={20} />
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column (Main Info) */}
					<div className="lg:col-span-2 space-y-6">
						{/* Title Card */}
						<div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-center gap-4">
									<h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
										{orchard.name}
									</h1>
									{statusInfo && (
										<span
											className={`inline-block px-4 py-2 text-md font-bold rounded-lg border shadow-sm backdrop-blur-lg whitespace-nowrap ${statusInfo.color}`}
										>
											{statusInfo.label}
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Part 1: General Info */}
						<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<Info className="text-forest-600" /> ข้อมูลทั่วไป
							</h2>

							<div className="space-y-6">
								<div>
									<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
										รายละเอียดและจุดเด่น
									</span>
									<p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
										{orchard.description}
									</p>
								</div>

								{orchard.history && (
									<div>
										<span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
											ประวัติความเป็นมา
										</span>
										<p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
											{orchard.history}
										</p>
									</div>
								)}

								{orchard.phoneNumber && (
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
											<Phone size={20} />
										</div>
										<div>
											<span className="block text-sm font-bold text-slate-700 dark:text-slate-300">
												เบอร์โทรศัพท์ติดต่อ
											</span>
											<a
												className="text-lg font-semibold text-green-600 hover:underline"
												href={`tel:${orchard.phoneNumber}`}
											>
												{orchard.phoneNumber}
											</a>
										</div>
									</div>
								)}

								{orchard.types && orchard.types.length > 0 && (
									<div className="flex flex-wrap gap-2 pt-2">
										{orchard.types.map((typeId) => {
											const typeInfo = getServiceType(typeId);

											if (!typeInfo) return null;

											return (
												<span
													key={typeId}
													className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
												>
													{typeInfo.label}
												</span>
											);
										})}
									</div>
								)}
							</div>
						</section>

						{/* Part 2: Videos */}
						<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8 hidden lg:block">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
								<Layers className="text-red-600" /> วิดีโอและสื่อ
							</h2>

							<div className="space-y-4">
								{/* Main Video Display */}
								{videos.length > 0 && (
									<div className="relative group rounded-2xl overflow-hidden bg-black">
										{renderVideo(videos[currentVideoIndex])}

										{videos.length > 1 && (
											<>
												<Button
													className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0 transition-opacity"
													variant="none"
													onClick={handlePrevVideo}
												>
													<ChevronLeft size={24} />
												</Button>
												<Button
													className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm !w-auto !h-auto min-h-0 transition-opacity"
													variant="none"
													onClick={handleNextVideo}
												>
													<ChevronRight size={24} />
												</Button>

												<div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md pointer-events-none">
													{currentVideoIndex + 1} / {videos.length}
												</div>
											</>
										)}
									</div>
								)}

								{/* Pictures Thumbnail Grid (Visible on Desktop > md) */}
								{images.length > 0 && (
									<div className="hidden md:grid grid-cols-6 gap-4 h-28">
										{images.slice(0, 6).map((img, idx) => (
											<div
												key={idx}
												className="relative rounded-xl overflow-hidden cursor-pointer group h-full border-2 border-transparent hover:border-forest-500 transition-all"
												role="button"
												tabIndex={0}
												onClick={() => openLightbox(idx)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														openLightbox(idx);
													}
												}}
											>
												<img
													alt={`Thumbnail ${idx + 1}`}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													src={getImageUrl(img)}
												/>
												{/* Overlay for +More images */}
												{idx === 5 && images.length > 6 && (
													<div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
														+{images.length - 6}
													</div>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						</section>

						{/* Part 3: Services */}
						{hasServices && (
							<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
								<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
									<Layers className="text-forest-600" /> บริการเสริมและสินค้าอื่น
								</h2>

								<div className="space-y-8">
									{/* Mixed Agro */}
									{orchard.additionalCrops.length > 0 &&
										orchard.additionalCrops && (
											<div>
												<div className="flex items-center gap-2 mb-3">
													<Sprout className="text-forest-500" size={20} />
													<h3 className="font-bold text-slate-800 dark:text-slate-200">
														สวนเกษตรผสมผสาน
													</h3>
												</div>
												<p className="text-sm text-slate-500 mb-3">
													นอกจากทุเรียนแล้ว ยังมีพืชผลอื่นๆ:
												</p>
												<div className="flex flex-wrap gap-2">
													{orchard.additionalCrops.map(
														(CropOption, idx) => {
															const cropInfo = getCrop(CropOption);

															return (
																<span
																	key={idx}
																	className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-100 dark:border-green-800"
																>
																	{cropInfo?.label || CropOption}
																</span>
															);
														}
													)}
												</div>
											</div>
										)}

									{/* Accommodation */}
									{orchard.accommodations &&
										orchard.accommodations.length > 0 && (
											<div
												className={
													orchard.additionalCrops.length > 0
														? "pt-6 border-t border-slate-50 dark:border-slate-700"
														: ""
												}
											>
												<div className="flex items-center gap-2 mb-4">
													<Home className="text-orange-500" size={20} />
													<h3 className="font-bold text-slate-800 dark:text-slate-200">
														ที่พักและโฮมสเตย์
													</h3>
												</div>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{orchard.accommodations.map((acc, idx) => (
														<div
															key={idx}
															className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/30"
														>
															{acc.images &&
																acc.images.length > 0 && (
																	<div className="h-40 w-full">
																		<MiniCarousel
																			alt={acc.name}
																			className="h-full w-full"
																			images={acc.images}
																		/>
																	</div>
																)}
															<div className="p-4">
																<h4 className="font-bold text-slate-900 dark:text-white mb-1">
																	{acc.name}
																</h4>
																<div className="flex justify-between items-end mt-2">
																	<span className="text-forest-600 dark:text-forest-400 font-bold text-lg">
																		฿
																		{acc.price.toLocaleString()}
																	</span>
																	<span className="text-xs text-slate-500">
																		จำนวน: {acc.quantity} ห้อง
																	</span>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

									{/* Packages */}
									{orchard.packages && orchard.packages.length > 0 && (
										<div
											className={
												orchard.additionalCrops.length > 0 ||
												orchard.accommodations.length > 0
													? "pt-6 border-t border-slate-50 dark:border-slate-700"
													: ""
											}
										>
											<div className="flex items-center gap-2 mb-4">
												<Users className="text-purple-500" size={20} />
												<h3 className="font-bold text-slate-800 dark:text-slate-200">
													แพ็คเกจท่องเที่ยว
												</h3>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												{orchard.packages.map((pkg, idx) => (
													<div
														key={idx}
														className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900/30"
													>
														{pkg.images && pkg.images.length > 0 && (
															<div className="h-40 w-full">
																<MiniCarousel
																	alt={pkg.name}
																	className="h-full w-full"
																	images={pkg.images}
																/>
															</div>
														)}
														<div className="flex-grow p-4">
															<div className="flex justify-between items-start mb-2">
																<h4 className="font-bold text-slate-900 dark:text-white">
																	{pkg.name}
																</h4>
																<span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-lg whitespace-nowrap">
																	{pkg.duration} ชม.
																</span>
															</div>
															<p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
																{pkg.includes}
															</p>
															<div className="flex justify-between items-center mt-auto">
																<span className="text-forest-600 dark:text-forest-400 font-bold text-lg">
																	฿{pkg.price.toLocaleString()}
																</span>
																<div className="text-xs text-slate-400">
																	{new Date(
																		pkg.startDate
																	).toLocaleDateString(
																		"th-TH"
																	)}{" "}
																	-{" "}
																	{new Date(
																		pkg.endDate
																	).toLocaleDateString("th-TH")}
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</section>
						)}
					</div>

					{/* Right Column (Sidebar) */}
					<div className="lg:col-span-1">
						<div className="sticky top-6 space-y-6">
							{/* Location Map */}
							<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
								<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
									<MapPin className="text-forest-600" /> ที่อยู่ของสวน
								</h2>

								<div className="space-y-6">
									<div className="flex items-start gap-3">
										<p className="text-slate-700 dark:text-slate-300 text-sm">
											{orchard.address}
										</p>
									</div>

									{orchard.lat !== undefined &&
										orchard.lng !== undefined &&
										!isNaN(orchard.lat) &&
										!isNaN(orchard.lng) && (
											<div className="h-[250px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
												<OrchardMap
													disablePopup
													orchards={[orchard]}
													selectedOrchardId={orchard.id}
													setMapRef={(map) => {
														mapRef.current = map;
													}}
												/>
												<div className="absolute bottom-4 right-4 flex gap-2">
													<Button
														aria-label="รีเซ็ตตำแหน่งแผนที่"
														className="bg-slate-700 hover:bg-slate-800 text-white !px-3 rounded-xl shadow-lg transition-transform hover:scale-105"
														title="รีเซ็ตตำแหน่งแผนที่"
														type="button"
														onClick={() => {
															if (
																mapRef.current &&
																orchard.lat &&
																orchard.lng
															) {
																mapRef.current.flyTo(
																	[orchard.lat, orchard.lng],
																	14,
																	{ duration: 1 }
																);
															}
														}}
													>
														<RotateCcw size={18} />
													</Button>
													<a
														className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
														href={`https://www.google.com/maps/dir/?api=1&destination=${orchard.lat},${orchard.lng}`}
														rel="noreferrer"
														target="_blank"
													>
														<Navigation size={18} /> นำทาง
													</a>
												</div>
											</div>
										)}
								</div>
							</section>

							{/* Social Media (Moved here) */}
							{orchard.socialMedia && (
								<section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
									<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
										<Users className="text-blue-500" /> ช่องทางติดตาม
									</h2>
									<div className="-mx-2">
										<SocialLinks
											showUrl
											className=""
											links={orchard.socialMedia}
										/>
									</div>
								</section>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Lightbox Component */}
			<Lightbox
				currentIndex={lightboxIndex}
				images={images}
				isOpen={isLightboxOpen}
				setIndex={setLightboxIndex}
				onClose={closeLightbox}
			/>
		</div>
	);
};
