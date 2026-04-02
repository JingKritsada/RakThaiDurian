import type { SocialMediaLinks } from "@/interfaces/orchardInterface";

import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

import { LineIcon, TiktokIcon } from "@/utils/icons";

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
			color: "bg-[#06C755] text-white!",
			label: "Line",
			url: links.line,
		},
		{
			key: "facebook",
			icon: Facebook,
			color: "bg-[#1877F2] text-white!",
			label: "Facebook",
			url: links.facebook,
		},
		{
			key: "instagram",
			icon: Instagram,
			color: "bg-[linear-gradient(to_top_right,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] text-white!",
			label: "Instagram",
			url: links.instagram,
		},
		{
			key: "tiktok",
			icon: TiktokIcon,
			color: "bg-black text-white! dark:bg-slate-800 dark:border dark:border-slate-600",
			label: "TikTok",
			url: links.tiktok,
		},
		{
			key: "youtube",
			icon: Youtube,
			color: "bg-[#FF0000] text-white!",
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
						className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
						href={item.url}
						rel="noopener noreferrer"
						target="_blank"
					>
						<div
							className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${item.color}`}
						>
							<item.icon className="h-5 w-5" />
						</div>
						<div className="flex min-w-0 flex-col">
							<span className="text-md font-bold tracking-wider text-slate-700 group-hover:text-forest-600 dark:text-slate-300 dark:group-hover:text-forest-400">
								{item.label}
							</span>
							<span className="truncate font-mono text-sm text-slate-500 group-hover:underline">
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
					className={`flex aspect-square h-8 w-8 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110 ${item.color} ${itemClassName}`}
					href={item.url}
					rel="noopener noreferrer"
					target="_blank"
					title={item.label}
				>
					<item.icon className="h-4 w-4" />
				</a>
			))}
		</div>
	);
};
