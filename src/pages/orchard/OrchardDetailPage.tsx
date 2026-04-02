import type { Orchard } from "@/interfaces/orchardInterface";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layers, Sprout } from "lucide-react";

import { orchardService } from "@/services/orchardService";
import { getErrorMessage } from "@/services/api";
import { useMasterData } from "@/providers/MasterDataContext";
import { useAlert } from "@/providers/AlertContext";
import { OrchardHero } from "@/pages/orchard/sections/OrchardHero";
import { OrchardInfo } from "@/pages/orchard/sections/OrchardInfo";
import { OrchardGallery } from "@/pages/orchard/sections/OrchardGallery";
import { OrchardPackages } from "@/pages/orchard/sections/OrchardPackages";
import { OrchardAccommodations } from "@/pages/orchard/sections/OrchardAccommodations";
import { OrchardLocation } from "@/pages/orchard/sections/OrchardLocation";

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

		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });

				return;
			} catch (error) {
				if ((error as Error).name === "AbortError") return;
			}
		}

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard
				.writeText(url)
				.then(() => {
					showAlert("สำเร็จ", "คัดลอกลิงก์เรียบร้อยแล้ว", "success");
				})
				.catch((error) => {
					showAlert(
						"ขออภัย",
						"ไม่สามารถคัดลอกลิงก์ได้ (เบราว์เซอร์อาจไม่รองรับในโหมดนี้)",
						error.message.toString()
					);
				});
		} else {
			try {
				const textArea = document.createElement("textarea");

				textArea.value = url;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
				showAlert("สำเร็จ", "คัดลอกลิงก์เรียบร้อยแล้ว", "success");
			} catch (error) {
				showAlert("ขออภัย", "ไม่สามารถแชร์ได้ในขณะนี้", (error as any).message.toString());
			}
		}
	};

	const handleNextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (currentImageIndex < images.length - 1) {
			setCurrentImageIndex(currentImageIndex + 1);
		} else {
			setCurrentImageIndex(0);
		}
	};

	const handlePrevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (currentImageIndex > 0) {
			setCurrentImageIndex(currentImageIndex - 1);
		} else {
			setCurrentImageIndex(images.length - 1);
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
				<div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
					<iframe
						allowFullScreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						className="h-full w-full"
						src={`https://www.youtube.com/embed/${videoId}`}
						title="YouTube video player"
					/>
				</div>
			);
		}

		return (
			<div className="w-full rounded-2xl bg-slate-100 p-4 text-center dark:bg-slate-900">
				<a className="text-blue-600 underline" href={url} rel="noreferrer" target="_blank">
					Watch Video ({url})
				</a>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-forest-500 border-t-transparent" />
			</div>
		);
	}

	if (!orchard) return null;

	const statusInfo = getStatus(orchard.status) ?? null;
	const hasServices =
		(orchard.additionalCrops?.length ?? 0) > 0 ||
		(orchard.accommodations?.length ?? 0) > 0 ||
		(orchard.packages?.length ?? 0) > 0;

	return (
		<div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950">
			<OrchardHero
				currentImageIndex={currentImageIndex}
				images={images}
				orchard={orchard}
				statusInfo={statusInfo}
				onBack={() => navigate(`/?selected=${id}`)}
				onNextImage={handleNextImage}
				onPrevImage={handlePrevImage}
				onShare={handleShare}
			/>

			{/* Main Content Layout */}
			<div className="relative z-10 mx-auto max-w-7xl px-6 py-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Column (Main Info) */}
					<div className="space-y-6 lg:col-span-2">
						<OrchardInfo
							getServiceType={(id: string | number) => getServiceType(String(id))}
							orchard={orchard}
						/>

						<OrchardGallery
							currentVideoIndex={currentVideoIndex}
							images={images}
							isLightboxOpen={isLightboxOpen}
							lightboxIndex={lightboxIndex}
							renderVideo={renderVideo}
							setLightboxIndex={setLightboxIndex}
							videos={videos}
							onCloseLightbox={closeLightbox}
							onNextVideo={handleNextVideo}
							onOpenLightbox={openLightbox}
							onPrevVideo={handlePrevVideo}
						/>

						{/* Services Section */}
						{hasServices && (
							<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
								<h2 className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900 dark:border-slate-700 dark:text-white">
									<Layers className="text-forest-600" /> บริการเสริมและสินค้าอื่น
								</h2>

								<div className="space-y-8">
									{/* Mixed Agro */}
									{(orchard.additionalCrops?.length ?? 0) > 0 && (
										<div>
											<div className="mb-3 flex items-center gap-2">
												<Sprout className="text-forest-500" size={20} />
												<h3 className="font-bold text-slate-800 dark:text-slate-200">
													สวนเกษตรผสมผสาน
												</h3>
											</div>
											<p className="mb-3 text-sm text-slate-500">
												นอกจากทุเรียนแล้ว ยังมีพืชผลอื่นๆ:
											</p>
											<div className="flex flex-wrap gap-2">
												{orchard.additionalCrops?.map((CropOption, idx) => {
													const cropInfo = getCrop(CropOption);

													return (
														<span
															key={idx}
															className="rounded-lg border border-green-100 bg-green-50 px-3 py-1 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
														>
															{cropInfo?.label || CropOption}
														</span>
													);
												})}
											</div>
										</div>
									)}

									<OrchardAccommodations
										hasPrecedingContent={
											(orchard.additionalCrops?.length ?? 0) > 0
										}
										orchard={orchard}
									/>

									<OrchardPackages
										hasPrecedingContent={
											(orchard.additionalCrops?.length ?? 0) > 0 ||
											(orchard.accommodations?.length ?? 0) > 0
										}
										orchard={orchard}
									/>
								</div>
							</section>
						)}
					</div>

					{/* Right Column (Sidebar) */}
					<div className="lg:col-span-1">
						<OrchardLocation orchard={orchard} />
					</div>
				</div>
			</div>
		</div>
	);
};
