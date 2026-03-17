import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Gender } from "../types";

const SignupPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [gender, setGender] = useState("");

	const [localError, setLocalError] = useState<string | null>(null);

	const { handleSignup, isLoading, error } = useAuth();

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			setLocalError("Passwords no not match");
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
			className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-900"
			style={{ backgroundImage: `url('/background_image.png')` }}
		>
			{/* Card */}
			<div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col items-center justify-center border border-gray-100">
				<h1 className="text-2xl font-bold">Signup</h1>
				<p className="text-sm text-gray-500 py-3">
					Enter your details to create a new account
				</p>
				{/* Error message */}
				{(localError || error) && (
					<div className="w-full bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
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
						className="w-full rounded-lg border border-gray-200 text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your Email"
						className="w-full rounded-lg border border-gray-200 text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your Password"
						className="w-full rounded-lg border border-gray-200 text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<input
						type="password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm your Password"
						className="w-full rounded-lg border border-gray-200 text-sm p-2 px-4 mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<select
						className="w-full p-2 px-3 mt-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
						required
						value={gender}
						onChange={(e) => setGender(e.target.value)}
					>
						<option value="">Select gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
					</select>
					<div className="flex items-end justify-between flex-col my-4">
						<span className="text-sm text-gray-500 cursor-pointer hover:text-black">
							Having trouble signing up?
						</span>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-green-500 text-white rounded-lg p-3 mt-3 font-semibold hover:bg-green-600 transition-colors cursor-pointer"
						>
							{isLoading ? "Signing up..." : "Sign up"}
						</button>
					</div>
				</form>
				<p className="text-sm">
					Already have an account?{" "}
					<Link to="/login" className="font-bold hover:underline">
						Login Now
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignupPage;
