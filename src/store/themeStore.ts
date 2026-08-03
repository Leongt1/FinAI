import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "finai-theme";

const applyTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("dark", theme === "dark");
};

// Light is the default; only an explicit stored "dark" opts out.
const initialTheme: Theme =
	localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
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
