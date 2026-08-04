import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faWandMagicSparkles,
	faTrash,
	faXmark,
	faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "../types";
import { useAI } from "../hooks/useAI";
import { useTransactions } from "../hooks/useTransactions";
import { toast } from "../store/toastStore";
import CategoryDropdown from "./CategoryDropdown";
import {
	isRowValid,
	rowToCreateRequest,
	toReviewRows,
	type ReviewRow,
} from "../utils/bulkImport";

interface BulkImportModalProps {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
}

// paste box hard cap mirrors the backend (maxExtractChars) so we fail fast
const MAX_CHARS = 4000;
const TODAY = new Date().toISOString().split("T")[0];

const PLACEHOLDER = `Paste transactions here - bank/UPI SMS, GPay lines, or a quick list. For example:

Sent Rs.250 to Blue Tokai via UPI
Spent 1200 at DMart groceries yesterday
Salary 40000 credited
89 auto ride`;

const BulkImportModal = ({ isOpen, onClose, categories }: BulkImportModalProps) => {
	const { extractTransactions, isExtracting } = useAI();
	const { bulkCreate, isBulkCreating } = useTransactions();

	const [phase, setPhase] = useState<"input" | "review">("input");
	const [text, setText] = useState("");
	const [rows, setRows] = useState<ReviewRow[]>([]);

	const reset = () => {
		setPhase("input");
		setText("");
		setRows([]);
	};

	const handleClose = () => {
		if (isExtracting || isBulkCreating) return;
		reset();
		onClose();
	};

	const handleExtract = async () => {
		const trimmed = text.trim();
		if (!trimmed) return;
		try {
			const res = await extractTransactions({ text: trimmed });
			const reviewRows = toReviewRows(res.transactions, categories);
			if (reviewRows.length === 0) {
				toast.error("Fin couldn't find any transactions in that text");
				return;
			}
			setRows(reviewRows);
			setPhase("review");
		} catch {
			toast.error("Couldn't read that - try again in a moment");
		}
	};

	const updateRow = (index: number, patch: Partial<ReviewRow>) => {
		setRows((prev) =>
			prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
		);
	};

	const removeRow = (index: number) => {
		setRows((prev) => prev.filter((_, i) => i !== index));
	};

	const validCount = rows.filter(isRowValid).length;

	const handleConfirm = async () => {
		const invalidRows = rows.filter((r) => !isRowValid(r));
		const validRows = rows.filter(isRowValid);
		if (validRows.length === 0) return;

		const { failedIndexes } = await bulkCreate(validRows.map(rowToCreateRequest));
		const failedRows = failedIndexes.map((i) => validRows[i]);

		if (failedRows.length === 0 && invalidRows.length === 0) {
			toast.success(
				`Added ${validRows.length} transaction${validRows.length === 1 ? "" : "s"}`,
			);
			reset();
			onClose();
			return;
		}

		// keep whatever still needs attention (unfilled rows + any that failed)
		const added = validRows.length - failedRows.length;
		if (added > 0) toast.success(`Added ${added} transaction${added === 1 ? "" : "s"}`);
		if (failedRows.length > 0)
			toast.error(`${failedRows.length} couldn't be added - check and retry`);
		setRows([...invalidRows, ...failedRows]);
	};

	if (!isOpen) return null;

	const overLimit = text.length > MAX_CHARS;

	return (
		<div
			className="fixed inset-0 bg-bg/70 flex items-center justify-center z-50 p-4"
			onClick={handleClose}
		>
			<div
				className="bg-surface rounded-3xl p-6 sm:p-8 w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* header */}
				<div className="flex items-center justify-between mb-6 shrink-0">
					<div className="flex items-center gap-3">
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-on-accent">
							<FontAwesomeIcon icon={faWandMagicSparkles} />
						</span>
						<div>
							<h2 className="text-xl font-semibold text-foreground">
								Import transactions
							</h2>
							<p className="text-xs text-text-muted">
								{phase === "input"
									? "Paste text and Fin will pull out the transactions"
									: "Review and fix, then add them all"}
							</p>
						</div>
					</div>
					<button
						onClick={handleClose}
						aria-label="Close"
						className="text-text-muted hover:text-foreground cursor-pointer px-2 py-1"
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>

				{phase === "input" ? (
					<div className="flex flex-col gap-3 min-h-0">
						<textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={PLACEHOLDER}
							rows={10}
							className="w-full resize-none rounded-2xl border border-border bg-bg p-4 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
						/>
						<div className="flex items-center justify-between gap-3">
							<span
								className={`text-xs ${overLimit ? "text-expense" : "text-subtle"}`}
							>
								{text.length}/{MAX_CHARS} characters
							</span>
							<button
								onClick={handleExtract}
								disabled={!text.trim() || overLimit || isExtracting}
								className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-semibold text-on-accent transition-all hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								<FontAwesomeIcon icon={faWandMagicSparkles} />
								{isExtracting ? "Reading…" : "Extract transactions"}
							</button>
						</div>
						<p className="text-xs text-text-muted">
							This uses 1 AI credit, however many transactions come out. Nothing
							is saved until you confirm.
						</p>
					</div>
				) : (
					<>
						{/* review table */}
						<div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-border">
							<table className="w-full min-w-[720px]">
								<thead className="sticky top-0 bg-surface-raised">
									<tr className="border-b border-border">
										{["Date", "Category", "Description", "Type", "Amount", ""].map(
											(h) => (
												<th
													key={h}
													className="text-left text-xs font-medium text-subtle uppercase p-3"
												>
													{h}
												</th>
											),
										)}
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{rows.map((row, i) => {
										const needsCategory = row.categoryId === "";
										const badAmount = !(Number(row.amount) > 0);
										return (
											<tr key={i} className="align-top">
												<td className="p-2">
													<input
														type="date"
														value={row.date}
														max={TODAY}
														onChange={(e) => updateRow(i, { date: e.target.value })}
														className="rounded-lg border border-border bg-bg p-2 text-sm text-foreground focus:outline-none focus:border-accent"
													/>
												</td>
												<td className="p-2">
													<div
														className={
															needsCategory ? "rounded-full ring-2 ring-expense" : ""
														}
													>
														<CategoryDropdown
															categories={categories.filter((c) => !c.hidden)}
															value={row.categoryId}
															onChange={(value) => updateRow(i, { categoryId: value })}
															placeholder="Pick category"
															menuInPortal
														/>
													</div>
												</td>
												<td className="p-2">
													<input
														type="text"
														value={row.description}
														onChange={(e) =>
															updateRow(i, { description: e.target.value })
														}
														placeholder="Note"
														className="w-full min-w-32 rounded-lg border border-border bg-bg p-2 text-sm text-foreground focus:outline-none focus:border-accent"
													/>
												</td>
												<td className="p-2">
													<select
														value={row.type}
														onChange={(e) =>
															updateRow(i, {
																type: e.target.value as ReviewRow["type"],
															})
														}
														className="rounded-lg border border-border bg-bg p-2 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
													>
														<option value="Expense">Expense</option>
														<option value="Income">Income</option>
													</select>
												</td>
												<td className="p-2">
													<div className="relative">
														<span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-sm">
															₹
														</span>
														<input
															type="number"
															value={row.amount}
															min="0.01"
															step="0.01"
															onChange={(e) =>
																updateRow(i, { amount: e.target.value })
															}
															className={`w-28 rounded-lg border bg-bg p-2 pl-6 text-sm text-foreground focus:outline-none focus:border-accent ${
																badAmount ? "border-expense" : "border-border"
															}`}
														/>
													</div>
												</td>
												<td className="p-2">
													<button
														onClick={() => removeRow(i)}
														aria-label="Remove row"
														className="text-text-muted hover:text-expense hover:bg-expense-bg rounded-lg p-2 transition-colors cursor-pointer"
													>
														<FontAwesomeIcon icon={faTrash} />
													</button>
												</td>
											</tr>
										);
									})}
									{rows.length === 0 && (
										<tr>
											<td
												colSpan={6}
												className="p-6 text-center text-sm text-text-muted"
											>
												Nothing left to import.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* footer */}
						<div className="mt-4 flex items-center justify-between gap-3 shrink-0">
							<button
								onClick={() => setPhase("input")}
								disabled={isBulkCreating}
								className="flex items-center gap-2 text-sm text-text-muted hover:text-foreground disabled:opacity-50 cursor-pointer"
							>
								<FontAwesomeIcon icon={faArrowLeft} /> Back
							</button>
							<div className="flex items-center gap-3">
								<span className="text-sm text-text-muted">
									{validCount} of {rows.length} ready
								</span>
								<button
									onClick={handleConfirm}
									disabled={validCount === 0 || isBulkCreating}
									className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-on-accent transition-all hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
								>
									{isBulkCreating
										? "Adding…"
										: `Add ${validCount} transaction${validCount === 1 ? "" : "s"}`}
								</button>
							</div>
						</div>
						{validCount < rows.length && (
							<p className="mt-2 text-xs text-expense shrink-0">
								Rows missing a category or amount are highlighted - fix or remove
								them to include them.
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default BulkImportModal;
