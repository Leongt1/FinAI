import type { BudgetHealthStatus } from "../types";
import { budgetStatusStyles } from "../utils/budgetStatus";

interface BudgetProgressBarProps {
	percent: number;
	status: BudgetHealthStatus;
}

const BudgetProgressBar = ({ percent, status }: BudgetProgressBarProps) => (
	<div className="w-full h-2 rounded-full bg-bg border border-border overflow-hidden">
		<div
			className={`h-full rounded-full ${budgetStatusStyles[status].bar} transition-all`}
			style={{ width: `${Math.min(percent, 100)}%` }}
		/>
	</div>
);

export default BudgetProgressBar;
