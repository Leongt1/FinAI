import { useNavigate } from "react-router-dom";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";

const RecentTransactions = () => {
	const navigate = useNavigate();
	const { transactions, isLoading } = useTransactions();
	const { categories } = useCategories();

	const recent = transactions?.slice(0, 5);

	return (
		<div className="bg-surface rounded-2xl border border-border p-6 mt-4">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-semibold text-foreground">
					Recent Transactions
				</h2>
				<button
					onClick={() => navigate("/transactions")}
					className="text-sm text-text-muted border border-border px-2 py-1 rounded-md hover:text-accent-glow hover:border-border-strong font-medium cursor-pointer transition-all"
				>
					View all
				</button>
			</div>
			<div className="overflow-x-auto">
			<table className="w-full min-w-[480px]">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left text-xs font-medium text-subtle uppercase pb-3">
							Description
						</th>
						<th className="text-left text-xs font-medium text-subtle uppercase pb-3">
							Category
						</th>
						<th className="text-left text-xs font-medium text-subtle uppercase pb-3">
							Date
						</th>
						<th className="text-right text-xs font-medium text-subtle uppercase pb-3">
							Amount
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{isLoading && (
						<tr>
							<td colSpan={6} className="text-center py-8">
								<div className="py-4 text-center text-sm text-subtle">
									Loading...
								</div>
							</td>
						</tr>
					)}
					{!isLoading && recent?.length === 0 && (
						<tr>
							<td colSpan={6} className="text-center py-8">
								<div className="py-4 text-center text-sm text-subtle">
									No transactions found
								</div>
							</td>
						</tr>
					)}
					{recent?.map((tx) => {
						const category = categories?.find((c) => c.id === tx.category_id);
						return (
							<tr
								key={tx.id}
								className="hover:bg-surface-raised transition-colors py-1"
							>
								<td className="py-3 text-sm font-medium text-foreground">
									{tx.description ?? "-"}
								</td>
								<td className="py-3 text-sm text-text-muted">
									{category?.icon} {category?.name ?? "Unknown"}
								</td>
								<td className="py-3 text-sm text-text-muted">
									{new Date(tx.date).toLocaleDateString("en-IN", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</td>
								<td
									className={`py-3 text-sm font-semibold text-right ${
										tx.type === "Income" ? "text-income" : "text-expense"
									}`}
								>
									{tx.type === "Income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			</div>
		</div>
	);
};

export default RecentTransactions;
