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
	BudgetStatus,
	CreateBudgetRequest,
	UpdateBudgetRequest,
} from "../types";
import { toast } from "../store/toastStore";

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

	// live status per budget (progress %, spent, healthy/warning/exceeded/achieved)
	const statusResults = useQueries({
		queries: (budgets ?? []).map((b) => ({
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

	// create budget
	const createMutation = useMutation({
		mutationFn: (input: CreateBudgetRequest) => createBudget(input),
		onSuccess: () => {
			invalidateBudgets();
			toast.success("Budget created");
		},
		onError: () => toast.error("Couldn't create budget - try again later"),
	});

	// update budget
	const updateMutation = useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: UpdateBudgetRequest;
		}) => updateBudget(id, input),
		onSuccess: () => {
			invalidateBudgets();
			toast.success("Budget updated");
		},
		onError: () => toast.error("Couldn't update budget - try again later"),
	});

	// delete budget
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteBudget(id),
		onSuccess: () => {
			invalidateBudgets();
			toast.success("Budget deleted");
		},
		onError: () => toast.error("Couldn't delete budget - try again later"),
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
