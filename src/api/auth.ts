import type { LoginRequest, LoginResponse, SignupRequest } from "../types";
import api, { setAccessToken } from "./axios";

// POST /auth/login
// We get back the access token in the response body
// The refresh token is set automatically as an HttpOnly cookie by the backend
export const login = async (input: LoginRequest): Promise<LoginResponse> => {
	const { data } = await api.post<LoginResponse>("/auth/login", input);
	// store access token in memory
	setAccessToken(data.access_token);
	return data;
};

// POST /auth/signup
// No token returned — user has to login after signup
export const signup = async (input: SignupRequest): Promise<void> => {
	await api.post("/auth/signup", input);
};

// POST /auth/logout
// Again no body needed — cookie is sent automatically
// We clear the token from memory regardless of whether the request succeeds
export const logout = async (): Promise<void> => {
	await api.post("/auth/logout");
	setAccessToken(null);
};

// POST /auth/refresh
// No request body needed — the browser sends the cookie automatically
// because of withCredentials: true in our axios instance
export const refresh = async (): Promise<LoginResponse> => {
	const { data } = await api.post("/auth/refresh");
	setAccessToken(data.access_token);
	return data;
};

export const forgotPassword = async (email: string): Promise<string> => {
	const { data} = await api.post<string>("/auth/forgot-password", { email });
	return data;
};

export const resetPassword = async (token: string, password: string, confirm_password: string): Promise<string> => {
	const { data } = await api.post<string>(`/auth/reset-password?token=${token}`, {
		password,
		confirm_password: confirm_password,
	});
	return data;
};