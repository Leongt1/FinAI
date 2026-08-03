import { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import type { Transaction, TransactionFilter } from "../types";
import { useTransactions, useTransactionsPage } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import TransactionModal from "../components/TransactionModal";
import CategoryDropdown from "../components/CategoryDropdown";
import TitleText from "../components/TitleText";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatCurrency } from "../utils/formatCurrency";

const getMonthRange = (year: number, month: number) => {
	const from = new Date(year, month, 1);
	const to = new Date(year, month + 1, 0);
	return {
		date_from: from.toISOString(),
		date_to: to.toISOString(),
	};
};

const now = new Date();

const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const PAGE_SIZE = 10;

const TransactionPage = () => {
	const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
	const [selectedYear, setSelectedYear] = useState(now.getFullYear());
	const [filters, setFiltersState] = useState<TransactionFilter>(
		getMonthRange(now.getFullYear(), now.getMonth()),
	);
	const [page, setPage] = useState(0);

	// every filter change restarts paging from the first page
	const setFilters = (updater: (prev: TransactionFilter) => TransactionFilter) => {
		setPage(0);
		setFiltersState(updater);
	};

	const [activeTab, setActiveTab] = useState<"All" | "Income" | "Expense">(
		"All",
	);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<
		Transaction | undefined
	>(undefined);
	const [transactionToDelete, setTransactionToDelete] =
		useState<Transaction | null>(null);

	const [showToolTip, setShowToolTip] = useState(false);

	// full filtered list: summary cards need totals across the whole filter range
	const { transactions, deleteTransaction, isDeleting } =
		useTransactions(filters);
	// paged slice for the table
	const { pageData, isLoading, error } = useTransactionsPage(
		filters,
		page,
		PAGE_SIZE,
	);
	const { categories } = useCategories();

	const total = pageData?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	// if a delete empties the current page (or filters shrink the set),
	// clamp back to the last page - render-time adjustment, no effect needed
	if (pageData && page > 0 && page >= totalPages) {
		setPage(totalPages - 1);
	}

	const pageRows = pageData?.transactions;

	const summary = useMemo(() => {
		if (!transactions) return { income: 0, expense: 0, net: 0 };

		const income = transactions
			.filter((tx) => tx.type == "Income")
			.reduce((sum, tx) => sum + tx.amount, 0);

		const expense = transactions
			.filter((tx) => tx.type == "Expense")
			.reduce((sum, tx) => sum + tx.amount, 0);

		return { income, expense, net: income - expense };
	}, [transactions]);

	const handleTabChange = (tab: "All" | "Income" | "Expense") => {
		setActiveTab(tab);
		setFilters((prev) => ({
			...prev,
			type: tab === "All" ? undefined : tab,
		}));
	};

	const handleEdit = (tx: Transaction) => {
		setSelectedTransaction(tx);
		setIsModelOpen(true);
	};

	const handleAddNew = () => {
		setSelectedTransaction(undefined);
		setIsModelOpen(true);
	};

	const handleClose = () => {
		setIsModelOpen(false);
		setSelectedTransaction(undefined);
	};

	const getTransactionCategoryName = (tx: Transaction | null) => {
		if (!tx) return "Unknown";
		return (
			categories?.find((category) => category.id === tx.category_id)?.name ??
			"Unknown"
		);
	};

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
				<TitleText title="Transactions" />
				{/* Add transaction Btn */}
				<div className="fixed right-4 bottom-4 sm:right-10 sm:bottom-10 z-20 flex items-center gap-2">
					{showToolTip && (
						<span className="text-accent-glow text-sm bg-surface-raised/90 px-2 py-1 rounded-lg border border-border-strong whitespace-nowrap shadow-md">
							New Transaction
						</span>
					)}
					<button
						onClick={handleAddNew}
						onMouseEnter={() => setShowToolTip(true)}
						onMouseLeave={() => setShowToolTip(false)}
						className="bg-accent-dim w-12 h-12 text-accent-glow rounded-lg p-2 mt-3 font-semibold hover:bg-accent hover:text-on-accent transition-colors cursor-pointer"
					>
						<span className="text-2xl mb-1 font-semibold text-accent-glow leading-none">+</span>
					</button>
				</div>
				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					<div className="bg-surface rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border border-border shadow-sm">
						<p className="text-text-muted text-sm">Total Income</p>
						<p className="font-bold text-2xl text-income">
							{formatCurrency(summary.income)}
						</p>
					</div>
					<div className="bg-surface rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border border-border shadow-sm">
						<p className="text-text-muted text-sm">Total Expense</p>
						<p className="font-bold text-2xl text-expense">
							{formatCurrency(summary.expense)}
						</p>
					</div>
					<div
						className={`bg-surface rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border border-border shadow-sm`}
					>
						<p className="text-text-muted text-sm">Net Savings</p>
						<p
							className={`font-bold text-2xl ${summary.net >= 0 ? "text-text-muted" : "text-expense"
								}`}
						>
							{formatCurrency(summary.net, { sign: true })}
						</p>
					</div>
				</div>
				{/* Filter section */}
				<div className="bg-surface rounded-3xl p-2 flex flex-wrap justify-between mb-2 items-center gap-2">
					{/* Left */}
					<div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-start">
						<div className="flex items-center gap-2 bg-surface-raised rounded-full p-1">
							{["All", "Expense", "Income"].map((tab) => (
								<p
									key={tab}
									onClick={() =>
										handleTabChange(tab as "All" | "Income" | "Expense")
									}
									className={`text-sm text-text-muted p-2 px-4 rounded-full cursor-pointer transition-colors ${activeTab === tab
											? "bg-surface font-semibold"
											: "hover:bg-surface"
										}`}
								>
									{tab}
								</p>
							))}
						</div>
						<CategoryDropdown
							categories={categories ?? []}
							value={filters.category_id ?? ""}
							onChange={(value) =>
								setFilters((prev) => ({
									...prev,
									category_id: value || undefined,
								}))
							}
						/>
					</div>
				</div>
				{/* Month/Year navigation bar — months scroll horizontally on small screens */}
				<div className="bg-surface rounded-3xl mb-3 flex items-center px-4 overflow-x-auto">
					{/* Year */}
					<div className="flex items-center gap-1 pr-4 border-r border-border shrink-0">
						<button
							onClick={() => {
								const newYear = selectedYear - 1;
								setSelectedYear(newYear);
								setFilters((prev) => ({
									...prev,
									...getMonthRange(newYear, selectedMonth),
								}));
							}}
							className="text-text-muted hover:text-accent-glow cursor-pointer px-1"
						>
							←
						</button>
						<span className="text-sm font-semibold text-text-muted w-10 text-center">
							{selectedYear}
						</span>
						<button
							onClick={() => {
								const newYear = selectedYear + 1;
								setSelectedYear(newYear);
								setFilters((prev) => ({
									...prev,
									...getMonthRange(newYear, selectedMonth),
								}));
							}}
							disabled={selectedYear >= now.getFullYear()}
							className="text-text-muted hover:text-subtle cursor-pointer px-1 disabled:opacity-30 disabled:cursor-not-allowed"
						>
							→
						</button>
					</div>

					{/* Month tabs — min-w-max keeps tabs full-size and lets the bar scroll */}
					<div className="flex flex-1 min-w-max">
						{monthNames.map((month, index) => {
							const isActive = selectedMonth === index;
							const isFuture =
								selectedYear === now.getFullYear() && index > now.getMonth();

							return (
								<button
									key={month}
									onClick={() => {
										if (isFuture) return;
										setSelectedMonth(index);
										setFilters((prev) => ({
											...prev,
											...getMonthRange(selectedYear, index),
										}));
									}}
									className={`flex-1 py-4 px-3 text-sm font-medium transition-colors relative ${isActive
											? "text-accent-glow font-bold"
											: isFuture
												? "text-subtle/70 cursor-not-allowed"
												: "text-text-muted hover:text-foreground cursor-pointer"
										}`}
								>
									{month}
									{/* active underline */}
									{isActive && (
										<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-glow rounded-full" />
									)}
								</button>
							);
						})}
					</div>
				</div>
				{/* Transaction List — table scrolls inside its card on small screens */}
				<div className="w-full bg-surface border border-border rounded-t-3xl overflow-x-auto">
					<table className="w-full min-w-[640px]">
						<thead>
							<tr className="border-b border-border">
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Date
								</th>
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Category
								</th>
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Description
								</th>
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Type
								</th>
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Amount
								</th>
								<th className="text-left text-xs font-medium text-subtle uppercase p-4">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{error && (
								<tr>
									<td
										colSpan={6}
										className="py-8 text-center text-sm text-expense"
									>
										Something went wrong. Please try again.
									</td>
								</tr>
							)}
							{isLoading && (
								<tr className="hover:bg-surface-raised transition-colors py-1 px-4">
									<td
										colSpan={6}
										className="py-4 text-center text-sm text-text-muted"
									>
										Loading...
									</td>
								</tr>
							)}
							{!isLoading && !error && pageRows?.length === 0 && (
								<tr className="hover:bg-surface-raised transition-colors py-1 px-4">
									<td
										colSpan={6}
										className="py-4 text-center text-sm text-text-muted"
									>
										No transactions found
									</td>
								</tr>
							)}

							{pageRows?.map((tx) => {
								const category = categories?.find(
									(category) => category.id === tx.category_id,
								);
								return (
									<tr
										key={tx.id}
										className="hover:bg-surface-raised transition-colors"
									>
										<td className="p-4 text-sm text-text-muted">
											{new Date(tx.date).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="py-4 text-sm text-text-muted">
											{category?.icon} {category?.name ?? "Unknown"}
										</td>
										<td className="py-4 text-sm text-text-muted">
											{tx.description ?? "-"}
										</td>
										<td className="py-4 text-sm text-text-muted">{tx.type}</td>
										<td
											className={`py-4 text-sm font-semibold ${tx.type === "Income" ? "text-income" : "text-expense"
												}`}
										>
											{tx.type === "Income" ? "+" : "-"}
											{formatCurrency(tx.amount)}
										</td>
										<td className="py-4 text-sm text-text-muted flex gap-4">
											<button
												onClick={() => handleEdit(tx)}
												className="text-text-muted hover:text-accent-glow hover:bg-surface rounded-xl cursor-pointer p-2 transition-all"
											>
												Edit
											</button>
											<button
												onClick={() => setTransactionToDelete(tx)}
												disabled={isDeleting}
												className="text-expense hover:text-expense hover:bg-expense-bg rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												Delete
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{/* Pager */}
				<div className="w-full bg-surface border border-t-0 border-border rounded-b-3xl px-4 py-3 flex items-center justify-between gap-2">
					<p className="text-sm text-text-muted">
						{total === 0
							? "No entries"
							: `Showing ${page * PAGE_SIZE + 1}-${Math.min(
									(page + 1) * PAGE_SIZE,
									total,
								)} of ${total}`}
					</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setPage((p) => Math.max(0, p - 1))}
							disabled={page === 0}
							className="text-sm text-text-muted border border-border rounded-xl px-3 py-1.5 hover:bg-surface-raised transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Prev
						</button>
						<span className="text-sm text-text-muted">
							Page {Math.min(page + 1, totalPages)} of {totalPages}
						</span>
						<button
							onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
							disabled={page >= totalPages - 1}
							className="text-sm text-text-muted border border-border rounded-xl px-3 py-1.5 hover:bg-surface-raised transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			</div>
			<TransactionModal
				isOpen={isModelOpen}
				onClose={handleClose}
				categories={categories ?? []}
				transaction={selectedTransaction}
			/>
			<ConfirmDialog
				isOpen={!!transactionToDelete}
				title="Delete transaction?"
				message={`Delete ${getTransactionCategoryName(transactionToDelete)} transaction for ${formatCurrency(transactionToDelete?.amount ?? 0)}?`}
				isLoading={isDeleting}
				onCancel={() => setTransactionToDelete(null)}
				onConfirm={() => {
					if (!transactionToDelete) return;
					deleteTransaction(transactionToDelete.id);
					setTransactionToDelete(null);
				}}
			/>
		</DashboardLayout>
	);
};

export default TransactionPage;
