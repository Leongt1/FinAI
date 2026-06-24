import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Gender } from "../types";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const SignupPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [gender, setGender] = useState("");

	const [isForgotOpen, setIsForgotOpen] = useState(false)

	const [localError, setLocalError] = useState<string | null>(null);

	const { handleSignup, isLoading, error } = useAuth();

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			setLocalError("Passwords do not match");
			return;
		}

		setLocalError(null);
		await handleSignup({
			name,
			email,
			password,
			role: "User",
			gender: gender as Gender,
			date_of_birth: null,
		});
	}

	return (
		<div
			className="min-h-screen bg-bg flex items-center justify-center bg-cover bg-center bg-no-repeat"
		>
			{/* Card */}
			<div className="bg-surface rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col items-center justify-center border border-border">
				<h1 className="text-2xl font-bold text-text-muted">Signup</h1>
				<p className="text-sm text-subtle py-3">
					Enter your details to create a new account
				</p>
				{/* Error message */}
				{(localError || error) && (
					<div className="w-full bg-expense-bg text-expense text-sm px-4 py-3 rounded-lg">
						{localError || error}
					</div>
				)}
				{/* Form */}
				<form className="w-full" onSubmit={handleSubmit}>
					<input
						type="text"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your Name"
						className="w-full rounded-lg border border-border text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
					/>
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
					<input
						type="password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm your Password"
						className="w-full rounded-lg border border-border text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
					/>
					<select
						className="w-full p-2 px-3 mt-4 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-border-strong text-text-muted"
						required
						value={gender}
						onChange={(e) => setGender(e.target.value)}
					>
						<option value="" className="bg-surface text-text-muted">
							Select gender
						</option>
						<option value="Male" className="bg-surface text-text-muted">
							Male
						</option>
						<option value="Female" className="bg-surface text-text-muted">
							Female
						</option>
					</select>
					<div className="flex items-end justify-between flex-col my-4">
						<button 
							type="button"
							onClick={() => setIsForgotOpen(true)}
							className="text-sm text-text-muted cursor-pointer hover:text-accent-glow"
						>
							Having trouble signing up?
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-accent-dim text-accent-glow rounded-lg p-3 mt-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
						>
							{isLoading ? "Signing up..." : "Sign up"}
						</button>
					</div>
				</form>
				<p className="text-sm text-text-muted">
					Already have an account?{" "}
					<Link to="/login" className="font-bold hover:underline text-accent-glow">
						Login Now
					</Link>
				</p>
			</div>
			<ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
		</div>
		
	);
};

export default SignupPage;
