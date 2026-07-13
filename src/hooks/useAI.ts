import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCredits, postChat } from "../api/ai";
import type { AIChatRequest } from "../types";
import { toast } from "../store/toastStore";

export const useAI = () => {
	const queryClient = useQueryClient();

	const { data: credits, isLoading: isLoadingCredits } = useQuery({
		queryKey: ["ai", "credits"],
		queryFn: getCredits,
	});

	const chatMutation = useMutation({
		mutationFn: (input: AIChatRequest) => postChat(input),
		onSuccess: (data) => {
			// the assistant may have created transactions/categories, and a
			// credit was definitely spent
			queryClient.setQueryData(["ai", "credits"], data.credits_remaining);
			if (data.actions.length > 0) {
				queryClient.invalidateQueries({ queryKey: ["transactions"] });
				queryClient.invalidateQueries({ queryKey: ["categories"] });
				queryClient.invalidateQueries({ queryKey: ["budgets"] });
			}
		},
		onError: () => toast.error("The assistant couldn't answer - try again later"),
	});

	return {
		credits,
		isLoadingCredits,
		sendMessage: chatMutation.mutateAsync,
		isThinking: chatMutation.isPending,
	};
};
