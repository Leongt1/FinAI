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
		<div className="bg-surface rounded-2xl border border-border p-6 h-full">
			<h2 className="text-lg font-semibold text-foreground mb-6">Money Flow</h2>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={monthlyData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#1e3530" vertical={false} />
					<XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7aaa96" }} axisLine={false} tickLine={false} />
					<YAxis tick={{ fontSize: 11, fill: "#7aaa96" }} axisLine={false} tickLine={false} />
					<Tooltip
						contentStyle={{ backgroundColor: "#162622", border: "1px solid #1e3530", borderRadius: "12px", color: "#dff2ea" }}
						cursor={{ fill: "#1e3530" }}
					/>
					<Legend wrapperStyle={{ fontSize: "12px", color: "#7aaa96" }} />
					<Bar
						dataKey="income"
						fill="#408A71"
						radius={[4, 4, 0, 0]}
						name="Income"
					/>
					<Bar
						dataKey="expense"
						fill="#e05c5c"
						radius={[4, 4, 0, 0]}
						name="Expense"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MoneyFlowChart;
