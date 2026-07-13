// Decode a JWT token without a library.
// JWTs are just base64url encoded JSON: header.payload.signature -
// we only need the payload (middle part).
export function parseJwt(token: string): { user_id: string; role: string } {
	// JWT payloads are base64url encoded - convert to standard base64
	// (replace URL-safe chars, restore padding) before atob
	const base64url = token.split(".")[1]; // get the payload part
	const base64 = base64url
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(base64url.length / 4) * 4, "=");
	const decoded = atob(base64); // decode base64 to string
	return JSON.parse(decoded); // parse JSON string to object
}
