import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
	// State
	user: User | null;
	isLoading: boolean;

	// Actions
	setUser: (user: User | null) => void;
	setIsLoading: (loading: boolean) => void;
	clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	// initial state
	user: null,
	isLoading: true,

	// Actions — these are functions that update the state
	// set() is provided by Zustand, it updates the store
	setUser: (user) => set({ user }),
	setIsLoading: (loading) => set({ isLoading: loading }),
	clear: () => set({ user: null }),
}));
