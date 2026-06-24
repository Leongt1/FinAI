import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-surface border border-border rounded-2xl p-10 max-w-md w-full text-center">
					<p className="text-expense font-semibold mb-4">Invalid or missing reset token.</p>
					<button
						onClick={() => navigate("/login")}
						className="text-accent-glow hover:underline text-sm cursor-pointer"
					>
						Back to Login
					</button>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);
		try {
			await resetPassword(token, password, confirmPassword);
			setSuccess(true);
		} catch {
			setError("This link is invalid or has expired. Please request a new one.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-surface border border-border rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col items-center">
				<h1 className="text-2xl font-bold text-text-muted">Set New Password</h1>
				<p className="text-sm text-subtle py-3 text-center">
					Choose a strong password for your account.
				</p>

				{success ? (
					<div className="w-full flex flex-col gap-4 items-center">
						<div className="w-full bg-income-bg text-income text-sm px-4 py-3 rounded-lg text-center">
							Password reset successfully!
						</div>
						<button
							onClick={() => navigate("/login")}
							className="w-full bg-accent-dim text-accent-glow rounded-lg p-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
						>
							Back to Login
						</button>
					</div>
				) : (
					<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
						{error && (
							<div className="w-full bg-expense-bg text-expense text-sm px-4 py-3 rounded-lg">
								{error}
							</div>
						)}
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="New password"
							className="w-full rounded-lg border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
						/>
						<input
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm new password"
							className="w-full rounded-lg border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
						/>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-accent-dim text-accent-glow rounded-lg p-3 font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{isLoading ? "Resetting..." : "Reset Password"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ResetPasswordPage;