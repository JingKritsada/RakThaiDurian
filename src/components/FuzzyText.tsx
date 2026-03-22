import React, { useEffect, useRef, useState } from "react";

interface FuzzyTextProps {
	children: React.ReactNode;
	fontSize?: number | string;
	fontWeight?: string | number;
	fontFamily?: string;
	color?: string;
	enableHover?: boolean;
	baseIntensity?: number;
	hoverIntensity?: number;
	className?: string;
}

export const FuzzyText: React.FC<FuzzyTextProps> = ({
	children,
	fontSize = "clamp(2rem, 8vw, 8rem)",
	fontWeight = 900,
	fontFamily = "inherit",
	color = "#fff",
	enableHover = true,
	baseIntensity = 0.18,
	hoverIntensity = 0.5,
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isHovering, setIsHovering] = useState(false);
	const intensityRef = useRef(baseIntensity);
	const animationFrameRef = useRef<number>(0);

	useEffect(() => {
		intensityRef.current = isHovering ? hoverIntensity : baseIntensity;
	}, [isHovering, baseIntensity, hoverIntensity]);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		const ctx = canvas.getContext("2d");

		if (!ctx) return;

		const text = React.Children.toArray(children).join("");
		let isActive = true;

		const initCanvas = async () => {
			if (document.fonts?.ready) {
				await document.fonts.ready;
			}
			if (!isActive) return;

			const computedFontFamily =
				fontFamily === "inherit"
					? window.getComputedStyle(canvas).fontFamily || "sans-serif"
					: fontFamily;

			const offscreen = document.createElement("canvas");
			const offCtx = offscreen.getContext("2d");

			if (!offCtx) return;

			offCtx.font = `${fontWeight} ${fontSize} ${computedFontFamily}`;
			const metrics = offCtx.measureText(text);

			const width = Math.ceil(metrics.width);
			const height = Math.ceil(
				(metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0)
			);

			const padding = 30;

			canvas.width = width + padding * 2;
			canvas.height = height + padding;

			offscreen.width = width;
			offscreen.height = height;
			offCtx.fillStyle = color;
			offCtx.font = `${fontWeight} ${fontSize} ${computedFontFamily}`;
			offCtx.fillText(text, 0, metrics.actualBoundingBoxAscent || height * 0.8);

			const render = () => {
				if (!isActive) return;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.save();
				ctx.translate(padding, padding);

				const intensity = intensityRef.current;
				const fuzzRange = 30;

				for (let y = 0; y < height; y++) {
					const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);

					ctx.drawImage(offscreen, 0, y, width, 1, dx, y, width, 1);
				}

				ctx.restore();
				animationFrameRef.current = requestAnimationFrame(render);
			};

			render();
		};

		initCanvas();

		return () => {
			isActive = false;
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, [children, fontSize, fontWeight, fontFamily, color]);

	const handleHover = (state: boolean) => {
		if (enableHover) setIsHovering(state);
	};

	return (
		<div
			className={`relative inline-block ${className}`}
			onMouseEnter={() => handleHover(true)}
			onMouseLeave={() => handleHover(false)}
			onTouchEnd={() => handleHover(false)}
			onTouchStart={() => handleHover(true)}
		>
			<canvas
				ref={canvasRef}
				aria-label={typeof children === "string" ? children : "Fuzzy text"}
				className="block w-full h-auto"
			/>
		</div>
	);
};
