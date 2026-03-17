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
	role: string;
	gender: string;
	date_of_birth?: string | null;
}

// User Update
export interface UpdateUserRequest {
	name?: string;
	role?: string;
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
	custom: boolean;
}

// Create Category Request
export interface CreateCategoryRequest {
	name: string;
	icon?: string;
}

// Rename Category Request
export interface RenameCategoryRequest {
	name: string;
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
