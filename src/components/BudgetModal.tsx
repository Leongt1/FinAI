import { useState } from "react";
import { useBudgets } from "../hooks/useBudgets";
import type {
	Budget,
	BudgetKind,
	BudgetType,
	Category,
	CreateBudgetRequest,
	PeriodUnit,
	UpdateBudgetRequest,
} from "../types";
import CalendarInput from "./CalendarInput";

interface BudgetModalProps {
	isOpen: boolean;
	onClose: () => void;
	categories?: Category[];
	budget?: Budget;
}

const PERIOD_UNITS: PeriodUnit[] = ["day", "week", "month", "year"];

const BudgetModal = ({
	isOpen,
	onClose,
	categories = [],
	budget,
}: BudgetModalProps) => {
	const isEditMode = !!budget;
	const {
		createBudget,
		updateBudget,
		addCategory,
		removeCategory,
		isCreating,
		isUpdating,
	} = useBudgets();

	// form state
	const [name, setName] = useState("");
	const [type, setType] = useState<BudgetType>("overall");
	const [kind, setKind] = useState<BudgetKind>("expense");
	const [amount, setAmount] = useState("");
	const [periodUnit, setPeriodUnit] = useState<PeriodUnit>("month");
	const [periodValue, setPeriodValue] = useState("1");
	const [startDate, setStartDate] = useState(new Date().toISOString());
	const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<string[]>([]);
	const [isSyncingCategories, setIsSyncingCategories] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// sync form state during render when the modal opens or the
	// budget changes (avoids a cascading setState-in-effect)
	const [prevSync, setPrevSync] = useState<{
		b?: Budget;
		open: boolean;
	}>({ open: false });
	if (prevSync.b !== budget || prevSync.open !== isOpen) {
		setPrevSync({ b: budget, open: isOpen });
		if (budget) {
			setName(budget.name);
			setType(budget.type);
			setKind(budget.kind);
			setAmount(budget.amount.toString());
			setPeriodUnit(budget.period_unit);
			setPeriodValue(budget.period_value.toString());
			setStartDate(budget.start_date);
			setSelectedCategoryIDs(budget.category_ids ?? []);
		} else {
			setName("");
			setType("overall");
			setKind("expense");
			setAmount("");
			setPeriodUnit("month");
			setPeriodValue("1");
			setStartDate(new Date().toISOString());
			setSelectedCategoryIDs([]);
		}
		setError(null);
	}

	const toggleCategory = (id: string) => {
		setSelectedCategoryIDs((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
		);
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Please enter a budget name");
			return;
		}
		if (!amount || parseFloat(amount) <= 0) {
			setError("Please enter a valid amount");
			return;
		}
		const periodVal = parseInt(periodValue, 10);
		if (!periodVal || periodVal <= 0) {
			setError("Please enter a valid period length");
			return;
		}
		if (type === "category" && selectedCategoryIDs.length === 0) {
			setError("Please select at least one category");
			return;
		}

		if (isEditMode) {
			// sync category attachments first, then the budget fields
			try {
				setIsSyncingCategories(true);
				const existing = budget!.category_ids ?? [];
				if (type === "category") {
					const toAdd = selectedCategoryIDs.filter(
						(id) => !existing.includes(id),
					);
					const toRemove = existing.filter(
						(id) => !selectedCategoryIDs.includes(id),
					);
					await Promise.all([
						...toAdd.map((id) => addCategory(budget!.id, id)),
						...toRemove.map((id) => removeCategory(budget!.id, id)),
					]);
				}
			} catch {
				setError("Failed to update budget categories");
				return;
			} finally {
				setIsSyncingCategories(false);
			}

			const input: UpdateBudgetRequest = {
				name: name.trim(),
				type,
				amount: parseFloat(amount),
				period_unit: periodUnit,
				period_value: periodVal,
				start_date: startDate,
			};
			// optimistic patch already applied - close now, rollback+toast on error
			updateBudget(budget!.id, input);
			onClose();
		} else {
			const input: CreateBudgetRequest = {
				name: name.trim(),
				type,
				kind,
				amount: parseFloat(amount),
				period_unit: periodUnit,
				period_value: periodVal,
				start_date: startDate,
				...(type === "category" && { category_ids: selectedCategoryIDs }),
			};
			// optimistic temp card shows immediately - close now
			createBudget(input);
			onClose();
		}
	};

	if (!isOpen) return null;

	const isSaving = isCreating || isUpdating || isSyncingCategories;
	const visibleCategories = categories.filter((c) => !c.hidden);

	return (
		// backdrop
		<div
			className="fixed inset-0 bg-bg/70 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			{/* modal */}
			<div
				className="bg-surface rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-text-muted">
						{isEditMode ? "Edit Budget" : "New Budget"}
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
					{/* kind toggle - immutable after creation (backend) */}
					<div className="flex bg-bg rounded-full p-1 h-14 border border-border">
						{(["expense", "savings"] as BudgetKind[]).map((k) => (
							<button
								key={k}
								type="button"
								disabled={isEditMode}
								onClick={() => setKind(k)}
								className={`flex-1 px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
									isEditMode ? "cursor-not-allowed opacity-70" : "cursor-pointer"
								} ${
									kind === k
										? k === "expense"
											? "bg-expense-bg text-expense"
											: "bg-income-bg text-income"
										: "text-subtle hover:text-text-muted"
								}`}
							>
								{k === "expense" ? "Spending" : "Savings"}
							</button>
						))}
					</div>

					{/* name */}
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Budget name"
						required
						className="w-full border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold"
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

					{/* period */}
					<div className="flex gap-3">
						<div className="flex-1 relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle text-xs">
								every
							</span>
							<input
								type="number"
								value={periodValue}
								onChange={(e) => setPeriodValue(e.target.value)}
								min="1"
								step="1"
								required
								className="w-full border border-border rounded-xl p-3 pl-14 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold"
							/>
						</div>
						<select
							value={periodUnit}
							onChange={(e) => setPeriodUnit(e.target.value as PeriodUnit)}
							className="flex-1 border border-border rounded-xl p-3 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted font-semibold cursor-pointer"
						>
							{PERIOD_UNITS.map((u) => (
								<option key={u} value={u}>
									{parseInt(periodValue, 10) > 1 ? `${u}s` : u}
								</option>
							))}
						</select>
					</div>

					{/* start date */}
					<CalendarInput
						date={startDate}
						setDate={(date: string | null) => date && setStartDate(date)}
					/>

					{/* scope toggle */}
					<div className="flex bg-bg rounded-full p-1 h-14 border border-border">
						{(["overall", "category"] as BudgetType[]).map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setType(t)}
								className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
									type === t
										? "bg-surface-raised text-accent-glow border border-border-strong"
										: "text-subtle hover:text-text-muted"
								}`}
							>
								{t === "overall" ? "All spending" : "By category"}
							</button>
						))}
					</div>

					{/* category pills - category-scoped budgets only */}
					{type === "category" && (
						<div className="flex flex-wrap gap-2">
							{visibleCategories.map((c) => (
								<button
									key={c.id}
									type="button"
									onClick={() => toggleCategory(c.id)}
									className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors flex items-center gap-1 ${
										selectedCategoryIDs.includes(c.id)
											? "bg-surface-raised text-accent-glow font-bold border-border-strong"
											: "bg-surface text-text-muted border-border hover:border-border-strong"
									}`}
								>
									<span>{c.icon}</span>
									<span>{c.name}</span>
								</button>
							))}
						</div>
					)}

					{/* submit */}
					<button
						type="submit"
						disabled={isSaving}
						className="w-full bg-accent text-accent-glow rounded-xl p-3 font-semibold hover:bg-accent-glow hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{isSaving
							? "Saving..."
							: isEditMode
								? "Save Changes"
								: "Create Budget"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default BudgetModal;
