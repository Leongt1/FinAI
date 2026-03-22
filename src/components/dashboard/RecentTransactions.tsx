import { useNavigate } from "react-router-dom";
import { recentTransactions } from "../../data/dashboardData";

const RecentTransactions = () => {
	const navigate = useNavigate();

	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-semibold text-gray-900">
					Recent Transactions
				</h2>
				<button
					onClick={() => navigate("/transactions")}
					className="text-sm text-gray-400 border-1 border-gray-300 px-2 py-1 rounded-md hover:text-gray-600 hover:border-gray-400 font-medium cursor-pointer transition-colors"
				>
					View all
				</button>
			</div>
			<table className="w-full">
				<thead>
					<tr className="border-b border-gray-100">
						<th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">
							Name
						</th>
						<th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">
							Category
						</th>
						<th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">
							Date
						</th>
						<th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">
							Amount
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-50">
					{recentTransactions.map((tx) => (
						<tr key={tx.id} className="hover:bg-gray-50 transition-colors py-1">
							<td className="py-3 text-sm font-medium text-gray-900">
								{tx.name}
							</td>
							<td className="py-3 text-sm text-gray-500">{tx.category}</td>
							<td className="py-3 text-sm text-gray-500">
								{new Date(tx.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</td>
							<td
								className={`py-3 text-sm font-semibold text-right ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}
							>
								{tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RecentTransactions;
