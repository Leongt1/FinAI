import type {
	CreateTransactionRequest,
	PaginatedTransactions,
	Transaction,
	TransactionFilter,
	UpdateTransactionRequest,
} from "../types";
import api from "./axios";

export const listTransactions = async (
	filters?: TransactionFilter,
): Promise<Transaction[]> => {
	const { data } = await api.get<Transaction[]>("/transactions/", {
		params: filters,
	});
	return data;
};

export const listTransactionsPage = async (
	filters: TransactionFilter | undefined,
	limit: number,
	offset: number,
): Promise<PaginatedTransactions> => {
	const { data } = await api.get<PaginatedTransactions>("/transactions/", {
		params: { ...filters, limit, offset },
	});
	return data;
};

export const createTransaction = async (
	input: CreateTransactionRequest,
): Promise<void> => {
	// one key per create: the backend replays the first response if the same
	// request is retried (double click, network retry, post-refresh retry)
	await api.post("/transactions/", input, {
		headers: { "Idempotency-Key": crypto.randomUUID() },
	});
};

// Bulk import commit: create many transactions from the reviewed list. Each
// row is an independent create (its own idempotency key), so a bad row fails on
// its own without dropping the others. Returns the indexes that failed so the
// UI can keep those rows for the user to fix and retry.
export const createTransactions = async (
	inputs: CreateTransactionRequest[],
): Promise<{ failedIndexes: number[] }> => {
	const results = await Promise.allSettled(
		inputs.map((input) => createTransaction(input)),
	);
	const failedIndexes = results.flatMap((r, idx) =>
		r.status === "rejected" ? [idx] : [],
	);
	return { failedIndexes };
};

export const getTransactionByID = async (id: string): Promise<Transaction> => {
	const { data } = await api.get<Transaction>(`/transactions/${id}`);
	return data;
};

export const updateTransaction = async (
	id: string,
	input: UpdateTransactionRequest,
): Promise<Transaction> => {
	const { data } = await api.patch<Transaction>(`/transactions/${id}`, input);
	return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
	await api.delete(`/transactions/${id}`);
};
