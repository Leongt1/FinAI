import { Link } from "react-router-dom";
import { useBudgets } from "../../hooks/useBudgets";
import { budgetStatusStyles } from "../../utils/budgetStatus";
import { formatCurrency } from "../../utils/formatCurrency";
import BudgetProgressBar from "../BudgetProgressBar";

const MAX_SHOWN = 4;

const BudgetOverview = () => {
	const { budgets, statuses, isLoading } = useBudgets();

	return (
		<div className="bg-surface rounded-2xl border border-border p-6 h-full flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold text-foreground">Budgets</h2>
				<Link
					to="/budget"
					className="text-xs text-text-muted hover:text-accent-glow transition-colors"
				>
					View all →
				</Link>
			</div>

			{isLoading ? (
				<p className="text-text-muted text-sm animate-pulse">Loading...</p>
			) : !budgets || budgets.length === 0 ? (
				<div className="flex flex-col items-center justify-center flex-1 text-center py-6">
					<p className="text-text-muted text-sm mb-1">No budgets yet.</p>
					<Link
						to="/budget"
						className="text-accent-glow text-sm hover:underline"
					>
						Create your first budget
					</Link>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{budgets.slice(0, MAX_SHOWN).map((budget) => {
						const status = statuses[budget.id];
						if (!status) {
							return (
								<p
									key={budget.id}
									className="text-subtle text-xs animate-pulse"
								>
									{budget.name}...
								</p>
							);
						}
						const styles = budgetStatusStyles[status.status];
						return (
							<div key={budget.id} className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between gap-2">
									<span className="text-sm text-text-muted truncate">
										{budget.name}
									</span>
									<span className={`text-xs shrink-0 ${styles.text}`}>
										{Math.round(status.progress_percent)}%
									</span>
								</div>
								<BudgetProgressBar
									percent={status.progress_percent}
									status={status.status}
								/>
								<span className="text-xs text-subtle">
									{formatCurrency(status.spent, { sign: status.spent < 0 })} of{" "}
									{formatCurrency(status.budget_amount)}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default BudgetOverview;
