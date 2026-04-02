import { useState, useEffect } from "react";

/**
 * Hook to detect window size changes
 * @returns Object with current window width
 */
export default function useWindowSize() {
	const [size, setSize] = useState({ width: window.innerWidth });

	useEffect(() => {
		const handleResize = () => setSize({ width: window.innerWidth });

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
}
