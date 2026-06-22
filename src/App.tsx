import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useAuthStore } from "./store/authStore";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionPage from "./pages/TransactionPage";
import CategoriesPage from "./pages/CategoriesPage";
import AdminUserProfile from "./pages/admin/AdminUserProfile";

const App = () => {
	const { restoreSession } = useAuth();
	const { isLoading } = useAuthStore();

	useEffect(() => {
		restoreSession();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-grey-500">Loading...</p>
			</div>
		);
	}

	return (
		<Routes>
			{/* Public routes */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />

			{/* user routes */}
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/transactions" element={<TransactionPage />} />
				<Route path="/categories" element={<CategoriesPage />} />
			</Route>

			{/* admin routes */}
			<Route element={<ProtectedRoute requiredRole="Admin" />}>
				<Route path="/admin/users" element={<AdminDashboard />} />
				<Route path="/admin/users/:id" element={<AdminUserProfile />} />
			</Route>

			{/* Error routes */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
};

export default App;
