import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTransactions } from "./useTransactions";
import type { Transaction } from "../types";

vi.mock("../api/transactions", () => ({
	createTransaction: vi.fn(),
	updateTransaction: vi.fn(),
	deleteTransaction: vi.fn(),
	listTransactions: vi.fn(),
	listTransactionsPage: vi.fn(),
}));

import { createTransaction, listTransactions } from "../api/transactions";

const existing: Transaction = {
	id: "t1",
	category_id: "c1",
	amount: 100,
	description: "existing",
	type: "Expense",
	date: "2026-07-01T00:00:00Z",
	created_at: "",
	updated_at: "",
};

const setup = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return { queryClient, wrapper };
};

describe("useTransactions optimistic create", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(listTransactions).mockResolvedValue([existing]);
	});

	it("inserts a temp row immediately, then refetches on success", async () => {
		const { queryClient, wrapper } = setup();
		let resolveCreate: () => void = () => {};
		vi.mocked(createTransaction).mockImplementation(
			() => new Promise<void>((resolve) => (resolveCreate = resolve)),
		);

		const { result } = renderHook(() => useTransactions(), { wrapper });
		await waitFor(() => expect(result.current.transactions).toHaveLength(1));

		act(() => {
			result.current.createTransaction({
				category_id: "c1",
				amount: 42,
				type: "Expense",
				date: "2026-07-02T00:00:00Z",
			});
		});

		// optimistic: cache already holds the temp row while the POST is in flight
		await waitFor(() => {
			const cached = queryClient.getQueryData<Transaction[]>(["transactions", {}]);
			expect(cached).toHaveLength(2);
			expect(cached?.some((tx) => tx.id.startsWith("temp-"))).toBe(true);
		});

		await act(async () => {
			resolveCreate();
		});
		// after settle the temp row is replaced by a refetch
		await waitFor(() => {
			const cached = queryClient.getQueryData<Transaction[]>(["transactions", {}]);
			expect(cached?.every((tx) => !tx.id.startsWith("temp-"))).toBe(true);
		});
	});

	it("rolls the cache back when the create fails", async () => {
		const { queryClient, wrapper } = setup();
		vi.mocked(createTransaction).mockRejectedValue(new Error("boom"));

		const { result } = renderHook(() => useTransactions(), { wrapper });
		await waitFor(() => expect(result.current.transactions).toHaveLength(1));

		act(() => {
			result.current.createTransaction({
				category_id: "c1",
				amount: 42,
				type: "Expense",
				date: "2026-07-02T00:00:00Z",
			});
		});

		await waitFor(() => {
			const cached = queryClient.getQueryData<Transaction[]>(["transactions", {}]);
			expect(cached).toHaveLength(1);
			expect(cached?.[0].id).toBe("t1");
		});
	});
});

describe("useTransactions optimistic delete", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(listTransactions).mockResolvedValue([existing]);
	});

	it("removes the row immediately", async () => {
		const { queryClient, wrapper } = setup();
		const { deleteTransaction } = await import("../api/transactions");
		vi.mocked(deleteTransaction).mockImplementation(() => new Promise(() => {}));

		const { result } = renderHook(() => useTransactions(), { wrapper });
		await waitFor(() => expect(result.current.transactions).toHaveLength(1));

		act(() => {
			result.current.deleteTransaction("t1");
		});

		await waitFor(() => {
			const cached = queryClient.getQueryData<Transaction[]>(["transactions", {}]);
			expect(cached).toHaveLength(0);
		});
	});
});
