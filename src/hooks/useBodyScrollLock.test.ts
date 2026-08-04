import { describe, expect, it, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBodyScrollLock } from "./useBodyScrollLock";

describe("useBodyScrollLock", () => {
	afterEach(() => {
		document.body.style.overflow = "";
	});

	it("does nothing while inactive", () => {
		renderHook(() => useBodyScrollLock(false));
		expect(document.body.style.overflow).toBe("");
	});

	it("locks body scroll while active and restores on unmount", () => {
		const { unmount } = renderHook(() => useBodyScrollLock(true));
		expect(document.body.style.overflow).toBe("hidden");
		unmount();
		expect(document.body.style.overflow).toBe("");
	});

	it("keeps the lock until the last of several overlays closes", () => {
		const a = renderHook(() => useBodyScrollLock(true));
		const b = renderHook(() => useBodyScrollLock(true));
		expect(document.body.style.overflow).toBe("hidden");

		a.unmount();
		expect(document.body.style.overflow).toBe("hidden"); // b still open

		b.unmount();
		expect(document.body.style.overflow).toBe(""); // all closed
	});

	it("restores the pre-existing overflow value, not a blanket reset", () => {
		document.body.style.overflow = "scroll";
		const { unmount } = renderHook(() => useBodyScrollLock(true));
		expect(document.body.style.overflow).toBe("hidden");
		unmount();
		expect(document.body.style.overflow).toBe("scroll");
	});
});
