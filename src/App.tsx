import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
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
import LandingPage from "./pages/LandingPage";
import PrivacyPage from "./pages/PrivacyPage";
import ToastContainer from "./components/ToastContainer";

const App = () => {
	const { restoreSession } = useAuth();

	// Restore any existing session in the background. Public routes (landing,
	// login, signup) render immediately; only ProtectedRoute waits for this to
	// resolve - so a logged-out visitor never waits on an auth check (or a cold
	// backend) just to read the landing page.
	useEffect(() => {
		restoreSession();
	}, []);

	return (
		<>
		<ToastContainer />
		<Routes>
			{/* Public routes */}
			<Route path="/" element={<LandingPage />} />
			<Route path="/privacy" element={<PrivacyPage />} />
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
