import { budgetData } from "../../data/dashboardData";

const BudgetOverview = () => {
	return (
		<div className="bg-surface rounded-2xl border border-border p-6 h-full">
			<h2 className="text-lg font-semibold text-foreground mb-4">Budget</h2>
			<div className="flex flex-col gap-4">
				{budgetData.map((item) => {
					const percentage = Math.min((item.spent / item.limit) * 100, 100);
					const isOverBudget = item.spent > item.limit;
					return (
						<div key={item.category}>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-text-muted">{item.category}</span>
								<span
									className={
										isOverBudget ? "text-expense font-medium" : "text-subtle"
									}
								>
									${item.spent} / ${item.limit}
								</span>
							</div>
							{/* Progress bar */}
							<div className="w-full bg-surface-raised rounded-full h-5">
								<div
									className={`${isOverBudget ? "bg-expense" : "bg-accent"} h-5 rounded-full transition-all`}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BudgetOverview;
