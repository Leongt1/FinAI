import type { Category, CreateCategoryRequest } from "../types";
import api from "./axios";

export const listCategories = async (): Promise<Category[]> => {
	const { data } = await api.get<Category[]>("/categories");
	return data;
};

export const createCategory = async (
	createInput: CreateCategoryRequest,
): Promise<void> => {
	await api.post("/categories/", createInput);
};

export const renameCategory = async (
	id: string,
	name: string,
): Promise<void> => {
	await api.patch(`/categories/${id}/rename`, {
		name,
	});
};

export const hideCategory = async (id: string): Promise<void> => {
	await api.patch(`/categories/${id}/hide`);
};

export const unhideCategory = async (id: string): Promise<void> => {
	await api.patch(`/categories/${id}/unhide`);
};
