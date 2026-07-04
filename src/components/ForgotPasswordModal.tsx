import { useState } from "react";
import { forgotPassword } from "../api/auth";

interface ForgotPasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleClose = () => {
		setEmail("");
		setSent(false);
		setError(null);
		onClose();
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			await forgotPassword(email);
			setSent(true);
		} catch {
			// Intentionally vague — don't reveal if email exists
			setSent(true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-bg/70 z-50 flex items-center justify-center p-4"
			onClick={handleClose}
		>
			<div
				className="w-full max-w-md bg-surface p-8 rounded-3xl shadow-xl border border-border"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-text-muted">Reset Password</h2>
					<button
						onClick={handleClose}
						className="text-text-muted hover:text-subtle cursor-pointer px-2 py-1"
					>
						✕
					</button>
				</div>

				{sent ? (
					<div className="flex flex-col gap-4">
						<p className="text-sm text-text-muted">
							If an account exists for{" "}
							<span className="text-accent-glow font-semibold">{email}</span>,
							a reset link has been sent. Check your inbox.
						</p>
						<button
							onClick={handleClose}
							className="w-full bg-accent-dim text-accent-glow rounded-xl p-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
						>
							Done
						</button>
					</div>
				) : (
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-expense-bg text-expense text-sm px-4 py-3 rounded-xl">
								{error}
							</div>
						)}
						<p className="text-sm text-subtle">
							Enter the email address for your account and we'll send you a reset link.
						</p>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
						/>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-accent-dim text-accent-glow rounded-xl p-3 font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ForgotPasswordModal;