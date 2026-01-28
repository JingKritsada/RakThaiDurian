import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { SocialMediaLinks } from "../interface/orchardInterface";
import { LineIcon, TiktokIcon } from "../utils/icons";

interface SocialLinksProps {
	links?: SocialMediaLinks;
	className?: string;
	itemClassName?: string;
	showUrl?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
	links,
	className = "flex gap-3",
	itemClassName = "",
	showUrl = false,
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

	if (showUrl) {
		return (
			<div className={`space-y-3 ${className}`}>
				{validItems.map((item) => (
					<a
						key={item.key}
						className="flex items-center gap-3 p-2 rounded-xl group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
						href={item.url}
						rel="noopener noreferrer"
						target="_blank"
					>
						<div
							className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm group-hover:scale-110 transition-transform shrink-0 ${item.color}`}
						>
							<item.icon className="w-5 h-5" />
						</div>
						<div className="flex flex-col min-w-0">
							<span className="text-md tracking-wider font-bold text-slate-700 dark:text-slate-300 group-hover:text-forest-600 dark:group-hover:text-forest-400">
								{item.label}
							</span>
							<span className="text-sm font-mono text-slate-500 truncate group-hover:underline">
								{item.url}
							</span>
						</div>
					</a>
				))}
			</div>
		);
	}

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
