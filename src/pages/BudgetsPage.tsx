import { useState } from "react";
import BudgetModal from "../components/BudgetModal";
import BudgetProgressBar from "../components/BudgetProgressBar";
import ConfirmDialog from "../components/ConfirmDialog";
import DashboardLayout from "../components/DashboardLayout";
import TitleText from "../components/TitleText";
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
	const [showToolTip, setShowToolTip] = useState(false);

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
			<TitleText title="Budgets" />
			{/* Add budget Btn */}
			<div className="fixed right-4 bottom-4 sm:right-10 sm:bottom-10 z-20 flex items-center gap-2">
				{showToolTip && (
					<span className="text-accent-glow text-sm bg-surface-raised/90 px-2 py-1 rounded-lg border border-border-strong whitespace-nowrap shadow-md">
						New Budget
					</span>
				)}
				<button
					onClick={openCreate}
					onMouseEnter={() => setShowToolTip(true)}
					onMouseLeave={() => setShowToolTip(false)}
					className="bg-accent-dim w-12 h-12 text-accent-glow rounded-lg p-2 mt-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
				>
					<span className="text-2xl mb-1 font-semibold text-accent-glow leading-none">+</span>
				</button>
			</div>

			{/* Budget cards */}
			{isLoading ? (
				<p className="text-text-muted animate-pulse">Loading budgets...</p>
			) : !budgets || budgets.length === 0 ? (
				<div className="bg-surface rounded-3xl border border-border p-10 text-center shadow-md">
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
								className="bg-surface rounded-3xl border border-border p-6 flex flex-col gap-4 shadow-md hover:shadow-lg transition-shadow"
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
