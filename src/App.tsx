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
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BudgetsPage from "./pages/BudgetsPage";
import AssistantPage from "./pages/AssistantPage";
import ToastContainer from "./components/ToastContainer";

const App = () => {
	const { restoreSession } = useAuth();
	const { isLoading } = useAuthStore();

	useEffect(() => {
		restoreSession();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-accent-glow text-2xl font-bold animate-pulse">Loading...</p>
			</div>
		);
	}

	return (
		<>
		<ToastContainer />
		<Routes>
			{/* Public routes */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
			<Route path="/reset-password" element={<ResetPasswordPage />} />

			{/* user routes */}
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/transactions" element={<TransactionPage />} />
				<Route path="/budget" element={<BudgetsPage />} />
				<Route path="/categories" element={<CategoriesPage />} />
				<Route path="/assistant" element={<AssistantPage />} />
			</Route>

			{/* admin routes */}
			<Route element={<ProtectedRoute requiredRole="Admin" />}>
				<Route path="/admin/users" element={<AdminDashboard />} />
				<Route path="/admin/users/:id" element={<AdminUserProfile />} />
			</Route>

			{/* Error routes */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
		</>
	);
};

export default App;
