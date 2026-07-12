export type Role = "Admin" | "User";
export type Gender = "Male" | "Female";
export type TransactionType = "Income" | "Expense";

// User
export interface User {
	id: string;
	name: string;
	email: string;
	role: Role;
	gender: Gender;
	date_of_birth: string | null;
	created_at: string;
	updated_at: string;
	created_by: string | null;
	updated_by: string | null;
}

// Login Response
export interface LoginResponse {
	access_token: string;
	expires_in: number;
}

// Login Request
export interface LoginRequest {
	email: string;
	password: string;
}

// Signup Request
export interface SignupRequest {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
	gender: string;
	date_of_birth?: string | null;
}

// User Update
export interface UpdateUserRequest {
	name?: string;
	gender?: string;
	date_of_birth?: string | null;
}

// Error
export interface ApiError {
	error: string;
}

// Transaction
export interface Transaction {
	id: string;
	category_id: string;
	amount: number;
	description: string | null;
	type: TransactionType;
	date: string;
	created_at: string;
	updated_at: string;
}

// Category
export interface Category {
	id: string;
	name: string;
	icon: string;
	hidden: boolean;
}

// Create Category Request
export interface CreateCategoryRequest {
	name: string;
	icon?: string;
}

// Create Transaction Request
export interface CreateTransactionRequest {
	category_id: string;
	amount: number;
	description?: string | null;
	type: TransactionType;
	date: string;
}

// Update Transaction Request
export interface UpdateTransactionRequest {
	category_id?: string;
	amount?: number;
	description?: string | null;
	type?: TransactionType;
	date?: string;
}

// Transaction Filter
export interface TransactionFilter {
	category_id?: string;
	type?: TransactionType;
	date_from?: string;
	date_to?: string;
}

// Paginated transactions envelope (GET /transactions?limit=&offset=)
export interface PaginatedTransactions {
	transactions: Transaction[];
	total: number;
	limit: number;
	offset: number;
}

// Budget
export type BudgetType = "overall" | "category";
export type BudgetKind = "expense" | "savings";
export type PeriodUnit = "day" | "week" | "month" | "year";
export type BudgetHealthStatus = "healthy" | "warning" | "exceeded" | "achieved";

export interface Budget {
	id: string;
	user_id: string;
	name: string;
	type: BudgetType;
	kind: BudgetKind;
	amount: number;
	period_unit: PeriodUnit;
	period_value: number;
	start_date: string;
	created_at: string;
	updated_at: string;
	category_ids?: string[];
}

// Budget Status (GET /budgets/:id/status)
export interface BudgetStatus {
	budget_id: string;
	name: string;
	budget_amount: number;
	spent: number;
	remaining: number;
	progress_percent: number;
	status: BudgetHealthStatus;
	period_start: string;
	period_end: string;
}

// Create Budget Request
export interface CreateBudgetRequest {
	name: string;
	type: BudgetType;
	kind: BudgetKind;
	amount: number;
	period_unit: PeriodUnit;
	period_value: number;
	start_date: string;
	category_ids?: string[];
}

// Update Budget Request (kind is immutable on the backend)
export interface UpdateBudgetRequest {
	name?: string;
	type?: BudgetType;
	amount?: number;
	period_unit?: PeriodUnit;
	period_value?: number;
	start_date?: string;
}