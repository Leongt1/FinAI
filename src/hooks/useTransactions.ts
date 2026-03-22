import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createTransaction,
	deleteTransaction,
	getTransactionByID,
	listTransactions,
	updateTransaction,
} from "../api/transactions";
import type {
	CreateTransactionRequest,
	TransactionFilter,
	UpdateTransactionRequest,
} from "../types";

export const useTransactions = (filters?: TransactionFilter) => {
	const queryClient = useQueryClient();

	// get all transactions - with filters
	const {
		data: transactions,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["transactions", filters ?? {}],
		queryFn: () => listTransactions(filters),
	});

	// create transaction
	const createMutation = useMutation({
		mutationFn: (input: CreateTransactionRequest) => createTransaction(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// update mutation
	const updateMutation = useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateTransactionRequest;
		}) => updateTransaction(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// delete mutation
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTransaction(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	return {
		transactions,
		isLoading,
		error,

		createTransaction: (input: CreateTransactionRequest) =>
			createMutation.mutate(input),
		updateTransaction: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateTransactionRequest;
		}) => updateMutation.mutate({ id, input }),
		deleteTransaction: (id: string) => deleteMutation.mutate(id),

		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,

		createError: createMutation.error,
		updateError: updateMutation.error,
		deleteError: deleteMutation.error,
	};
};

export const useTransaction = (id: string) => {
	// get transaction by id
	const {
		data: transaction,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["transactions", id],
		queryFn: () => getTransactionByID(id!),
		enabled: !!id,
	});

	return {
		transaction,
		isLoading,
		error,
	};
};
