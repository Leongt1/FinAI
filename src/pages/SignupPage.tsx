import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import PublicTopBar from "../components/PublicTopBar";
import type { Gender } from "../types";

const SignupPage = () => {
	const user = useAuthStore((s) => s.user);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [gender, setGender] = useState("");

	const [localError, setLocalError] = useState<string | null>(null);

	const { handleSignup, isLoading, error } = useAuth();

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (password.length < 8) {
			setLocalError("Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			setLocalError("Passwords do not match");
			return;
		}

		setLocalError(null);
		await handleSignup({
			name,
			email,
			password,
			confirm_password: confirmPassword,
			gender: gender as Gender,
			date_of_birth: null,
		});
	}

	return (
		<div className="min-h-dvh flex flex-col bg-bg">
			<PublicTopBar variant="signup" />
			<div className="flex flex-1 items-center justify-center px-4 py-10">
			{/* Card */}
			<div className="bg-surface rounded-2xl shadow-md p-6 sm:p-10 w-full max-w-md flex flex-col items-center justify-center border border-border">
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
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-accent-dim text-accent-glow rounded-lg p-3 my-4 font-semibold hover:bg-accent hover:text-on-accent transition-colors cursor-pointer"
					>
						{isLoading ? "Signing up..." : "Sign up"}
					</button>
				</form>
				<p className="text-sm text-text-muted">
					Already have an account?{" "}
					<Link to="/login" className="font-bold hover:underline text-accent-glow">
						Login Now
					</Link>
				</p>
			</div>
			</div>
		</div>
	);
};

export default SignupPage;
