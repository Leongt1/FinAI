import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isForgotOpen, setIsForgotOpen] = useState(false);

	const { handleLogin, isLoading, error } = useAuth();
	const user = useAuthStore((s) => s.user);

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		await handleLogin({ email, password });
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center bg bg-center bg-no-repeat"
		>
			{/* Card */}
			<div className="bg-surface rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col items-center justify-center border border-border">
				<h1 className="text-2xl font-bold text-text-muted">Login</h1>
				<p className="text-sm text-subtle py-3">
					Enter your details to login to your account
				</p>
				{/* Error message */}
				{error && (
					<div className="w-full bg-expense-bg text-expense text-sm px-4 py-3 rounded-lg">
						{error}
					</div>
				)}
				{/* Form */}
				<form className="w-full" onSubmit={handleSubmit}>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your Email"
						className="w-full rounded-lg border border-border text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
					/>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your Password"
						className="w-full rounded-lg border border-border text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
					/>
					<div className="flex items-end justify-between flex-col my-4">
						<button
							type="button"
							onClick={() => setIsForgotOpen(true)}
							className="text-sm text-text-muted cursor-pointer hover:text-accent-glow"
						>
							Forgot password?
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-accent-dim text-accent-glow rounded-lg p-3 mt-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
						>
							{isLoading ? "Logging in..." : "Login"}
						</button>
					</div>
				</form>
				<p className="text-sm text-text-muted">
					Don't have an account?{" "}
					<Link to="/signup" className="font-bold hover:underline text-accent-glow">
						Signup Now
					</Link>
				</p>
			</div>
			<ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
		</div>
	);
};

export default LoginPage;
