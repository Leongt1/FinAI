import { describe, expect, it } from "vitest";
import { parseJwt } from "./parseJwt";

// build a fake JWT whose payload uses base64url characters and needs padding
const makeToken = (payload: object) => {
	const json = JSON.stringify(payload);
	const base64url = btoa(json)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, ""); // strip padding like real JWTs do
	return `header.${base64url}.signature`;
};

describe("parseJwt", () => {
	it("decodes a standard payload", () => {
		const token = makeToken({ user_id: "abc-123", role: "User" });
		expect(parseJwt(token)).toEqual({ user_id: "abc-123", role: "User" });
	});

	it("handles base64url characters (- and _) and missing padding", () => {
		// payload chosen so its base64 contains + and / when standard-encoded:
		// "?>" encodes to Pz4, and specific binary-ish strings force +/ chars.
		// We verify indirectly: any payload we craft must round-trip.
		const payloads = [
			{ user_id: "a", role: "Admin" },
			{ user_id: "??>>??>>", role: "User~~~" },
			{ user_id: "éè", role: "User" }, // latin-1 accents survive atob
			{ user_id: "x".repeat(31), role: "User" }, // length that needs padding
		];
		for (const p of payloads) {
			expect(parseJwt(makeToken(p))).toEqual(p);
		}
	});

	it("throws on garbage tokens rather than returning junk", () => {
		expect(() => parseJwt("not-a-jwt")).toThrow();
	});
});
