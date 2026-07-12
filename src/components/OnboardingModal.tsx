import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";

interface OnboardingModalProps {
	isOpen: boolean;
	onDone: () => void;
}

// First-run welcome: lets a new user record a starting balance as an Income
// transaction so the dashboard has a base to build on. Skippable.
const OnboardingModal = ({ isOpen, onDone }: OnboardingModalProps) => {
	const { createTransaction } = useTransactions();
	const { categories } = useCategories();
	const [amount, setAmount] = useState("");
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleSave = () => {
		const value = parseFloat(amount);
		if (!amount || Number.isNaN(value) || value <= 0) {
			setError("Enter an amount above zero, or skip for now");
			return;
		}
		const fallback = categories?.find((c) => !c.hidden);
		const category =
			categories?.find((c) => c.name === "Uncategorised" && !c.hidden) ?? fallback;
		if (!category) {
			setError("Categories are still loading - try again in a second");
			return;
		}
		// optimistic create; rollback + toast come from the hook on failure
		createTransaction({
			category_id: category.id,
			amount: value,
			description: "Starting balance",
			type: "Income",
			date: new Date().toISOString(),
		});
		onDone();
	};

	return (
		<div className="fixed inset-0 bg-bg/70 flex items-center justify-center z-50 p-4">
			<div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl">
				<h2 className="text-xl font-semibold text-foreground mb-2">
					Welcome to FinAI!
				</h2>
				<p className="text-sm text-text-muted mb-6">
					Start by telling us how much money you have right now. We&apos;ll
					record it as your starting balance - you can always edit or delete it
					later under Transactions.
				</p>

				{error && (
					<div className="bg-expense-bg text-expense text-sm px-4 py-3 rounded-xl mb-4">
						{error}
					</div>
				)}

				<div className="relative mb-6">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
						₹
					</span>
					<input
						autoFocus
						type="number"
						min="0.01"
						step="0.01"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSave();
						}}
						placeholder="Current balance"
						className="w-full border border-border rounded-xl p-3 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold"
					/>
				</div>

				<div className="flex gap-3">
					<button
						onClick={handleSave}
						className="flex-1 bg-accent text-accent-glow rounded-xl p-3 font-semibold hover:bg-accent-glow hover:text-accent transition-all cursor-pointer"
					>
						Set starting balance
					</button>
					<button
						onClick={onDone}
						className="px-4 rounded-xl text-text-muted border border-border hover:bg-surface-raised transition-colors cursor-pointer"
					>
						Skip
					</button>
				</div>
			</div>
		</div>
	);
};

export default OnboardingModal;
