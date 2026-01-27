import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { SocialMediaLinks } from "../interface/orchardInterface";
import { LineIcon, TiktokIcon } from "../utils/icons";

interface SocialLinksProps {
	links?: SocialMediaLinks;
	className?: string;
	itemClassName?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
	links,
	className = "flex gap-3",
	itemClassName = "",
}) => {
	if (!links) return null;

	const socialItems = [
		{
			key: "line",
			icon: LineIcon,
			color: "bg-[#06C755] text-white",
			label: "Line",
			url: links.line,
		},
		{
			key: "facebook",
			icon: Facebook,
			color: "bg-[#1877F2] text-white",
			label: "Facebook",
			url: links.facebook,
		},
		{
			key: "instagram",
			icon: Instagram,
			color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
			label: "Instagram",
			url: links.instagram,
		},
		{
			key: "tiktok",
			icon: TiktokIcon,
			color: "bg-black text-white dark:bg-slate-800 dark:border dark:border-slate-600",
			label: "TikTok",
			url: links.tiktok,
		},
		{
			key: "youtube",
			icon: Youtube,
			color: "bg-[#FF0000] text-white",
			label: "YouTube",
			url: links.youtube,
		},
	];

	const validItems = socialItems.filter((item) => item.url && item.url.trim() !== "");

	if (validItems.length === 0) return null;

	return (
		<div className={className}>
			{validItems.map((item) => (
				<a
					key={item.key}
					className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform ${item.color} ${itemClassName}`}
					href={item.url}
					rel="noopener noreferrer"
					target="_blank"
					title={item.label}
				>
					<item.icon className="w-4 h-4" />
				</a>
			))}
		</div>
	);
};
