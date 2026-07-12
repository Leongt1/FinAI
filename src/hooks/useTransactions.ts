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
	PaginatedTransactions,
	Transaction,
	TransactionFilter,
	UpdateTransactionRequest,
} from "../types";
import { toast } from "../store/toastStore";

// cache shapes under the ["transactions"] prefix: plain arrays (full lists)
// and paginated envelopes ({transactions, total, ...}); detail caches hold
// single objects and are left alone by the guards below
const isPageCache = (v: unknown): v is PaginatedTransactions =>
	typeof v === "object" && v !== null && Array.isArray((v as PaginatedTransactions).transactions);

const byDateDesc = (a: Transaction, b: Transaction) =>
	new Date(b.date).getTime() - new Date(a.date).getTime();

// applies an optimistic list transform to every transactions cache,
// whatever its shape, and returns the snapshots for rollback
const patchTransactionCaches = (
	queryClient: ReturnType<typeof useQueryClient>,
	transform: (list: Transaction[]) => Transaction[],
	adjustTotal: number,
) => {
	const prev = queryClient.getQueriesData({ queryKey: ["transactions"] });
	queryClient.setQueriesData({ queryKey: ["transactions"] }, (old: unknown) => {
		if (Array.isArray(old)) {
			return transform(old as Transaction[]).sort(byDateDesc);
		}
		if (isPageCache(old)) {
			return {
				...old,
				total: old.total + adjustTotal,
				transactions: transform(old.transactions)
					.sort(byDateDesc)
					.slice(0, old.limit),
			};
		}
		return old;
	});
	return prev;
};

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

	// create transaction - optimistic: a temp row appears immediately and is
	// replaced (or rolled back with a toast) when the server answers
	const createMutation = useMutation({
		mutationFn: (input: CreateTransactionRequest) => createTransaction(input),
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ["transactions"] });
			const now = new Date().toISOString();
			const temp: Transaction = {
				id: `temp-${now}-${Math.random().toString(36).slice(2)}`,
				category_id: input.category_id,
				amount: input.amount,
				description: input.description ?? null,
				type: input.type,
				date: input.date,
				created_at: now,
				updated_at: now,
			};
			const prev = patchTransactionCaches(
				queryClient,
				(list) => [temp, ...list],
				1,
			);
			return { prev };
		},
		onSuccess: () => toast.success("Transaction added"),
		onError: (_err, _vars, context) => {
			context?.prev.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			toast.error("Couldn't add transaction - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
		},
	});

	// update mutation - optimistic in-place patch
	const updateMutation = useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateTransactionRequest;
		}) => updateTransaction(id, input),
		onMutate: async ({ id, input }) => {
			await queryClient.cancelQueries({ queryKey: ["transactions"] });
			// drop absent optional fields so the spread can't overwrite with undefined
			// (an explicit null still comes through, e.g. clearing the description)
			const patch = Object.fromEntries(
				Object.entries(input).filter(([, v]) => v !== undefined),
			) as Partial<Transaction>;
			const prev = patchTransactionCaches(
				queryClient,
				(list) =>
					list.map((tx) =>
						tx.id === id
							? { ...tx, ...patch, updated_at: new Date().toISOString() }
							: tx,
					),
				0,
			);
			return { prev };
		},
		onSuccess: () => toast.success("Transaction updated"),
		onError: (_err, _vars, context) => {
			context?.prev.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			toast.error("Couldn't update transaction - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
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
