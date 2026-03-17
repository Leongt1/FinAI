import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login, logout, refresh, signup } from "../api/auth";
import { getUserById } from "../api/users";
import type { LoginRequest, SignupRequest } from "../types";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { setUser, setIsLoading: setStoreLoading, clear } = useAuthStore();

	// To restore session on app start-up
	const restoreSession = async () => {
		setStoreLoading(true);
		try {
			const data = await refresh();
			const payload = parseJwt(data.access_token);
			const user = await getUserById(payload.user_id);
			setUser(user);
		} catch (error) {
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
			navigate("/dashboard");
		} catch (error) {
			setError("Invalid email or password");
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
			clear(); // clear state stored in zustand
			navigate("/login");
		} catch (error) {
			clear(); // even on failure, clear cookie and redirect
			navigate("/login");
		} finally {
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

// --------------------------------------------------
// Helper — decode a JWT token without a library
// JWTs are just base64 encoded JSON
// Structure: header.payload.signature
// We only need the payload (middle part)
// --------------------------------------------------
function parseJwt(token: string): { user_id: string; role: string } {
	const base64 = token.split(".")[1]; // get the payload part
	const decoded = atob(base64); // decode base64 to string
	return JSON.parse(decoded); // parse JSON string to object
}

// Helper — check if an error is an Axios error
// so we can safely access err.response
function isAxiosError(err: unknown): err is {
	response?: { data?: { error?: string } };
} {
	return typeof err === "object" && err !== null && "response" in err;
}
