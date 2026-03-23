import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
// import { monthlyData } from "../../data/dashboardData";
import { useTransactions } from "../../hooks/useTransactions";
import { useMemo } from "react";

const MoneyFlowChart = () => {
	const { transactions } = useTransactions();

	const monthlyData = useMemo(() => {
		if (!transactions) return [];

		// group transactions by month
		const map: Record<string, { income: number; expense: number }> = {};

		transactions.forEach((tx) => {
			const month = new Date(tx.date).toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});

			if (!map[month]) {
				map[month] = { income: 0, expense: 0 };
			}

			if (tx.type === "Income") {
				map[month].income += tx.amount;
			} else {
				map[month].expense += tx.amount;
			}
		});

		return Object.entries(map)
			.map(([month, values]) => ({
				month,
				income: values.income,
				expense: values.expense,
			}))
			.sort((a, b) => {
				return new Date(a.month).getTime() - new Date(b.month).getTime();
			});
	}, [transactions]);

	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-6 h-full">
			<h2 className="text-lg font-semibold text-gray-900 mb-6">Money Flow</h2>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={monthlyData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
					<XAxis dataKey="month" tick={{ fontSize: 12 }} />
					<YAxis tick={{ fontSize: 12 }} />
					<Tooltip />
					<Legend />
					<Bar
						dataKey="income"
						fill="#41de70ff"
						radius={[4, 4, 0, 0]}
						name="Income"
					/>
					<Bar
						dataKey="expense"
						fill="#e85f5fff"
						radius={[4, 4, 0, 0]}
						name="Expense"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MoneyFlowChart;
