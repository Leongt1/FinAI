import {
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	addCategoryToBudget,
	createBudget,
	deleteBudget,
	getBudgetStatus,
	listBudgets,
	removeCategoryFromBudget,
	updateBudget,
} from "../api/budgets";
import type {
	Budget,
	BudgetStatus,
	CreateBudgetRequest,
	UpdateBudgetRequest,
} from "../types";
import { toast } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";

export const useBudgets = () => {
	const queryClient = useQueryClient();

	// all budgets
	const {
		data: budgets,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["budgets"],
		queryFn: listBudgets,
	});

	// live status per budget (progress %, spent, healthy/warning/exceeded/achieved).
	// optimistic temp budgets have no server id yet - no status to fetch.
	const statusResults = useQueries({
		queries: (budgets ?? [])
			.filter((b) => !b.id.startsWith("temp-"))
			.map((b) => ({
				queryKey: ["budgets", b.id, "status"],
				queryFn: () => getBudgetStatus(b.id),
			})),
	});

	const statuses: Record<string, BudgetStatus> = {};
	statusResults.forEach((result) => {
		if (result.data) statuses[result.data.budget_id] = result.data;
	});

	const invalidateBudgets = () =>
		queryClient.invalidateQueries({ queryKey: ["budgets"] });

	// snapshot + optimistic transform of the budgets list cache only
	// (status caches are keyed ["budgets", id, "status"], so restrict to exact key)
	const patchBudgetList = async (transform: (old: Budget[]) => Budget[]) => {
		await queryClient.cancelQueries({ queryKey: ["budgets"], exact: true });
		const prevBudgets = queryClient.getQueryData<Budget[]>(["budgets"]);
		queryClient.setQueryData(["budgets"], (old: Budget[] = []) => transform(old));
		return { prevBudgets };
	};

	const rollbackBudgets = (context?: { prevBudgets?: Budget[] }) =>
		queryClient.setQueryData(["budgets"], context?.prevBudgets);

	// create budget - optimistic temp card until the server answers
	const createMutation = useMutation({
		mutationFn: (input: CreateBudgetRequest) => createBudget(input),
		onMutate: async (input) => {
			const now = new Date().toISOString();
			const temp: Budget = {
				id: `temp-${Date.now()}`,
				user_id: useAuthStore.getState().user?.id ?? "",
				name: input.name,
				type: input.type,
				kind: input.kind,
				amount: input.amount,
				period_unit: input.period_unit,
				period_value: input.period_value,
				start_date: input.start_date,
				created_at: now,
				updated_at: now,
				category_ids: input.category_ids,
			};
			return patchBudgetList((old) => [...old, temp]);
		},
		onSuccess: () => toast.success("Budget created"),
		onError: (_err, _vars, context) => {
			rollbackBudgets(context);
			toast.error("Couldn't create budget - try again later");
		},
		onSettled: invalidateBudgets,
	});

	// update budget - optimistic in-place patch
	const updateMutation = useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateBudgetRequest;
		}) => updateBudget(id, input),
		onMutate: async ({ id, input }) => {
			const patch = Object.fromEntries(
				Object.entries(input).filter(([, v]) => v !== undefined),
			) as Partial<Budget>;
			return patchBudgetList((old) =>
				old.map((b) => (b.id === id ? { ...b, ...patch } : b)),
			);
		},
		onSuccess: () => toast.success("Budget updated"),
		onError: (_err, _vars, context) => {
			rollbackBudgets(context);
			toast.error("Couldn't update budget - try again later");
		},
		onSettled: invalidateBudgets,
	});

	// delete budget - optimistic removal
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteBudget(id),
		onMutate: (id: string) => patchBudgetList((old) => old.filter((b) => b.id !== id)),
		onSuccess: () => toast.success("Budget deleted"),
		onError: (_err, _vars, context) => {
			rollbackBudgets(context);
			toast.error("Couldn't delete budget - try again later");
		},
		onSettled: invalidateBudgets,
	});

	// attach / detach categories (async so callers can await a batch
	// of changes before closing a modal)
	const addCategoryMutation = useMutation({
		mutationFn: ({
			budgetId,
			categoryId,
		}: {
			budgetId: string;
			categoryId: string;
		}) => addCategoryToBudget(budgetId, categoryId),
		onSettled: invalidateBudgets,
	});

	const removeCategoryMutation = useMutation({
		mutationFn: ({
			budgetId,
			categoryId,
		}: {
			budgetId: string;
			categoryId: string;
		}) => removeCategoryFromBudget(budgetId, categoryId),
		onSettled: invalidateBudgets,
	});

	return {
		budgets,
		statuses,
		isLoading,
		error,

		createBudget: (
			input: CreateBudgetRequest,
			options?: { onSuccess?: () => void },
		) => createMutation.mutate(input, { onSuccess: options?.onSuccess }),
		updateBudget: (
			id: string,
			input: UpdateBudgetRequest,
			options?: { onSuccess?: () => void },
		) => updateMutation.mutate({ id, input }, { onSuccess: options?.onSuccess }),
		deleteBudget: (id: string) => deleteMutation.mutate(id),
		addCategory: (budgetId: string, categoryId: string) =>
			addCategoryMutation.mutateAsync({ budgetId, categoryId }),
		removeCategory: (budgetId: string, categoryId: string) =>
			removeCategoryMutation.mutateAsync({ budgetId, categoryId }),

		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,

		createError: createMutation.error,
		updateError: updateMutation.error,
		deleteError: deleteMutation.error,
	};
};
