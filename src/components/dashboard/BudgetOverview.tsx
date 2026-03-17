import { budgetData } from "../../data/dashboardData";

const BudgetOverview = () => {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">Budget</h2>
			<div className="flex flex-col gap-4">
				{budgetData.map((item) => {
					const percentage = Math.min((item.spent / item.limit) * 100, 100);
					const isOverBudget = item.spent > item.limit;
					return (
						<div key={item.category}>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">{item.category}</span>
								<span
									className={
										isOverBudget ? "text-red-500 font-medium" : "text-gray-500"
									}
								>
									${item.spent} / ${item.limit}
								</span>
							</div>
							{/* Progress bar */}
							<div className="w-full bg-gray-100 rounded-full h-5">
								<div
									className={`${isOverBudget ? "bg-red-500" : item.color} h-5 rounded-full transition-all`}
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
