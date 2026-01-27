import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { Theme, FontSize } from "../interface/themeInterface";

interface ThemeContextType {
	theme: Theme;
	fontSize: FontSize;
	toggleTheme: () => void;
	setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Initialize from local storage or default
	const [theme, setThemeState] = useState<Theme>(() => {
		const saved = localStorage.getItem("theme");

		return (saved as Theme) || "system";
	});

	const [fontSize, setFontSizeState] = useState<FontSize>(() => {
		const saved = localStorage.getItem("fontSize");

		return (saved as FontSize) || "medium";
	});

	// Apply Theme
	useEffect(() => {
		const root = window.document.documentElement;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const applyTheme = () => {
			if (theme === "dark") {
				root.classList.add("dark");
			} else if (theme === "light") {
				root.classList.remove("dark");
			} else if (theme === "system") {
				if (mediaQuery.matches) {
					root.classList.add("dark");
				} else {
					root.classList.remove("dark");
				}
			}
		};

		applyTheme();

		// Listener for system changes
		const listener = () => {
			if (theme === "system") applyTheme();
		};

		mediaQuery.addEventListener("change", listener);
		localStorage.setItem("theme", theme);

		return () => mediaQuery.removeEventListener("change", listener);
	}, [theme]);

	// Apply Font Size
	useEffect(() => {
		const root = window.document.documentElement;
		let sizeValue = "14px";

		if (fontSize === "small") sizeValue = "12px";
		if (fontSize === "large") sizeValue = "16px";

		root.style.fontSize = sizeValue;
		localStorage.setItem("fontSize", fontSize);
	}, [fontSize]);

	const toggleTheme = () => {
		setThemeState((prev) => {
			if (prev === "light") return "dark";
			if (prev === "dark") return "system";

			return "light";
		});
	};

	const setFontSize = (size: FontSize) => {
		setFontSizeState(size);
	};

	return (
		<ThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
