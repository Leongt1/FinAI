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
import { useThemeColors } from "../../hooks/useThemeColors";
import { useMemo } from "react";

const MoneyFlowChart = () => {
	const { transactions } = useTransactions();
	const colors = useThemeColors();

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

	if (transactions && monthlyData.length === 0) {
		return (
			<div className="bg-surface rounded-2xl border border-border p-6 h-full">
				<h2 className="text-lg font-semibold text-foreground mb-6">Money Flow</h2>
				<div className="h-[300px] flex flex-col items-center justify-center gap-2 text-center">
					<p className="text-text-muted text-sm">No transactions yet.</p>
					<p className="text-subtle text-sm">
						Add your first income or expense and your monthly money flow will
						show up here.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-surface rounded-2xl border border-border p-6 h-full">
			<h2 className="text-lg font-semibold text-foreground mb-6">Money Flow</h2>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={monthlyData}>
					<CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
					<XAxis dataKey="month" tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} />
					<YAxis tick={{ fontSize: 11, fill: colors.textMuted }} axisLine={false} tickLine={false} />
					<Tooltip
						contentStyle={{ backgroundColor: colors.surfaceRaised, border: `1px solid ${colors.border}`, borderRadius: "12px", color: colors.foreground }}
						cursor={{ fill: colors.border }}
					/>
					<Legend wrapperStyle={{ fontSize: "12px", color: colors.textMuted }} />
					<Bar
						dataKey="income"
						fill={colors.income}
						radius={[4, 4, 0, 0]}
						name="Income"
					/>
					<Bar
						dataKey="expense"
						fill={colors.expense}
						radius={[4, 4, 0, 0]}
						name="Expense"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MoneyFlowChart;
