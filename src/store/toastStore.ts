import { create } from "zustand";

export type ToastType = "success" | "error" | "warning";

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
}

interface ToastState {
	toasts: Toast[];
	push: (type: ToastType, message: string) => void;
	dismiss: (id: number) => void;
}

const TOAST_TTL_MS = 4000;

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],

	push: (type, message) => {
		const id = nextId++;
		set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
		setTimeout(() => {
			set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
		}, TOAST_TTL_MS);
	},

	dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// convenience for non-component callers (hooks, interceptors)
export const toast = {
	success: (message: string) => useToastStore.getState().push("success", message),
	error: (message: string) => useToastStore.getState().push("error", message),
	warning: (message: string) => useToastStore.getState().push("warning", message),
};
