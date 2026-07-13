import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TransactionModal from "./TransactionModal";
import type { Category } from "../types";

vi.mock("../api/transactions", () => ({
	createTransaction: vi.fn().mockResolvedValue(undefined),
	updateTransaction: vi.fn(),
	deleteTransaction: vi.fn(),
	listTransactions: vi.fn().mockResolvedValue([]),
	listTransactionsPage: vi.fn(),
}));

import { createTransaction } from "../api/transactions";

const categories: Category[] = [
	{ id: "c1", name: "Food & Dining", icon: "🍔", hidden: false },
	{ id: "c2", name: "Hidden Cat", icon: "🙈", hidden: true },
];

const renderModal = (onClose = vi.fn()) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	render(
		<QueryClientProvider client={queryClient}>
			<TransactionModal isOpen={true} onClose={onClose} categories={categories} />
		</QueryClientProvider>,
	);
	return onClose;
};

describe("TransactionModal validation", () => {
	beforeEach(() => vi.clearAllMocks());

	it("requires a category before submitting", async () => {
		renderModal();
		await userEvent.type(screen.getByPlaceholderText("0.00"), "100");
		await userEvent.click(screen.getByRole("button", { name: "Add Transaction" }));

		expect(screen.getByText("Please select a category")).toBeInTheDocument();
		expect(createTransaction).not.toHaveBeenCalled();
	});

	it("rejects a missing amount", async () => {
		renderModal();
		// pick the category through the dropdown
		await userEvent.click(screen.getByText("Select category"));
		await userEvent.click(screen.getByText("Food & Dining"));
		// the browser's native `required`/`min` constraints block a click-submit,
		// so fire the submit event directly to exercise the JS-level guard
		const form = screen
			.getByRole("button", { name: "Add Transaction" })
			.closest("form");
		expect(form).not.toBeNull();
		fireEvent.submit(form as HTMLFormElement);

		expect(screen.getByText("Please enter a valid amount")).toBeInTheDocument();
		expect(createTransaction).not.toHaveBeenCalled();
	});

	it("hides hidden categories from the picker", async () => {
		renderModal();
		await userEvent.click(screen.getByText("Select category"));
		expect(screen.queryByText("Hidden Cat")).not.toBeInTheDocument();
	});

	it("submits a valid transaction and closes immediately (optimistic)", async () => {
		const onClose = renderModal();
		await userEvent.click(screen.getByText("Select category"));
		await userEvent.click(screen.getByText("Food & Dining"));
		await userEvent.type(screen.getByPlaceholderText("0.00"), "250.50");
		await userEvent.click(screen.getByRole("button", { name: "Add Transaction" }));

		expect(createTransaction).toHaveBeenCalledWith(
			expect.objectContaining({
				category_id: "c1",
				amount: 250.5,
				type: "Expense",
			}),
		);
		expect(onClose).toHaveBeenCalled();
	});
});
