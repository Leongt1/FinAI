import { useCallback, useEffect, useRef, useState } from "react";

// The Web Speech API is not in the standard TS DOM lib, so we declare the thin
// slice we use. It ships in Chrome/Edge (as webkitSpeechRecognition); Firefox
// and most of Safari don't have it, which is why we feature-detect below.
interface SpeechRecognitionResult {
	readonly isFinal: boolean;
	readonly length: number;
	item(index: number): { transcript: string };
	[index: number]: { transcript: string };
}

interface SpeechRecognitionResultList {
	readonly length: number;
	item(index: number): SpeechRecognitionResult;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
	readonly resultIndex: number;
	readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
	readonly error: string;
}

interface SpeechRecognitionInstance {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	start(): void;
	stop(): void;
	abort(): void;
	onresult: ((event: SpeechRecognitionEvent) => void) | null;
	onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
	onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface SpeechWindow {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const getRecognitionCtor = (): SpeechRecognitionConstructor | undefined => {
	if (typeof window === "undefined") return undefined;
	const w = window as unknown as SpeechWindow;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

interface UseSpeechInputOptions {
	lang?: string;
	// Called on every recognition update with the full transcript of the current
	// listening session (final results + the in-progress interim chunk).
	onResult: (transcript: string) => void;
}

interface UseSpeechInput {
	// false when the browser has no Speech API - callers should hide the mic.
	supported: boolean;
	listening: boolean;
	// human-readable reason the last attempt failed (e.g. mic permission denied)
	error: string | null;
	start: () => void;
	stop: () => void;
}

// Wraps the browser SpeechRecognition so the assistant can dictate into its
// composer. No server, no dependency - just the built-in API. Default locale is
// en-IN to bias toward Indian-English amounts/merchants.
export const useSpeechInput = ({ lang = "en-IN", onResult }: UseSpeechInputOptions): UseSpeechInput => {
	const [supported] = useState(() => getRecognitionCtor() !== undefined);
	const [listening, setListening] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
	// keep the latest callback without re-creating the recognition instance
	const onResultRef = useRef(onResult);
	useEffect(() => {
		onResultRef.current = onResult;
	}, [onResult]);

	const stop = useCallback(() => {
		recognitionRef.current?.stop();
	}, []);

	const start = useCallback(() => {
		const Ctor = getRecognitionCtor();
		if (!Ctor || recognitionRef.current) return;

		const recognition = new Ctor();
		recognition.lang = lang;
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onresult = (event) => {
			let transcript = "";
			for (let i = 0; i < event.results.length; i++) {
				transcript += event.results[i][0].transcript;
			}
			onResultRef.current(transcript.trim());
		};

		recognition.onerror = (event) => {
			// "no-speech"/"aborted" are benign stops; surface the rest.
			if (event.error !== "no-speech" && event.error !== "aborted") {
				setError(
					event.error === "not-allowed"
						? "Microphone access was blocked. Allow it in your browser to dictate."
						: "Voice input hit a problem. Please try again.",
				);
			}
		};

		recognition.onend = () => {
			setListening(false);
			recognitionRef.current = null;
		};

		recognitionRef.current = recognition;
		setError(null);
		try {
			recognition.start();
			setListening(true);
		} catch {
			// start() throws if called while already active - reset defensively.
			recognitionRef.current = null;
			setListening(false);
		}
	}, [lang]);

	// stop listening if the component using the hook unmounts mid-session
	useEffect(() => {
		return () => recognitionRef.current?.abort();
	}, []);

	return { supported, listening, error, start, stop };
};
