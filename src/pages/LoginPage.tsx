import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
			className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-900"
			style={{ backgroundImage: `url('/background_image.png')` }}
		>
			{/* Card */}
			<div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md flex flex-col items-center justify-center border border-gray-100">
				<h1 className="text-2xl font-bold">Login</h1>
				<p className="text-sm text-gray-500 py-3">
					Enter your details to login to your account
				</p>
				{/* Error message */}
				{error && (
					<div className="w-full bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
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
					<div className="flex items-end justify-between flex-col my-4">
						<span className="text-sm text-gray-500 cursor-pointer hover:text-black">
							Having trouble logging in?
						</span>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-green-500 text-white rounded-lg p-3 mt-3 font-semibold hover:bg-green-600 transition-colors cursor-pointer"
						>
							{isLoading ? "Logging in..." : "Login"}
						</button>
					</div>
				</form>
				<p className="text-sm">
					Don't have an account?{" "}
					<Link to="/signup" className="font-bold hover:underline">
						Signup Now
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
