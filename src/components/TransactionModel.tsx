import { useTransactions } from "../hooks/useTransactions";
import type {
	Category,
	CreateTransactionRequest,
	Transaction,
	UpdateTransactionRequest,
} from "../types";
import CategoryDropdown from "./CategoryDropDown";
import { useEffect, useState } from "react";
import CalenderInput from "./CalenderInput";

interface TransactionModelProps {
	isOpen: boolean;
	onClose: () => void;
	categories?: Category[];
	transaction?: Transaction;
}

const TransactionModel = ({
	isOpen,
	onClose,
	categories = [],
	transaction,
}: TransactionModelProps) => {
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

	useEffect(() => {
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
	}, [transaction, isOpen]);

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

		if (isEditMode) {
			const input: UpdateTransactionRequest = {
				category_id: categoryID,
				amount: parseFloat(amount),
				description: description || null,
				type,
				date: new Date(date).toISOString(),
			};
			updateTransaction({ id: transaction!.id, input });
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

	if (!isOpen) return null;

	return (
		// backdrop
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			onClick={onClose}
		>
			{/* model */}
			<div
				className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
						{isEditMode ? "Edit Transaction" : "New Transaction"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 cursor-pointer px-2 py-1"
					>
						✕
					</button>
				</div>

				{/* error */}
				{error && (
					<div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
						{error}
					</div>
				)}

				{/* form */}
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					{/* type toggle */}
					<div className="flex bg-gray-100 rounded-full p-1 h-14">
						{["Expense", "Income"].map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setType(t as "Income" | "Expense")}
								className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
									type === t
										? t === "Expense"
											? "bg-red-200 text-red-800"
											: "bg-green-200 text-green-800"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								{t}
							</button>
						))}
					</div>
					{/* category */}
					<CategoryDropdown
						categories={categories!?.filter((c) => !c.hidden)}
						value={categoryID}
						onChange={(value) => setCategoryID(value)}
						placeholder="Select category"
					/>
					{/* amount */}
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
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
							className="w-full border border-gray-200 rounded-xl p-3 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>

					{/* description */}
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Description (optional)"
						className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
					/>

					{/* date */}
					<CalenderInput
						date={date}
						setDate={(date: string | null) => setDate(date!)}
					/>

					{/* submit */}
					<button
						type="submit"
						disabled={isCreating || isUpdating}
						className="w-full bg-green-500 text-white rounded-xl p-3 font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

export default TransactionModel;
