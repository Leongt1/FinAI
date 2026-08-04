import type {
	Category,
	CreateTransactionRequest,
	ExtractedTransaction,
	TransactionType,
} from "../types";

// One editable row in the bulk-import review table. Fields are strings where the
// user types freely (amount/date), resolved to a real request only on commit.
export interface ReviewRow {
	amount: string;
	type: TransactionType;
	categoryId: string; // "" when the suggested category didn't match one of theirs
	date: string; // YYYY-MM-DD
	description: string;
}

// Match a suggested category name to one the user already has (case-insensitive).
const resolveCategoryId = (name: string, categories: Category[]): string => {
	const target = name.trim().toLowerCase();
	if (!target) return "";
	const match = categories.find(
		(c) => !c.hidden && c.name.toLowerCase() === target,
	);
	return match?.id ?? "";
};

// Turn the AI's candidates into editable rows, resolving categories to the
// user's own ids where possible (unmatched rows are left for the user to pick).
export const toReviewRows = (
	extracted: ExtractedTransaction[],
	categories: Category[],
): ReviewRow[] =>
	extracted.map((t) => ({
		amount: String(t.amount),
		type: t.kind,
		categoryId: resolveCategoryId(t.category, categories),
		date: t.date,
		description: t.description,
	}));

// A row is committable once it has a category, a positive amount and a date.
export const isRowValid = (row: ReviewRow): boolean =>
	row.categoryId !== "" && Number(row.amount) > 0 && row.date !== "";

export const rowToCreateRequest = (row: ReviewRow): CreateTransactionRequest => ({
	category_id: row.categoryId,
	amount: Number(row.amount),
	description: row.description.trim() || null,
	type: row.type,
	date: new Date(row.date).toISOString(),
});
