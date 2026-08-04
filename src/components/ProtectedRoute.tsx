import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import TipsLoader from "./TipsLoader";
import type { Role } from "../types";

interface ProtectedRouteProps {
	requiredRole?: Role;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
	const user = useAuthStore((s) => s.user);
	const isLoading = useAuthStore((s) => s.isLoading);

	// wait for the background session restore before deciding to allow or redirect
	if (isLoading) {
		return <TipsLoader fullscreen label="Signing you in" />;
	}

	// If not logged in, redirect to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/dashboard" replace />;
	}

	// If logged in, render the child routes
	return <Outlet />;
};
