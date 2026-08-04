import { describe, expect, it } from "vitest";
import {
	isRowValid,
	rowToCreateRequest,
	toReviewRows,
	type ReviewRow,
} from "./bulkImport";
import type { Category, ExtractedTransaction } from "../types";

const categories: Category[] = [
	{ id: "c1", name: "Food", icon: "🍔", hidden: false },
	{ id: "c2", name: "Salary", icon: "💰", hidden: false },
	{ id: "c3", name: "Old", icon: "📦", hidden: true },
];

describe("toReviewRows", () => {
	it("resolves a matching category name to its id, case-insensitively", () => {
		const extracted: ExtractedTransaction[] = [
			{ amount: 250, kind: "Expense", category: "food", date: "2026-08-01", description: "lunch" },
		];
		const [row] = toReviewRows(extracted, categories);
		expect(row.categoryId).toBe("c1");
		expect(row.amount).toBe("250");
		expect(row.type).toBe("Expense");
	});

	it("leaves categoryId empty when nothing matches", () => {
		const extracted: ExtractedTransaction[] = [
			{ amount: 99, kind: "Expense", category: "Fuel", date: "2026-08-01", description: "" },
		];
		expect(toReviewRows(extracted, categories)[0].categoryId).toBe("");
	});

	it("does not match a hidden category", () => {
		const extracted: ExtractedTransaction[] = [
			{ amount: 10, kind: "Expense", category: "Old", date: "2026-08-01", description: "" },
		];
		expect(toReviewRows(extracted, categories)[0].categoryId).toBe("");
	});
});

describe("isRowValid", () => {
	const base: ReviewRow = {
		amount: "100",
		type: "Expense",
		categoryId: "c1",
		date: "2026-08-01",
		description: "",
	};

	it("accepts a complete row", () => {
		expect(isRowValid(base)).toBe(true);
	});

	it("rejects a row with no category", () => {
		expect(isRowValid({ ...base, categoryId: "" })).toBe(false);
	});

	it("rejects a non-positive amount", () => {
		expect(isRowValid({ ...base, amount: "0" })).toBe(false);
		expect(isRowValid({ ...base, amount: "" })).toBe(false);
	});
});

describe("rowToCreateRequest", () => {
	it("builds a request with an ISO date and numeric amount", () => {
		const req = rowToCreateRequest({
			amount: "250.5",
			type: "Income",
			categoryId: "c2",
			date: "2026-08-01",
			description: "  pay  ",
		});
		expect(req.category_id).toBe("c2");
		expect(req.amount).toBe(250.5);
		expect(req.type).toBe("Income");
		expect(req.description).toBe("pay");
		expect(req.date).toContain("2026-08-01");
	});

	it("sends null description when blank", () => {
		const req = rowToCreateRequest({
			amount: "10",
			type: "Expense",
			categoryId: "c1",
			date: "2026-08-01",
			description: "   ",
		});
		expect(req.description).toBeNull();
	});
});
