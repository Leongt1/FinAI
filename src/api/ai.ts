import type { AIChatRequest, AIChatResponse, AICreditsResponse } from "../types";
import api from "./axios";

export const postChat = async (input: AIChatRequest): Promise<AIChatResponse> => {
	const { data } = await api.post<AIChatResponse>("/ai/chat", input);
	return data;
};

export const getCredits = async (): Promise<number> => {
	const { data } = await api.get<AICreditsResponse>("/ai/credits");
	return data.credits;
};
