export type Role = "Admin" | "User";
export type Gender = "Male" | "Female";

// User
export interface User {
	ID: string;
	Name: string;
	Email: string;
	HashPassword: string;
	Role: Role;
	Gender: Gender;
	DateOfBirth: string | null;
	CreatedAt: string;
	UpdatedAt: string;
	CreatedBy: string | null;
	UpdatedBy: string | null;
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
	date_of_birth?: string | null | undefined;
}

export interface UpdateUserRequest {
	name?: string;
	role?: string;
	gender?: string;
	date_of_birth?: string | null;
}

export interface ApiError {
	error: string;
}
