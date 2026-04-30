import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUserById, getUsers, updateUser } from "../api/users";
import type { UpdateUserRequest } from "../types";

export const useUsers = () => {
	const queryClient = useQueryClient();

	// fetch all users
	const {
		data: users,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: getUsers,
	});

	// delete a User
	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => {
			// refetch users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, req }: { id: string; req: UpdateUserRequest }) =>
			updateUser(id, req),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	return {
		users,
		isLoading,
		error,

		deleteUser: (id: string) => deleteMutation.mutate(id),
		updateMutation: (id: string, req: UpdateUserRequest) =>
			updateMutation.mutate({ id, req }),

		isDeleting: deleteMutation.isPending,
		isUpdating: updateMutation.isPending,
	};
};

export const useUser = (id: string) => {
	const queryClient = useQueryClient();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users", id],
		queryFn: () => getUserById(id),
		enabled: !!id,
	});

	const updateMutation = useMutation({
		mutationFn: (req: UpdateUserRequest) => updateUser(id, req),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users", id] });
		},
	});

	return {
		user,
		isLoading,
		error,
		updateUser: (
			req: UpdateUserRequest,
			options?: { onSuccess?: () => void },
		) => updateMutation.mutate(req, { onSuccess: options?.onSuccess }),
		isUpdating: updateMutation.isPending,
		updateError: updateMutation.error,
	};
};
