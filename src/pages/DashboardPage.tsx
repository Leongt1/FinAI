import BudgetOverview from "../components/dashboard/BudgetOverview";
import DashboardLayout from "../components/DashboardLayout";
import MoneyFlowChart from "../components/dashboard/MoneyFlowChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SummaryCard from "../components/dashboard/SummaryCard";
import { summaryCards } from "../data/dashboardData";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
	const currentUser = useAuthStore((s) => s.user);
	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<DashboardLayout>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">
					Welcome back, {currentUser?.name}!
				</h1>
				<p className="text-gray-500 text-sm mt-1">{today}</p>
			</div>
			{/* Summary Cards */}
			<div className="grid grid-cols-4 gap-4 mb-8">
				{summaryCards.map((card) => (
					<SummaryCard key={card.title} {...card} />
				))}
			</div>
			{/* Middle: charts and budgets */}
			<div className="grid grid-cols-3 gap-4 mb-4 items-stretch">
				{/* 2/3 width occupied */}
				<div className="col-span-2 h-full">
					{/* Money Flow Chart */}
					<MoneyFlowChart />
				</div>
				{/* 1/3 width occupied */}
				<div className="col-span-1 h-full">
					{/* Budget Overview */}
					<BudgetOverview />
				</div>
			</div>
			{/* Recent Transactions */}
			<RecentTransactions />
		</DashboardLayout>
	);
};

export default DashboardPage;
