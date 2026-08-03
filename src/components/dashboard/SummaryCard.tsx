import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

export type CardType = "balance" | "income" | "expense" | "savings";

interface SummaryCardProps {
	title: string;
	amount: string;
	change: string;
	isPositive: boolean;
	type: CardType;
}

const config: Record<CardType, { amount: string; dot: string }> = {
	balance: { amount: "text-foreground", dot: "bg-accent" },
	income:  { amount: "text-income",     dot: "bg-income" },
	expense: { amount: "text-expense",    dot: "bg-expense" },
	savings: { amount: "text-foreground", dot: "bg-accent" },
};

const SummaryCard = ({ title, amount, change, isPositive, type }: SummaryCardProps) => {
	const { amount: amountClass, dot: dotClass } = config[type];

	return (
		<div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong">
			<div className="flex items-center gap-2">
				<span className={`h-2 w-2 rounded-full ${dotClass}`} />
				<p className="text-sm text-text-muted">{title}</p>
			</div>

			<p className={`text-3xl font-semibold tracking-tight tnum ${amountClass}`}>{amount}</p>

			<p className="text-sm">
				<span
					className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
						isPositive ? "text-income bg-income-bg" : "text-expense bg-expense-bg"
					}`}
				>
					<FontAwesomeIcon
						icon={isPositive ? faCaretUp : faCaretDown}
						className="text-[0.7rem]"
						aria-hidden="true"
					/>
					{change}
				</span>
				<span className="text-text-muted"> vs last month</span>
			</p>
		</div>
	);
};

export default SummaryCard;
