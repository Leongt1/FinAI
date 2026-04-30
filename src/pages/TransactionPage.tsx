import { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import type { Transaction, TransactionFilter } from "../types";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import TransactionModel from "../components/TransactionModel";
import CategoryDropdown from "../components/CategoryDropdown";

const getMonthRange = (year: number, month: number) => {
	const from = new Date(year, month, 1);
	const to = new Date(year, month + 1, 0);
	return {
		date_from: from.toISOString(),
		date_to: to.toISOString(),
	};
};

const now = new Date();

const TransactionPage = () => {
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

	const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
	const [selectedYear, setSelectedYear] = useState(now.getFullYear());
	const [filters, setFilters] = useState<TransactionFilter>(
		getMonthRange(now.getFullYear(), now.getMonth()),
	);

	const [activeTab, setActiveTab] = useState<"All" | "Income" | "Expense">(
		"All",
	);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<
		Transaction | undefined
	>(undefined);

	const [showToolTip, setShowToolTip] = useState(false);

	const { transactions, isLoading, error, deleteTransaction, isDeleting } =
		useTransactions(filters);
	const { categories } = useCategories();

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

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
				<div className="bg-white rounded-3xl p-6 mb-4 flex justify-between items-center">
					<h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
					{/* Add transaction Btn */}
					<div className="fixed flex-col items-end right-10 bottom-10 flex items-center gap-2">
						{showToolTip && (
							<span className="text-gray-600 text-sm bg-white/50 px-2 py-1 rounded-lg whitespace-nowrap shadow-md">
								New Transaction
							</span>
						)}
						<button
							onClick={handleAddNew}
							onMouseEnter={() => setShowToolTip(true)}
							onMouseLeave={() => setShowToolTip(false)}
							className="bg-white w-12 h-12 border-1 border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-md"
						>
							<p className="text-2xl mb-1 font-semibold text-black">+</p>
						</button>
					</div>
				</div>
				{/* Summary Cards */}
				<div className="flex gap-6 justify-start">
					<div className="bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border-2 border-blue-200 shadow-sm">
						<p className="text-gray-600 text-sm">Total Income</p>
						<p className="font-bold text-2xl text-blue-400">
							₹{summary.income.toFixed(2)}
						</p>
					</div>
					<div className="bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border-2 border-red-200 shadow-sm">
						<p className="text-gray-600 text-sm">Total Expense</p>
						<p className="font-bold text-2xl text-red-400">
							₹{summary.expense.toFixed(2)}
						</p>
					</div>
					<div
						className={`bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-start justify-between border-2 ${summary.net >= 0 ? "border-green-200" : "border-red-200"} shadow-sm`}
					>
						<p className="text-gray-600 text-sm">Net Savings</p>
						<p
							className={`font-bold text-2xl ${
								summary.net >= 0 ? "text-green-400" : "text-red-400"
							}`}
						>
							{summary.net >= 0 ? "+" : "-"}₹{Math.abs(summary.net).toFixed(2)}
						</p>
					</div>
				</div>
				{/* Filter section */}
				<div className="bg-white rounded-3xl p-2 flex justify-between mb-1 items-center">
					{/* Left */}
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2 bg-gray-300 rounded-full p-1">
							{["All", "Expense", "Income"].map((tab) => (
								<p
									key={tab}
									onClick={() =>
										handleTabChange(tab as "All" | "Income" | "Expense")
									}
									className={`text-sm p-2 px-4 rounded-full cursor-pointer transition-colors ${
										activeTab === tab
											? "bg-white font-semibold"
											: "hover:bg-gray-200"
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
					{/* Middle */}
					{/* <div className="flex items-center gap-2">
						<div className="bg-gray-200 rounded-full px-2 pb-1 cursor-pointer hover:bg-gray-300 transition-colors">
							←
						</div>
						<p className="text-gray-400 text-sm">0 - 10</p>
						<div className="bg-gray-200 rounded-full px-2 pb-1 cursor-pointer hover:bg-gray-300 transition-colors">
							→
						</div>
					</div> */}
				</div>
				{/* Month/Year navigation bar */}
				<div className="bg-white rounded-3xl mb-1 flex items-center px-4">
					{/* Year */}
					<div className="flex items-center gap-1 pr-4 border-r border-gray-200">
						<button
							onClick={() => {
								const newYear = selectedYear - 1;
								setSelectedYear(newYear);
								setFilters((prev) => ({
									...prev,
									...getMonthRange(newYear, selectedMonth),
								}));
							}}
							className="text-gray-400 hover:text-gray-600 cursor-pointer px-1"
						>
							←
						</button>
						<span className="text-sm font-semibold text-gray-700 w-10 text-center">
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
							className="text-gray-400 hover:text-gray-600 cursor-pointer px-1 disabled:opacity-30 disabled:cursor-not-allowed"
						>
							→
						</button>
					</div>

					{/* Month tabs */}
					<div className="flex flex-1">
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
									className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
										isActive
											? "text-gray-900 font-bold"
											: isFuture
												? "text-gray-300 cursor-not-allowed"
												: "text-gray-500 hover:text-gray-700 cursor-pointer"
									}`}
								>
									{month}
									{/* active underline */}
									{isActive && (
										<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
									)}
								</button>
							);
						})}
					</div>
				</div>
				{/* Transaction List */}
				<div className="w-full bg-white rounded-t-3xl">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Date
								</th>
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Category
								</th>
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Description
								</th>
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Type
								</th>
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Amount
								</th>
								<th className="text-left text-xs font-medium text-gray-500 uppercase p-4">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{error && (
								<tr>
									<td
										colSpan={6}
										className="py-8 text-center text-sm text-red-600"
									>
										Something went wrong. Please try again.
									</td>
								</tr>
							)}
							{isLoading && (
								<tr className="hover:bg-gray-50 transition-colors py-1 px-4">
									<td
										colSpan={6}
										className="py-4 text-center text-sm text-gray-600"
									>
										Loading...
									</td>
								</tr>
							)}
							{!isLoading && !error && transactions?.length === 0 && (
								<tr className="hover:bg-gray-50 transition-colors py-1 px-4">
									<td
										colSpan={6}
										className="py-4 text-center text-sm text-gray-600"
									>
										No transactions found
									</td>
								</tr>
							)}

							{transactions?.map((tx) => {
								const category = categories?.find(
									(category) => category.id === tx.category_id,
								);
								return (
									<tr
										key={tx.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="p-4 text-sm text-gray-600">
											{new Date(tx.date).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="py-4 text-sm text-gray-600">
											{category?.icon} {category?.name ?? "Unknown"}
										</td>
										<td className="py-4 text-sm text-gray-600">
											{tx.description ?? "-"}
										</td>
										<td className="py-4 text-sm text-gray-600">{tx.type}</td>
										<td
											className={`py-4 text-sm font-semibold ${
												tx.type === "Income" ? "text-green-500" : "text-red-500"
											}`}
										>
											{tx.type === "Income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
										</td>
										<td className="py-4 text-sm text-gray-600 flex gap-4">
											<button
												onClick={() => handleEdit(tx)}
												className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer p-2 transition-colors"
											>
												Edit
											</button>
											<button
												onClick={() => deleteTransaction(tx.id)}
												disabled={isDeleting}
												className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
			</div>
			<TransactionModel
				isOpen={isModelOpen}
				onClose={handleClose}
				categories={categories ?? []}
				transaction={selectedTransaction}
			/>
		</DashboardLayout>
	);
};

export default TransactionPage;
