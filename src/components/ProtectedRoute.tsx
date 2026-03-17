import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { Role } from "../types";

interface ProtectedRouteProps {
	requiredRole?: Role;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
	const user = useAuthStore((s) => s.user);
	const isLoading = useAuthStore((s) => s.isLoading);

	if (isLoading) {
		return <p>Loading...protected</p>;
	}

	// If not logged in, redirect to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user.Role !== requiredRole) {
		return <Navigate to="/dashboard" replace />;
	}

	// If logged in, render the child routes
	return <Outlet />;
};
