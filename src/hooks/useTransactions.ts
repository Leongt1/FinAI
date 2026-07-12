import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createTransaction,
	deleteTransaction,
	listTransactions,
	listTransactionsPage,
	updateTransaction,
} from "../api/transactions";
import type {
	CreateTransactionRequest,
	Transaction,
	TransactionFilter,
	UpdateTransactionRequest,
} from "../types";
import { toast } from "../store/toastStore";

// Server-side paged slice of the transactions list. Mutations still live in
// useTransactions; its invalidations on ["transactions"] cover these keys too.
export const useTransactionsPage = (
	filters: TransactionFilter | undefined,
	page: number,
	pageSize: number,
) => {
	const { data, isLoading, error, isFetching } = useQuery({
		queryKey: ["transactions", "page", filters ?? {}, page, pageSize],
		queryFn: () => listTransactionsPage(filters, pageSize, page * pageSize),
		placeholderData: keepPreviousData,
	});

	return { pageData: data, isLoading, error, isFetching };
};

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
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
			toast.success("Transaction added");
		},
		onError: () => toast.error("Couldn't add transaction - try again later"),
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
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
			toast.success("Transaction updated");
		},
		onError: () => toast.error("Couldn't update transaction - try again later"),
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
			// only touch list caches — ["transactions", id] holds a single object
			queryClient.setQueriesData<Transaction[]>(
				{ queryKey: ["transactions"] },
				(old) => (Array.isArray(old) ? old.filter((tx) => tx.id !== id) : old)
			)

			return { prevTransactions };
		},
		onSuccess: () => toast.success("Transaction deleted"),
		onError: (_err, _vars, context) => {
			context?.prevTransactions.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data)
			});
			toast.error("Couldn't delete transaction - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});

	return {
		transactions,
		isLoading,
		error,

		createTransaction: (
			input: CreateTransactionRequest,
			options?: { onSuccess?: () => void },
		) => createMutation.mutate(input, { onSuccess: options?.onSuccess }),
		updateTransaction: (
			id: string,
			input: UpdateTransactionRequest,
			options?: { onSuccess?: () => void },
		) => updateMutation.mutate({ id, input }, { onSuccess: options?.onSuccess }),
		deleteTransaction: (id: string) => deleteMutation.mutate(id),

		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,

		createError: createMutation.error,
		updateError: updateMutation.error,
		deleteError: deleteMutation.error,
	};
};
