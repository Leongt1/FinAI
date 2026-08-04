import { useTransactions } from "../hooks/useTransactions";
import type {
	Category,
	CreateTransactionRequest,
	Transaction,
	UpdateTransactionRequest,
} from "../types";
import { useState } from "react";
import CalendarInput from "./CalendarInput";
import CategoryDropdown from "./CategoryDropdown";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

interface TransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	categories?: Category[];
	transaction?: Transaction;
}

const TransactionModal = ({
	isOpen,
	onClose,
	categories = [],
	transaction,
}: TransactionModalProps) => {
	const isEditMode = !!transaction;
	const { createTransaction, updateTransaction, isCreating, isUpdating } =
		useTransactions();

	// form state
	const [categoryID, setCategoryID] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<"Expense" | "Income">("Expense");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [error, setError] = useState<string | null>(null);

	// sync form state during render when the modal opens or the
	// transaction changes (avoids a cascading setState-in-effect)
	const [prevSync, setPrevSync] = useState<{
		tx?: Transaction;
		open: boolean;
	}>({ open: false });
	if (prevSync.tx !== transaction || prevSync.open !== isOpen) {
		setPrevSync({ tx: transaction, open: isOpen });
		if (transaction) {
			setCategoryID(transaction.category_id);
			setAmount(transaction.amount.toString());
			setDescription(transaction.description || "");
			setType(transaction.type);
			setDate(transaction.date.split("T")[0]);
		} else {
			setCategoryID("");
			setAmount("");
			setDescription("");
			setType("Expense");
			setDate(new Date().toISOString().split("T")[0]);
		}
	}

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError(null);

		if (!categoryID) {
			setError("Please select a category");
			return;
		}

		if (!amount || parseFloat(amount) <= 0) {
			setError("Please enter a valid amount");
			return;
		}

		// optimistic: the mutation patches the cache immediately (and rolls
		// back with a toast on failure), so the modal can close right away
		if (isEditMode) {
			const input: UpdateTransactionRequest = {
				category_id: categoryID,
				amount: parseFloat(amount),
				description: description || null,
				type,
				date: new Date(date).toISOString(),
			};
			updateTransaction(transaction!.id, input);
		} else {
			const input: CreateTransactionRequest = {
				category_id: categoryID,
				amount: parseFloat(amount),
				description: description || null,
				type,
				date: new Date(date).toISOString(),
			};
			createTransaction(input);
		}
		onClose();
	};

	useBodyScrollLock(isOpen);

	if (!isOpen) return null;

	return (
		// backdrop
		<div
			className="fixed inset-0 bg-bg/70 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			{/* model */}
			<div
				className="bg-surface rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-text-muted">
						{isEditMode ? "Edit Transaction" : "New Transaction"}
					</h2>
					<button
						onClick={onClose}
						className="text-text-muted hover:text-subtle cursor-pointer px-2 py-1"
					>
						✕
					</button>
				</div>

				{/* error */}
				{error && (
					<div className="bg-expense-bg text-expense text-sm px-4 py-3 rounded-xl mb-4">
						{error}
					</div>
				)}

				{/* form */}
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					{/* type toggle */}
					<div className="flex bg-bg rounded-full p-1 h-14 border border-border">
						{["Expense", "Income"].map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setType(t as "Income" | "Expense")}
								className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
									type === t
										? t === "Expense"
											? "bg-expense-bg text-expense"
											: "bg-income-bg text-income"
										: "text-subtle hover:text-text-muted"
								}`}
							>
								{t}
							</button>
						))}
					</div>
					{/* category */}
					<CategoryDropdown
						categories={categories.filter((c) => !c.hidden)}
						value={categoryID}
						onChange={(value) => setCategoryID(value)}
						placeholder="Select category"
					/>
					{/* amount */}
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
							₹
						</span>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.00"
							min="0.01"
							step="0.01"
							required
							className="w-full border border-border rounded-xl p-3 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold"
						/>
					</div>

					{/* description */}
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Description (optional)"
						className="w-full border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold"
					/>

					{/* date */}
					<CalendarInput
						date={date}
						setDate={(date: string | null) => setDate(date!)}
					/>

					{/* submit */}
					<button
						type="submit"
						disabled={isCreating || isUpdating}
						className="w-full bg-accent text-on-accent rounded-xl p-3 font-semibold hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{isCreating || isUpdating
							? "Saving..."
							: isEditMode
								? "Save Changes"
								: "Add Transaction"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default TransactionModal;
