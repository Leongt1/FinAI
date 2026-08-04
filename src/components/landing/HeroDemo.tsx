import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faMicrophone, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// The signature element: a live "you say it, Fin logs it" loop. It types a
// message, shows Fin logging, then reveals the created transaction - cycling
// through a few real examples. Reduced-motion viewers get a static filled state.
type Example = {
	text: string;
	kind: "expense" | "income";
	amount: string;
	category: string;
};

const EXAMPLES: Example[] = [
	{ text: "add 250 lunch", kind: "expense", amount: "250", category: "Food" },
	{ text: "1200 groceries at DMart", kind: "expense", amount: "1,200", category: "Groceries" },
	{ text: "salary 40000 credited", kind: "income", amount: "40,000", category: "Salary" },
	{ text: "89 auto ride home", kind: "expense", amount: "89", category: "Transport" },
];

type Stage = "typing" | "logging" | "done";

const prefersReducedMotion = () =>
	typeof window !== "undefined" &&
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const HeroDemo = () => {
	// reduced-motion viewers get a static completed example (set at init, so the
	// effect never needs a synchronous setState)
	const [reduced] = useState(prefersReducedMotion);
	const [idx, setIdx] = useState(0);
	const [typed, setTyped] = useState(reduced ? EXAMPLES[0].text : "");
	const [stage, setStage] = useState<Stage>(reduced ? "done" : "typing");
	const timers = useRef<number[]>([]);

	useEffect(() => {
		if (reduced) return; // static state already set at init - no looping

		const ex = EXAMPLES[idx];

		// typed/stage start reset (at init for idx 0, and by the advance callback
		// below for later examples), so the effect only schedules async updates -
		// no synchronous setState in the effect body.
		let i = 0;
		const typer = window.setInterval(() => {
			i += 1;
			setTyped(ex.text.slice(0, i));
			if (i >= ex.text.length) {
				window.clearInterval(typer);
				timers.current.push(window.setTimeout(() => setStage("logging"), 400));
				timers.current.push(window.setTimeout(() => setStage("done"), 1150));
				timers.current.push(
					window.setTimeout(() => {
						setTyped("");
						setStage("typing");
						setIdx((n) => (n + 1) % EXAMPLES.length);
					}, 3400),
				);
			}
		}, 65);
		timers.current = [typer];

		return () => {
			window.clearInterval(typer);
			timers.current.forEach(clearTimeout);
		};
	}, [idx, reduced]);

	const ex = EXAMPLES[idx];
	const isIncome = ex.kind === "income";

	return (
		<div className="relative min-w-0">
			{/* soft lime halo behind the panel */}
			<div
				aria-hidden="true"
				className="absolute -inset-2 -z-10 rounded-[2rem] bg-accent/25 blur-2xl"
			/>
			<div className="rounded-3xl border border-border bg-surface p-4 shadow-pop sm:p-5">
				{/* Fin header */}
				<div className="flex items-center gap-3 border-b border-border pb-3">
					<span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-on-accent">
						<FontAwesomeIcon icon={faRobot} />
					</span>
					<div className="leading-tight">
						<p className="text-sm font-semibold text-foreground">Fin</p>
						<p className="text-xs text-text-muted">logs it while you talk</p>
					</div>
					<span className="ml-auto flex items-center gap-1.5 rounded-full bg-surface-raised px-2.5 py-1 text-xs text-text-muted">
						<FontAwesomeIcon icon={faMicrophone} className="text-accent-glow" />
						voice or chat
					</span>
				</div>

				{/* conversation - fixed height so the layout doesn't jump between examples */}
				<div className="flex min-h-[188px] flex-col gap-3 pt-4">
					{/* user message being typed */}
					<div className="self-end max-w-[85%] rounded-2xl rounded-tr-sm bg-accent-dim px-4 py-2.5 text-sm text-foreground">
						{typed}
						{stage === "typing" && (
							<span className="ml-0.5 inline-block h-4 w-0.5 -translate-y-0.5 bg-foreground align-middle animate-blink" />
						)}
					</div>

					{/* Fin's response */}
					{stage === "logging" && (
						<div className="self-start rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-2.5 text-sm text-subtle">
							<span className="animate-pulse">Logging that for you…</span>
						</div>
					)}

					{stage === "done" && (
						<div
							key={idx}
							className="flex max-w-[90%] flex-col gap-2 self-start animate-rise-in"
						>
							<div className="rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-2.5 text-sm text-text-muted">
								Done - added to your {ex.category.toLowerCase()}.
							</div>
							{/* the created transaction row */}
							<div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
								<div className="flex items-center gap-2">
									<FontAwesomeIcon
										icon={faCircleCheck}
										className={isIncome ? "text-income" : "text-expense"}
									/>
									<span className="text-sm font-medium text-foreground">
										{ex.category}
									</span>
								</div>
								<span
									className={`text-sm font-semibold tabular-nums ${
										isIncome ? "text-income" : "text-expense"
									}`}
								>
									{isIncome ? "+" : "-"}₹{ex.amount}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default HeroDemo;
