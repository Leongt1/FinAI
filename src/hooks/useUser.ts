import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "../api/users";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
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
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["users", id] });

			// keep the auth store in sync so Sidebar/Dashboard greetings
			// reflect the change immediately
			const fresh = await getUserById(id);
			const { user: currentUser, setUser } = useAuthStore.getState();
			if (currentUser?.id === id) {
				setUser(fresh);
			}
			toast.success("Profile updated");
		},
		onError: () => toast.error("Couldn't update profile - try again later"),
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
