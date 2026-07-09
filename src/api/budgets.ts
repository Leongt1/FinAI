import type {
	Budget,
	BudgetStatus,
	CreateBudgetRequest,
	UpdateBudgetRequest,
} from "../types";
import api from "./axios";

// Unlike /transactions, the budgets endpoints wrap payloads in an
// envelope ({message, budgets|budget|status}) — unwrap here so hooks
// and components only ever see the plain types.

export const listBudgets = async (): Promise<Budget[]> => {
	const { data } = await api.get<{ budgets: Budget[] }>("/budgets/");
	return data.budgets;
};

export const getBudgetByID = async (id: string): Promise<Budget> => {
	const { data } = await api.get<{ budget: Budget }>(`/budgets/${id}`);
	return data.budget;
};

export const getBudgetStatus = async (id: string): Promise<BudgetStatus> => {
	const { data } = await api.get<{ status: BudgetStatus }>(
		`/budgets/${id}/status`,
	);
	return data.status;
};

export const createBudget = async (
	input: CreateBudgetRequest,
): Promise<Budget> => {
	const { data } = await api.post<{ budget: Budget }>("/budgets/", input);
	return data.budget;
};

export const updateBudget = async (
	id: string,
	input: UpdateBudgetRequest,
): Promise<Budget> => {
	const { data } = await api.put<{ budget: Budget }>(`/budgets/${id}`, input);
	return data.budget;
};

export const deleteBudget = async (id: string): Promise<void> => {
	await api.delete(`/budgets/${id}`);
};

export const addCategoryToBudget = async (
	budgetId: string,
	categoryId: string,
): Promise<void> => {
	await api.post(`/budgets/${budgetId}/categories`, {
		category_id: categoryId,
	});
};

export const removeCategoryFromBudget = async (
	budgetId: string,
	categoryId: string,
): Promise<void> => {
	await api.delete(`/budgets/${budgetId}/categories/${categoryId}`);
};
