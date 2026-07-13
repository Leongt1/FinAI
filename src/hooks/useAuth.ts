import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import { login, logout, refresh, signup } from "../api/auth";
import { getUserById } from "../api/users";
import { parseJwt } from "../utils/parseJwt";
import type { LoginRequest, SignupRequest } from "../types";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { setUser, setIsLoading: setStoreLoading, clear } = useAuthStore();

	// To restore session on app start-up
	const restoreSession = async () => {
		setStoreLoading(true);
		try {
			const data = await refresh();
			const payload = parseJwt(data.access_token);
			const user = await getUserById(payload.user_id);
			setUser(user);
		} catch {
			clear();
		} finally {
			setStoreLoading(false);
		}
	};

	// Login
	const handleLogin = async (req: LoginRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			// login - get access token, set refresh token in cookie
			const data = await login(req);

			// get access token
			const payload = parseJwt(data.access_token);

			// parse jwt to get the payload - user_id and role
			const user = await getUserById(payload.user_id);

			// set user
			setUser(user);
			toast.success(`Logged in as ${user.name}`);
			navigate("/dashboard");
		} catch (err: unknown) {
			if (isAxiosError(err) && err.response?.status === 401) {
				setError("Invalid email or password");
			} else if (isAxiosError(err) && err.response?.data?.error) {
				setError(err.response.data.error);
			} else {
				setError("Login failed. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignup = async (req: SignupRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			// signup - get access token, set refresh token in cookie
			await signup(req);

			toast.success("Account created - log in to get started");
			// navigate to login
			navigate("/login");
		} catch (err: unknown) {
			if (isAxiosError(err)) {
				setError(err.response?.data?.error ?? "Signup failed");
			} else {
				setError("Signup failed");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await logout(); // clears cookie in backend, and clears token in axios
		} finally {
			clear(); // clear state stored in zustand
			queryClient.clear(); // drop cached data so it can't leak into the next session
			toast.success("Logged out");
			navigate("/login");
			setIsLoading(false);
		}
	};

	return {
		handleLogin,
		handleSignup,
		handleLogout,
		restoreSession,
		isLoading,
		error,
	};
};

// Helper — check if an error is an Axios error
// so we can safely access err.response
function isAxiosError(err: unknown): err is {
	response?: { status?: number; data?: { error?: string } };
} {
	return typeof err === "object" && err !== null && "response" in err;
}
