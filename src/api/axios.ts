import axios from "axios";

// base instance
const api = axios.create({
	baseURL: "http://localhost:8080/api/v1",
	withCredentials: true, // for sending cookie
});

// REQUEST interceptor
// Runs before EVERY request we make
// We use it to attach the access token to every request automatically
api.interceptors.request.use((config) => {
	// We'll store the token in memory (a plain variable)
	// We import the store lazily to avoid circular dependency issues
	const token = getAccessToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// RESPONSE interceptor
// Runs after EVERY response we get back
// We use it to handle token expiry automatically
api.interceptors.response.use(
	(response) => response,

	async (error) => {
		// silent refresh
		const originalRequest = error.config;

		// If the error is 401 (Unauthorized) and we haven't tried to refresh yet
		// AND it's not a login/signup/refresh attempt (we don't want to refresh on failed credentials)
		const isAuthRequest =
			originalRequest.url?.includes("/auth/login") ||
			originalRequest.url?.includes("/auth/signup") ||
			originalRequest.url?.includes("/auth/refresh");

		if (
			error.response?.status === 401 && // token expired
			!originalRequest._retry &&
			!isAuthRequest
		) {
			originalRequest._retry = true;

			try {
				// Call the refresh endpoint
				// Try to get a new access token using the refresh_token cookie
				const { data } = await axios.post(
					"http://localhost:8080/api/v1/auth/refresh",
					{},
					{ withCredentials: true },
				);

				// Update the token in memory
				setAccessToken(data.access_token);

				// Update the header for the original request
				originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

				// Retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				// If refresh fails, clear the token and redirect to login
				setAccessToken(null);
				window.location.href = "/login";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

// Simple in-memory token storage
// We keep it here instead of localStorage for security (avoids XSS attacks)
let accessToken: string | null = null;

export function getAccessToken() {
	return accessToken;
}

export function setAccessToken(token: string | null) {
	accessToken = token;
}

export default api;
