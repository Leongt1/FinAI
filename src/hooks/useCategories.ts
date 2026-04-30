import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createCategory,
	hideCategory,
	listCategories,
	renameCategory,
	unhideCategory,
} from "../api/categories";
import type { CreateCategoryRequest } from "../types";

export const useCategories = () => {
	const queryClient = useQueryClient();

	// fetch all categories
	const {
		data: categories,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: listCategories,
	});

	// create category
	const createMutation = useMutation({
		mutationFn: (input: CreateCategoryRequest) => createCategory(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// rename category
	const renameMutation = useMutation({
		mutationFn: ({
			id,
			name,
			icon,
		}: {
			id: string;
			name: string;
			icon: string;
		}) => renameCategory({id, name, icon}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// hide category
	const hideMutation = useMutation({
		mutationFn: (id: string) => hideCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// unhide category
	const unhideMutation = useMutation({
		mutationFn: (id: string) => unhideCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	return {
		categories,
		isLoading,
		error,

		createCategory: (
			input: CreateCategoryRequest,
			options?: { onSuccess?: () => void },
		) => createMutation.mutate(input, options),

		renameCategory: (
			id: string,
			name: string,
			icon: string,
			options?: { onSuccess?: () => void },
		) => renameMutation.mutate({ id, name, icon }, options),

		hideCategory: (id: string) => hideMutation.mutate(id),
		unhideCategory: (id: string) => unhideMutation.mutate(id),

		// loading states
		isCreating: createMutation.isPending,
		isRenaming: renameMutation.isPending,
		isHiding: hideMutation.isPending,
		isUnhiding: unhideMutation.isPending,

		// error states
		createError: createMutation.error,
		renameError: renameMutation.error,
	};
};
