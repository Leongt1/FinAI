import { create } from "zustand";
import type { User } from "../types";

// Optimistic auth hint: the refresh token is an httpOnly cookie we can't read,
// so we keep a tiny non-sensitive flag in localStorage recording "this browser
// probably has a session". It decides what to show first on load (splash vs
// marketing) - the real proof of auth is still the cookie + backend restore.
const HINT_KEY = "finai_session";

export const getSessionHint = (): boolean => {
	try {
		return localStorage.getItem(HINT_KEY) === "1";
	} catch {
		return false;
	}
};

const setSessionHint = (present: boolean) => {
	try {
		if (present) localStorage.setItem(HINT_KEY, "1");
		else localStorage.removeItem(HINT_KEY);
	} catch {
		/* ignore storage errors (private mode etc.) */
	}
};

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
	// initial state: only "loading" if we think there's a session worth
	// restoring - anonymous visitors start settled so public pages render at once
	user: null,
	isLoading: getSessionHint(),

	// Actions — these are functions that update the state
	// set() is provided by Zustand, it updates the store
	setUser: (user) => {
		setSessionHint(!!user);
		set({ user });
	},
	setIsLoading: (loading) => set({ isLoading: loading }),
	clear: () => {
		setSessionHint(false);
		set({ user: null });
	},
}));
