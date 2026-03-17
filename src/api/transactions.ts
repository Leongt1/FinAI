import type {
	CreateTransactionRequest,
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

export const createTransaction = async (
	input: CreateTransactionRequest,
): Promise<void> => {
	await api.post("/transactions/", input);
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
