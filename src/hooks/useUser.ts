import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "../api/users";
import type { UpdateUserRequest } from "../types";

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
