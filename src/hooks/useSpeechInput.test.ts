import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeechInput } from "./useSpeechInput";

// A minimal fake of the browser SpeechRecognition we can drive from tests.
class FakeRecognition {
	lang = "";
	continuous = false;
	interimResults = false;
	onresult: ((event: unknown) => void) | null = null;
	onerror: ((event: unknown) => void) | null = null;
	onend: (() => void) | null = null;
	start = vi.fn();
	stop = vi.fn(() => this.onend?.());
	abort = vi.fn();

	// helper: simulate the browser emitting a transcript
	emit(chunks: string[]) {
		const results = chunks.map((c) => ({ 0: { transcript: c }, isFinal: true, length: 1 }));
		this.onresult?.({ resultIndex: 0, results: { ...results, length: results.length } });
	}
}

describe("useSpeechInput", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("reports unsupported when the browser has no Speech API", () => {
		vi.stubGlobal("SpeechRecognition", undefined);
		vi.stubGlobal("webkitSpeechRecognition", undefined);

		const { result } = renderHook(() => useSpeechInput({ onResult: vi.fn() }));
		expect(result.current.supported).toBe(false);
	});

	describe("with a Speech API present", () => {
		let instance: FakeRecognition;

		beforeEach(() => {
			vi.stubGlobal(
				"SpeechRecognition",
				vi.fn(function (this: unknown) {
					instance = new FakeRecognition();
					return instance;
				}),
			);
		});

		it("is supported and starts listening", () => {
			const { result } = renderHook(() => useSpeechInput({ onResult: vi.fn() }));
			expect(result.current.supported).toBe(true);

			act(() => result.current.start());
			expect(result.current.listening).toBe(true);
			expect(instance.start).toHaveBeenCalledOnce();
			expect(instance.lang).toBe("en-IN");
		});

		it("passes the full joined transcript to onResult", () => {
			const onResult = vi.fn();
			const { result } = renderHook(() => useSpeechInput({ onResult }));

			act(() => result.current.start());
			act(() => instance.emit(["add a ", "120 coffee expense"]));

			expect(onResult).toHaveBeenCalledWith("add a 120 coffee expense");
		});

		it("stops listening when stop() ends the session", () => {
			const { result } = renderHook(() => useSpeechInput({ onResult: vi.fn() }));

			act(() => result.current.start());
			act(() => result.current.stop());

			expect(instance.stop).toHaveBeenCalledOnce();
			expect(result.current.listening).toBe(false);
		});
	});
});
