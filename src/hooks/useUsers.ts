import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers } from "../api/users";

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

	return {
		users,
		isLoading,
		error,

		deleteUser: (id: string) => deleteMutation.mutate(id),

		isDeleting: deleteMutation.isPending,
	};
};
