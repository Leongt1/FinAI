import { useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useTransactions } from "../../hooks/useTransactions";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type PieData = {name: string, amount: number, icon: string, fill: string}

const getMonthRange = (year: number, month: number) => {
	const from = new Date(year, month, 1);
	const to = new Date(year, month + 1, 0);
	return {
		date_from: from.toISOString(),
		date_to: to.toISOString(),
	};
};

const COLORS = ["#408A71", "#5DCAA5", "#e05c5c", "#EF9F27", "#7F77DD", "#D85A30", "#378ADD", "#D4537E"]

const SpendingBreakdown = () => {
    const now = new Date()
    const currMonth = now.toLocaleDateString("en-US", {
        month: "long"
    })
    const { categories } = useCategories();
    const { transactions } = useTransactions({
        type: "Expense",
        ...getMonthRange(now.getFullYear(), now.getMonth())
    });


    const breakdownData = useMemo(() => {
        const map: Record<string, PieData> = {}

        transactions?.forEach((tx) => {
            const category = categories?.find((c) => c.id == tx.category_id)
            if (!category) return

            if (!map[tx.category_id]) {
                map[tx.category_id] = {
                    name: category.name,
                    icon: category.icon ?? "",
                    amount: 0,
                    fill: COLORS[Object.keys(map).length % COLORS.length]
                }
            }
            map[tx.category_id].amount += tx.amount
        })

        return Object.values(map).sort((a, b) => b.amount - a.amount)
    }, [transactions, categories])

    return (
        <div className="bg-surface rounded-2xl border border-border p-6 h-full">
            <h2 className="text-lg font-semibold text-foreground mb-4">
                Spending Breakdown <span className="text-subtle">({currMonth})</span>
            </h2>
            <div className="flex flex-col gap-4">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={breakdownData}
                            dataKey="amount"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={85}
                        >
                            {breakdownData.map((item) => (
                                <Cell key={item.name} fill={item.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#162622", border: "1px solid #1e3530", borderRadius: "12px", color: "#dff2ea" }}
                            cursor={{ fill: "#1e3530" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-2">
            {breakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: item.fill }} />
                        <span className="text-sm text-text-muted">{item.icon} {item.name}</span>
                    </div>
                    <span className="text-sm text-text-muted">₹{item.amount.toFixed(0)}</span>
                </div>
            ))}
        </div>
            </div>
        </div>
    );
};

export default SpendingBreakdown;
