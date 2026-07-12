import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "finai-theme";

const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("light", theme === "light");
};

const initialTheme: Theme =
	localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
applyTheme(initialTheme);

interface ThemeState {
	theme: Theme;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
	theme: initialTheme,

	toggleTheme: () =>
		set((s) => {
			const next: Theme = s.theme === "dark" ? "light" : "dark";
			localStorage.setItem(STORAGE_KEY, next);
			applyTheme(next);
			return { theme: next };
		}),
}));
