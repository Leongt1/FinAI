export const summaryCards = [
	{
		title: "Total Balance",
		amount: "$15,700",
		change: "+8.8%",
		isPositive: true,
		bg: "bg-green-50",
		text: "text-green-600",
		border: "border-green-100",
	},
	{
		title: "Total Income",
		amount: "$8,500",
		change: "+5.2%",
		isPositive: true,
		bg: "bg-blue-50",
		text: "text-blue-600",
		border: "border-blue-100",
	},
	{
		title: "Total Expenses",
		amount: "$6,222",
		change: "-10.2%",
		isPositive: false,
		bg: "bg-red-50",
		text: "text-red-600",
		border: "border-red-100",
	},
	{
		title: "Total Savings",
		amount: "$32,913",
		change: "+16.4%",
		isPositive: true,
		bg: "bg-purple-50",
		text: "text-purple-600",
		border: "border-purple-100",
	},
];

export const monthlyData = [
	{ month: "Jan", income: 3000, expense: 2100 },
	{ month: "Feb", income: 3000, expense: 1800 },
	{ month: "Mar", income: 3500, expense: 2400 },
	{ month: "Apr", income: 3000, expense: 2000 },
	{ month: "May", income: 3200, expense: 2800 },
	{ month: "Jun", income: 3000, expense: 1900 },
];

export const budgetData = [
	{ category: "Food & Drink", spent: 450, limit: 600, color: "bg-green-400" },
	{ category: "Entertainment", spent: 120, limit: 150, color: "bg-blue-400" },
	{ category: "Transport", spent: 89, limit: 200, color: "bg-purple-400" },
	{ category: "Shopping", spent: 340, limit: 300, color: "bg-red-400" },
];

export const recentTransactions = [
	{
		id: "1",
		name: "Netflix",
		category: "Entertainment",
		amount: -15.99,
		date: "2024-01-15",
	},
	{
		id: "2",
		name: "Salary",
		category: "Income",
		amount: 3000,
		date: "2024-01-14",
	},
	{
		id: "3",
		name: "Groceries",
		category: "Food",
		amount: -85.5,
		date: "2024-01-13",
	},
	{
		id: "4",
		name: "Spotify",
		category: "Entertainment",
		amount: -9.99,
		date: "2024-01-12",
	},
	{
		id: "5",
		name: "Freelance",
		category: "Income",
		amount: 500,
		date: "2024-01-11",
	},
];
