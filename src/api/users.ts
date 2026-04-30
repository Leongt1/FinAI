import type { UpdateUserRequest, User } from "../types";
import api from "./axios";

// GET /users
// Returns all users — Admin only on your backend
export const getUsers = async (): Promise<User[]> => {
	const { data } = await api.get<User[]>("/users");
	return data;
};

// GET /users/:id
export const getUserById = async (id: string): Promise<User> => {
	const { data } = await api.get<User>(`/users/${id}`);
	return data;
};

// PATCH /users/:id
// Partial update — only send fields you want to change
export const updateUser = async (
	id: string,
	req: UpdateUserRequest,
): Promise<void> => {
	await api.patch(`/users/${id}`, req);
};

// DELETE /users/:id
export const deleteUser = async (id: string): Promise<void> => {
	await api.delete(`/users/${id}`);
};
