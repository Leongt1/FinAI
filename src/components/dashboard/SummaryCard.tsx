export type CardType = "balance" | "income" | "expense" | "savings";

interface SummaryCardProps {
	title: string;
	amount: string;
	change: string;
	isPositive: boolean;
	type: CardType;
}

const config: Record<CardType, { amount: string; bar: string }> = {
  balance: { amount: "text-accent-glow", bar: "bg-accent"       },
  income:  { amount: "text-income",      bar: "bg-income"        },
  expense: { amount: "text-expense",     bar: "bg-expense"       },
  savings: { amount: "text-accent-glow", bar: "bg-accent-dim"    },
};

const SummaryCard = ({
	title,
	amount,
	change,
	isPositive,
	type
}: SummaryCardProps) => {
	const { amount: amountClass, bar: barClass } = config[type];

	return (
		<div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
			{/* top accent bar */}
      		<div className={`absolute top-0 left-0 right-0 h-0.5 ${barClass}`} />

			<p className="text-sm text-muted">{title}</p>
			<p className={`text-2xl font-bold ${amountClass}`}>{amount}</p>
			<p
				className={`text-sm font-medium ${isPositive ? "text-income" : "text-expense"}`}
			>
				{change} vs last month
			</p>
		</div>
	);
};

export default SummaryCard;
