import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createCategory,
	deleteCategory,
	hideCategory,
	listCategories,
	renameCategory,
	unhideCategory,
} from "../api/categories";
import type { Category, CreateCategoryRequest } from "../types";
import { toast } from "../store/toastStore";

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
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });
			const prevCategories = queryClient.getQueryData<Category[]>(["categories"]);
			const temp: Category = {
				id: `temp-${Date.now()}`,
				name: input.name,
				icon: input.icon ?? "",
				hidden: false,
			};
			queryClient.setQueryData(["categories"], (old: Category[] = []) => [
				...old,
				temp,
			]);
			return { prevCategories };
		},
		onSuccess: () => toast.success("Category created"),
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["categories"], context?.prevCategories);
			toast.error("Couldn't create category - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	type renameMutationProps = {
		id: string, 
		name: string,
		icon: string
	}

	// rename category
	const renameMutation = useMutation({
		mutationFn: ({
			id,
			name,
			icon,
		}: renameMutationProps) => renameCategory({id, name, icon}),
		onMutate: async ({id, name, icon}: renameMutationProps) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });

			const prevCategories = queryClient.getQueryData<Category[]>(["categories"]);
			queryClient.setQueryData(["categories"], (old: Category[] = []) => old.map((cat) => {
				return cat.id === id ? {...cat, name, icon}: cat
			}));

			return { prevCategories }
		},
		onSuccess: () => toast.success("Category renamed"),
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["categories"], context?.prevCategories)
			toast.error("Couldn't rename category - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// hide category
	const hideMutation = useMutation({
		mutationFn: (id: string) => hideCategory(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] }) // cancel ongoing queries

			const prevCategories = queryClient.getQueryData<Category[]>(["categories"])
			queryClient.setQueryData(["categories"], (old: Category[] = []) => old.map((cat) => {
				return cat.id === id ? {...cat, hidden: true}: cat
			}));

			return { prevCategories };
		},
		onError: (_err, _var, context) => {
			queryClient.setQueryData(["categories"], context?.prevCategories)
			toast.error("Couldn't hide category - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	// unhide category
	const unhideMutation = useMutation({
		mutationFn: (id: string) => unhideCategory(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({queryKey: ["categories"]});

			const prevCategories = queryClient.getQueryData<Category[]>(["categories"]);
			queryClient.setQueryData(["categories"], (old: Category[] = []) => old.map((cat) => {
					return cat.id === id ? { ...cat, hidden: false }: cat
			}));

			return { prevCategories };
		},
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["categories"], context?.prevCategories )
			toast.error("Couldn't unhide category - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["categories"] });
			const prevCategories = queryClient.getQueryData<Category[]>(["categories"]);
			queryClient.setQueryData(["categories"], (old: Category[] = []) =>
				old.filter((cat) => cat.id !== id),
			);
			return { prevCategories };
		},
		onSuccess: () => toast.success("Category deleted"),
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["categories"], context?.prevCategories);
			toast.error("Couldn't delete category - try again later");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	})

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

		deleteCategory: (id: string) => deleteMutation.mutate(id),

		// loading states
		isCreating: createMutation.isPending,
		isRenaming: renameMutation.isPending,
		isHiding: hideMutation.isPending,
		isUnhiding: unhideMutation.isPending,
		isDeleting: deleteMutation.isPending,

		// error states
		createError: createMutation.error,
		renameError: renameMutation.error,
		deleteError: deleteMutation.error,
	};
};
