import DashboardLayout from "../components/DashboardLayout";
import MoneyFlowChart from "../components/dashboard/MoneyFlowChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SummaryCard from "../components/dashboard/SummaryCard";
import { useAuthStore } from "../store/authStore";
import { useTransactions } from "../hooks/useTransactions";
import { useMemo } from "react";
import SpendingBreakdown from "../components/dashboard/SpendingBreakdown";

const DashboardPage = () => {
	const currentUser = useAuthStore((s) => s.user);
	const { transactions } = useTransactions()
	
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const stats = useMemo(() => {
		if (!transactions) return null;

		const now = new Date();
		const thisMonth = now.getMonth();
		const thisYear = now.getFullYear();

		const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
		const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

		const isCurrent = (d: Date) => d.getMonth() === thisMonth && d.getFullYear() === thisYear;
		const isPrev = (d: Date) => d.getMonth() === prevMonth && d.getFullYear() === prevYear;

		let currIncome = 0, currExpense = 0;
		let prevIncome = 0, prevExpense = 0;
		let allTimeIncome = 0, allTimeExpense = 0;

		for (const tx of transactions) {
			const d = new Date(tx.date);
			if (tx.type === "Income") {
				allTimeIncome += tx.amount
				if (isCurrent(d)) currIncome += tx.amount
				if (isPrev(d)) prevIncome += tx.amount
			} else {
				allTimeExpense += tx.amount
				if (isCurrent(d)) currExpense += tx.amount
				if (isPrev(d)) prevExpense += tx.amount
			}
		}

		const currBalance = currIncome - currExpense;
		const prevBalance = prevIncome - prevExpense;
		const allTimeNet = allTimeIncome - allTimeExpense;

		const pctChange = (curr: number, prev: number) => {
			if (prev === 0) return curr > 0 ? "+100%" : "0%"
			const diff = ((curr - prev) / Math.abs(prev)) * 100;
            return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
		};

		return {
        	balance:  { amount: currBalance,  change: pctChange(currBalance, prevBalance),   isPositive: currBalance  >= prevBalance  },
            income:   { amount: currIncome,   change: pctChange(currIncome,  prevIncome),    isPositive: currIncome   >= prevIncome   },
            expense:  { amount: currExpense,  change: pctChange(currExpense, prevExpense),   isPositive: currExpense  <= prevExpense  },
            savings:  { amount: allTimeNet,   change: pctChange(allTimeNet,  allTimeNet - currBalance), isPositive: currBalance >= 0 },
        };

	}, [transactions]);

	const fmt = (n: number) => "₹" + Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

	return (
		<DashboardLayout>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-foreground">
					<span className="font-light">Welcome back,</span><span className="text-accent-glow">{currentUser?.name}</span>!
				</h1>
				<p className="text-text-muted text-sm mt-1">{today}</p>
			</div>
			{/* Summary Cards */}
			<div className="grid grid-cols-4 gap-4 mb-8">
				<SummaryCard title="This month balance" type="balance"
                    amount={stats ? fmt(stats.balance.amount) : "—"}
                    change={stats?.balance.change ?? "..."}
                    isPositive={stats?.balance.isPositive ?? true} />
                <SummaryCard title="This month income" type="income"
                    amount={stats ? fmt(stats.income.amount) : "—"}
                    change={stats?.income.change ?? "..."}
                    isPositive={stats?.income.isPositive ?? true} />
                <SummaryCard title="This month expenses" type="expense"
                    amount={stats ? fmt(stats.expense.amount) : "—"}
                    change={stats?.expense.change ?? "..."}
                    isPositive={stats?.expense.isPositive ?? true} />
                <SummaryCard title="All-time savings" type="savings"
                    amount={stats ? fmt(stats.savings.amount) : "—"}
                    change={stats?.savings.change ?? "..."}
                    isPositive={stats?.savings.isPositive ?? true} />
			</div>
			{/* Middle: charts and budgets */}
			<div className="grid grid-cols-3 gap-4 mb-4 items-stretch">
				{/* 2/3 width occupied */}
				<div className="col-span-2 h-full">{/* Money Flow Chart */}<MoneyFlowChart /></div>
				{/* 1/3 width occupied */}
				<div className="col-span-1 h-full"><SpendingBreakdown /></div>
			</div>
			{/* Recent Transactions */}
			<RecentTransactions />
		</DashboardLayout>
	);
};

export default DashboardPage;
