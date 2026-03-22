import { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import type { Transaction, TransactionFilter } from "../types";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import CategoryDropdown from "../components/CategoryDropDown";
import TransactionModel from "../components/TransactionModel";

const getMonthRange = () => {
	const now = new Date();
	const from = new Date(now.getFullYear(), now.getMonth(), 1);
	const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	return {
		date_from: from.toISOString(),
		date_to: to.toISOString(),
	};
};

const TransactionPage = () => {
	const [filters, setFilters] = useState<TransactionFilter>(getMonthRange());
	const [activeTab, setActiveTab] = useState<"All" | "Income" | "Expense">(
		"All",
	);

	const [isModelOpen, setIsModelOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<
		Transaction | undefined
	>(undefined);

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
				</div>
				{/* Summary Cards */}
				<div className="flex gap-6 justify-start">
					<div className="bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-center justify-between">
						<p className="text-gray-600 text-sm">Total Income</p>
						<p className="font-bold text-2xl text-green-400">
							₹{summary.income.toFixed(2)}
						</p>
					</div>
					<div className="bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-center justify-between">
						<p className="text-gray-600 text-sm">Total Expense</p>
						<p className="font-bold text-2xl text-red-400">
							₹{summary.expense.toFixed(2)}
						</p>
					</div>
					<div className="bg-white rounded-3xl p-6 px-10 mb-4 flex flex-col items-center justify-between">
						<p className="text-gray-600 text-sm">Net Savings</p>
						<p
							className={`font-bold text-2xl ${
								summary.net >= 0 ? "text-green-400" : "text-red-400"
							}`}
						>
							{summary.net >= 0 ? "+" : ""}₹{summary.net.toFixed(2)}
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
					<div className="flex items-center gap-2">
						<div className="bg-gray-200 rounded-full px-2 pb-1 cursor-pointer hover:bg-gray-300 transition-colors">
							←
						</div>
						<p className="text-gray-400 text-sm">0 - 10</p>
						<div className="bg-gray-200 rounded-full px-2 pb-1 cursor-pointer hover:bg-gray-300 transition-colors">
							→
						</div>
					</div>
					{/* Right */}
					<div className="flex items-center gap-2">
						<p className="text-gray-600 text-sm">Add Transaction</p>
						<button
							onClick={handleAddNew}
							className="bg-green-200 border-2 border-green-300 p-2 rounded-full flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-green-300 transition-colors"
						>
							<p className="text-2xl mb-1 font-semibold text-green-800">+</p>
						</button>
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
