import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createTransaction,
	deleteTransaction,
	listTransactions,
	updateTransaction,
} from "../api/transactions";
import type {
	CreateTransactionRequest,
	Transaction,
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
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["transactions"] });

			const prevTransactions = 
				queryClient.getQueriesData<Transaction[]>({ 
					queryKey: ["transactions"] 
			});
			queryClient.setQueriesData<Transaction[]>(
				{ queryKey: ["transactions"] }, 
				(old = []) => old.filter((tx) => tx.id !== id)
			)

			return { prevTransactions };
		},
		onError: (_err, _vars, context) => {
			context?.prevTransactions.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data)
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	return {
		transactions,
		isLoading,
		error,

		createTransaction: (
			input: CreateTransactionRequest,
			options?: { onSuccess?: () => void },
		) => createMutation.mutate(input, { 
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["transactions"] });
				queryClient.invalidateQueries({ queryKey: ["categories"] });
				options?.onSuccess?.();
			} ,
		}),
		updateTransaction: (
			id: string,
			input: UpdateTransactionRequest,
			options?: { onSuccess?: () => void },
		) =>
			updateMutation.mutate({ id, input }, { 
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["transactions"] });
					queryClient.invalidateQueries({ queryKey: ["categories"] });
					options?.onSuccess?.();
				},
			 }),
		deleteTransaction: (id: string) => deleteMutation.mutate(id),

		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,

		createError: createMutation.error,
		updateError: updateMutation.error,
		deleteError: deleteMutation.error,
	};
};
