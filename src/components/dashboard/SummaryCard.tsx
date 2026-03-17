interface SummaryCardProps {
	title: string;
	amount: string;
	change: string;
	isPositive: boolean;
	bg: string;
	text: string;
	border: string;
}

const SummaryCard = ({
	title,
	amount,
	change,
	isPositive,
	bg,
	text,
	border,
}: SummaryCardProps) => {
	return (
		<div className={`${bg} ${border} border rounded-2xl p-5`}>
			<p className="text-sm text-gray-500 mb-1">{title}</p>
			<p className={`text-2xl font-bold ${text}`}>{amount}</p>
			<p
				className={`text-sm mt-2 font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
			>
				{change} vs last month
			</p>
		</div>
	);
};

export default SummaryCard;
