import type { BudgetHealthStatus } from "../types";

// One place mapping backend budget health -> theme tokens.
export const budgetStatusStyles: Record<
	BudgetHealthStatus,
	{ text: string; bg: string; bar: string; label: string }
> = {
	healthy: {
		text: "text-income",
		bg: "bg-income-bg",
		bar: "bg-income",
		label: "Healthy",
	},
	warning: {
		text: "text-warning",
		bg: "bg-warning-bg",
		bar: "bg-warning",
		label: "Warning",
	},
	exceeded: {
		text: "text-expense",
		bg: "bg-expense-bg",
		bar: "bg-expense",
		label: "Exceeded",
	},
	achieved: {
		text: "text-accent-glow",
		bg: "bg-accent-dim",
		bar: "bg-accent-glow",
		label: "Achieved",
	},
};

export const formatPeriod = (unit: string, value: number): string =>
	value > 1 ? `every ${value} ${unit}s` : `every ${unit}`;
