import { useState } from "react";
import BudgetModal from "../components/BudgetModal";
import BudgetProgressBar from "../components/BudgetProgressBar";
import ConfirmDialog from "../components/ConfirmDialog";
import DashboardLayout from "../components/DashboardLayout";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import type { Budget } from "../types";
import { budgetStatusStyles, formatPeriod } from "../utils/budgetStatus";
import { formatCurrency } from "../utils/formatCurrency";

const BudgetsPage = () => {
	const { budgets, statuses, isLoading, deleteBudget, isDeleting } =
		useBudgets();
	const { categories } = useCategories();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [budgetToEdit, setBudgetToEdit] = useState<Budget | undefined>(
		undefined,
	);
	const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

	const openCreate = () => {
		setBudgetToEdit(undefined);
		setIsModalOpen(true);
	};

	const openEdit = (budget: Budget) => {
		setBudgetToEdit(budget);
		setIsModalOpen(true);
	};

	const handleDelete = () => {
		if (!budgetToDelete) return;
		deleteBudget(budgetToDelete.id);
		setBudgetToDelete(null);
	};

	const categoryNames = (budget: Budget): string => {
		const ids = budget.category_ids ?? [];
		const names = ids
			.map((id) => categories?.find((c) => c.id === id))
			.filter((c) => !!c)
			.map((c) => `${c.icon} ${c.name}`);
		return names.join(", ");
	};

	return (
		<DashboardLayout>
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-foreground">Budgets</h1>
				<button
					onClick={openCreate}
					className="bg-accent text-accent-glow rounded-xl px-4 py-2 text-xl font-semibold hover:bg-accent-glow hover:text-accent transition-all cursor-pointer"
				>
					+
				</button>
			</div>

			{/* Budget cards */}
			{isLoading ? (
				<p className="text-text-muted animate-pulse">Loading budgets...</p>
			) : !budgets || budgets.length === 0 ? (
				<div className="bg-surface rounded-2xl border border-border p-10 text-center">
					<p className="text-text-muted mb-2">No budgets yet.</p>
					<p className="text-subtle text-sm">
						Create a spending limit or a savings goal to start tracking.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{budgets.map((budget) => {
						const status = statuses[budget.id];
						const styles = status && budgetStatusStyles[status.status];
						return (
							<div
								key={budget.id}
								className="bg-surface rounded-2xl border border-border p-6 flex flex-col gap-4"
							>
								{/* title row */}
								<div className="flex items-start justify-between gap-2">
									<div>
										<h2 className="text-lg font-semibold text-foreground">
											{budget.name}
										</h2>
										<p className="text-subtle text-xs mt-1">
											{budget.kind === "expense"
												? "Spending limit"
												: "Savings goal"}{" "}
											· {formatCurrency(budget.amount)}{" "}
											{formatPeriod(budget.period_unit, budget.period_value)}
										</p>
									</div>
									{styles && (
										<span
											className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${styles.text} ${styles.bg}`}
										>
											{styles.label}
										</span>
									)}
								</div>

								{/* scope */}
								<p className="text-xs text-text-muted">
									{budget.type === "overall"
										? "All spending"
										: categoryNames(budget) || "No categories attached"}
								</p>

								{/* progress */}
								{status ? (
									<div className="flex flex-col gap-2">
										<BudgetProgressBar
											percent={status.progress_percent}
											status={status.status}
										/>
										<div className="flex justify-between text-xs text-text-muted">
											<span>
												{budget.kind === "expense" ? "Spent" : "Saved"}{" "}
												{formatCurrency(status.spent, {
													sign: status.spent < 0,
												})}{" "}
												({Math.round(status.progress_percent)}%)
											</span>
											<span>
												{status.remaining >= 0
													? `${formatCurrency(status.remaining)} left`
													: `${formatCurrency(Math.abs(status.remaining))} over`}
											</span>
										</div>
									</div>
								) : (
									<p className="text-subtle text-xs animate-pulse">
										Loading status...
									</p>
								)}

								{/* actions */}
								<div className="flex gap-3 mt-auto pt-2 border-t border-border">
									<button
										onClick={() => openEdit(budget)}
										className="text-sm text-text-muted hover:text-accent-glow transition-colors cursor-pointer"
									>
										Edit
									</button>
									<button
										onClick={() => setBudgetToDelete(budget)}
										className="text-sm text-expense hover:opacity-80 transition-opacity cursor-pointer"
									>
										Delete
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* create / edit modal */}
			<BudgetModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				categories={categories}
				budget={budgetToEdit}
			/>

			{/* delete confirmation */}
			<ConfirmDialog
				isOpen={!!budgetToDelete}
				title="Delete budget"
				message={`Delete "${budgetToDelete?.name}"? Transactions are not affected.`}
				isLoading={isDeleting}
				onCancel={() => setBudgetToDelete(null)}
				onConfirm={handleDelete}
			/>
		</DashboardLayout>
	);
};

export default BudgetsPage;
