import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLock } from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Logo";
import PublicTopBar from "../components/PublicTopBar";
import HeroDemo from "../components/landing/HeroDemo";
import TipsLoader from "../components/TipsLoader";
import { useAuthStore } from "../store/authStore";

// What you can actually say to Fin, and what it does - the value shown through
// real phrasings rather than generic feature cards.
const CAPABILITIES: { say: string; does: string }[] = [
	{ say: "add 250 lunch", does: "Logs an expense under the right category, dated today." },
	{
		say: "how much did I spend on food this month?",
		does: "Answers from your own transactions - no digging through screens.",
	},
	{
		say: "paste a month of GPay / bank texts",
		does: "Turns the whole backlog into transactions you review before saving.",
	},
	{
		say: "make a category called Fuel",
		does: "Creates it on the spot, ready to use.",
	},
];

const LandingPage = () => {
	const user = useAuthStore((s) => s.user);
	const isLoading = useAuthStore((s) => s.isLoading);

	// already signed in -> straight to the app
	if (user) return <Navigate to="/dashboard" replace />;
	// a returning visitor's session is still being restored: show the splash
	// rather than flashing the marketing page before redirecting them in
	if (isLoading) return <TipsLoader fullscreen label="Signing you in" />;

	return (
		<div className="min-h-dvh overflow-x-clip bg-bg text-foreground">
			<PublicTopBar variant="landing" />

			{/* Hero - product-led: the demo carries the pitch */}
			<section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
				<div className="min-w-0">
					<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
						<span className="h-1.5 w-1.5 rounded-full bg-accent" />
						Personal finance, minus the data entry
					</span>

					<h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
						Just say it.
						<br />
						<span className="text-text-muted">It&apos;s logged.</span>
					</h1>

					<p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted">
						Tracking money falls apart because entering it is tedious. Tell Fin what
						you spent - by voice or a quick line of chat - and it&apos;s recorded in
						seconds, so you actually keep it up.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Link
							to="/signup"
							className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-on-accent transition-all hover:brightness-95"
						>
							Start free
							<FontAwesomeIcon
								icon={faArrowRight}
								className="transition-transform group-hover:translate-x-0.5"
							/>
						</Link>
						<Link
							to="/login"
							className="rounded-xl border border-border-strong px-6 py-3 font-semibold text-foreground transition-colors hover:bg-surface-raised"
						>
							Log in
						</Link>
					</div>

					<p className="mt-4 text-sm text-subtle">
						Free to start · 100 AI credits · no card needed
					</p>
				</div>

				<HeroDemo />
			</section>

			{/* Catch-up line - speaks to the real pain, product-specific */}
			<section className="border-y border-border bg-surface-raised/60">
				<div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
					<p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
						Already a month behind?{" "}
						<span className="text-text-muted">
							Paste your bank and UPI texts and Fin rebuilds the whole backlog into
							transactions you can check off in one sitting.
						</span>
					</p>
				</div>
			</section>

			{/* What you can say - real phrasings, not generic feature cards */}
			<section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
				<div className="max-w-xl">
					<h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
						Talk to it like a person
					</h2>
					<p className="mt-3 text-text-muted">
						No forms, no dropdowns to hunt through. Here&apos;s the kind of thing you
						can just say.
					</p>
				</div>

				<ul className="mt-10 divide-y divide-border border-y border-border">
					{CAPABILITIES.map((c) => (
						<li
							key={c.say}
							className="grid gap-3 py-5 sm:grid-cols-[minmax(0,20rem)_1fr] sm:items-center sm:gap-8"
						>
							<span className="w-fit rounded-2xl rounded-tl-sm bg-accent-dim px-4 py-2.5 text-sm font-medium text-foreground">
								&ldquo;{c.say}&rdquo;
							</span>
							<span className="text-text-muted">{c.does}</span>
						</li>
					))}
				</ul>
			</section>

			{/* Trust - quiet and honest */}
			<section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
				<div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
					<span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-dim text-accent-glow">
						<FontAwesomeIcon icon={faLock} />
					</span>
					<p className="text-sm leading-relaxed text-text-muted">
						<span className="font-semibold text-foreground">
							Fin never asks for your bank login.
						</span>{" "}
						It only records what you enter or dictate - nothing is pulled from your
						accounts. More in the{" "}
						<Link to="/privacy" className="font-semibold text-accent-glow underline">
							privacy note
						</Link>
						.
					</p>
				</div>
			</section>

			{/* Closing */}
			<section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
				<div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 sm:p-12">
					<h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
						Stop falling behind
						<br />
						<span className="text-accent-glow">on your own money.</span>
					</h2>
					<Link
						to="/signup"
						className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-on-accent transition-all hover:brightness-95"
					>
						Create your account
						<FontAwesomeIcon
							icon={faArrowRight}
							className="transition-transform group-hover:translate-x-0.5"
						/>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
					<Logo />
					<div className="flex items-center gap-5 text-sm text-text-muted">
						<Link to="/privacy" className="hover:text-foreground">
							Privacy
						</Link>
						<Link to="/login" className="hover:text-foreground">
							Log in
						</Link>
						<Link to="/signup" className="hover:text-foreground">
							Sign up
						</Link>
					</div>
					<p className="text-xs text-subtle">© {new Date().getFullYear()} FinAI</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
