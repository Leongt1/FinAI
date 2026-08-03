import { useThemeStore } from "../store/themeStore";

// Recharts takes colors as SVG attributes, where var(--token) is unreliable,
// so charts read the resolved token values instead. Subscribing to the theme
// re-renders the chart with fresh values after a toggle.
export const useThemeColors = () => {
	const theme = useThemeStore((s) => s.theme);
	const css = getComputedStyle(document.documentElement);
	const get = (name: string) => css.getPropertyValue(name).trim();

	return {
		theme,
		border: get("--color-border"),
		surfaceRaised: get("--color-surface-raised"),
		foreground: get("--color-foreground"),
		textMuted: get("--color-text-muted"),
		income: get("--color-income"),
		expense: get("--color-expense"),
		accent: get("--color-accent"),
		subtle: get("--color-subtle"),
	};
};
