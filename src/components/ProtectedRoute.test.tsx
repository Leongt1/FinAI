import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types";

const makeUser = (role: User["role"]): User => ({
	id: "u1",
	name: "Test",
	email: "t@example.com",
	role,
	gender: "Male",
	date_of_birth: null,
	created_at: "",
	updated_at: "",
	created_by: null,
	updated_by: null,
});

const renderAt = (path: string) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route path="/login" element={<p>login page</p>} />
				<Route path="/dashboard" element={<p>dashboard page</p>} />
				<Route element={<ProtectedRoute />}>
					<Route path="/profile" element={<p>profile page</p>} />
				</Route>
				<Route element={<ProtectedRoute requiredRole="Admin" />}>
					<Route path="/admin/users" element={<p>admin page</p>} />
				</Route>
			</Routes>
		</MemoryRouter>,
	);

describe("ProtectedRoute", () => {
	beforeEach(() => {
		useAuthStore.setState({ user: null, isLoading: false });
	});

	it("redirects anonymous users to /login", () => {
		renderAt("/profile");
		expect(screen.getByText("login page")).toBeInTheDocument();
	});

	it("renders child routes for a logged-in user", () => {
		useAuthStore.setState({ user: makeUser("User") });
		renderAt("/profile");
		expect(screen.getByText("profile page")).toBeInTheDocument();
	});

	it("sends non-admins away from admin routes", () => {
		useAuthStore.setState({ user: makeUser("User") });
		renderAt("/admin/users");
		expect(screen.getByText("dashboard page")).toBeInTheDocument();
	});

	it("lets admins into admin routes", () => {
		useAuthStore.setState({ user: makeUser("Admin") });
		renderAt("/admin/users");
		expect(screen.getByText("admin page")).toBeInTheDocument();
	});

	it("shows a loading state while the session restores", () => {
		useAuthStore.setState({ user: null, isLoading: true });
		renderAt("/profile");
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
	});
});
