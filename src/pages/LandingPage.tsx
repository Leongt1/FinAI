import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faComments,
	faMicrophone,
	faWandMagicSparkles,
	faChartPie,
	faShieldHalved,
	faBolt,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Logo";
import { useAuthStore } from "../store/authStore";

// Public marketing page at "/". Sells the core pitch - logging a transaction is
// so quick (just tell Fin) that you actually stay consistent - and routes to
// signup. Logged-in visitors skip straight to their dashboard.
const LandingPage = () => {
	const user = useAuthStore((s) => s.user);
	if (user) return <Navigate to="/dashboard" replace />;

	return (
		<div className="min-h-dvh bg-background text-foreground">
			{/* Nav */}
			<header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
				<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
					<Logo />
					<div className="flex items-center gap-2 sm:gap-3">
						<Link
							to="/login"
							className="rounded-xl px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-foreground"
						>
							Log in
						</Link>
						<Link
							to="/signup"
							className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-all hover:brightness-95"
						>
							Get started
						</Link>
					</div>
				</nav>
			</header>

			{/* Hero */}
			<section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
							<FontAwesomeIcon icon={faBolt} className="text-accent-glow" />
							Log an expense in seconds
						</span>
						<h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
							Just tell Fin what you spent.
						</h1>
						<p className="mt-5 max-w-lg text-lg text-text-muted">
							Keeping a money tracker up to date is tedious - so most people quit.
							FinAI lets you log a transaction by chatting or speaking, so it stays
							effortless and you actually keep it up.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Link
								to="/signup"
								className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-on-accent transition-all hover:brightness-95"
							>
								Start free <FontAwesomeIcon icon={faArrowRight} />
							</Link>
							<Link
								to="/login"
								className="rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
							>
								Log in
							</Link>
						</div>
						<p className="mt-4 text-sm text-subtle">
							Free to start - 100 AI credits, no card needed.
						</p>
					</div>

					{/* Chat mock */}
					<div className="rounded-3xl border border-border bg-surface p-5 shadow-lg sm:p-6">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-on-accent">
								<FontAwesomeIcon icon={faComments} />
							</span>
							<div>
								<p className="text-sm font-bold leading-tight">Fin</p>
								<p className="text-xs text-text-muted">Your finance assistant</p>
							</div>
						</div>
						<div className="flex flex-col gap-3 pt-4">
							<div className="self-end max-w-[80%] rounded-2xl rounded-tr-sm bg-accent-dim px-4 py-2.5 text-sm">
								add a 250 lunch expense
							</div>
							<div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-2.5 text-sm text-text-muted">
								Done - logged ₹250 under Food for today.
								<span className="mt-2 flex w-fit items-center gap-1 rounded-full border border-income/40 bg-income-bg px-2.5 py-0.5 text-xs text-income">
									✓ Added expense ₹250 - lunch (Food)
								</span>
							</div>
							<div className="self-end max-w-[80%] rounded-2xl rounded-tr-sm bg-accent-dim px-4 py-2.5 text-sm">
								how much did I spend on food this month?
							</div>
							<div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-2.5 text-sm text-text-muted">
								You've spent ₹4,820 on Food this month across 14 transactions.
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
				<div className="mt-10 grid gap-6 sm:grid-cols-3">
					{[
						{
							icon: faMicrophone,
							title: "Say it or type it",
							body: "Tell Fin \"120 for coffee\" by voice or chat - no forms, no dropdowns to hunt through.",
						},
						{
							icon: faWandMagicSparkles,
							title: "Fin logs it",
							body: "It reads the amount, category and date, and records the transaction for you. Behind a month? Paste it all and import in one go.",
						},
						{
							icon: faChartPie,
							title: "See where money goes",
							body: "A live dashboard and budgets show your spending by category, so nothing slips through.",
						},
					].map((step, i) => (
						<div
							key={i}
							className="rounded-3xl border border-border bg-surface p-6 shadow-sm"
						>
							<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-dim text-accent-glow">
								<FontAwesomeIcon icon={step.icon} className="text-lg" />
							</span>
							<h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
							<p className="mt-2 text-sm text-text-muted">{step.body}</p>
						</div>
					))}
				</div>
			</section>

			{/* Trust strip */}
			<section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
					<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dim text-accent-glow">
						<FontAwesomeIcon icon={faShieldHalved} className="text-xl" />
					</span>
					<h2 className="text-xl font-bold sm:text-2xl">Your data stays yours</h2>
					<p className="max-w-xl text-sm text-text-muted">
						FinAI never asks for or stores your bank login. It only records what you
						enter or dictate. Read our{" "}
						<Link to="/privacy" className="font-semibold text-accent-glow hover:underline">
							privacy note
						</Link>
						.
					</p>
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
				<div className="flex flex-col items-center gap-5 rounded-3xl bg-accent px-6 py-12 text-center text-on-accent">
					<h2 className="text-2xl font-bold sm:text-3xl">
						Stop falling behind on your spending
					</h2>
					<p className="max-w-lg text-on-accent/80">
						Start logging the easy way. It takes seconds and it's free to try.
					</p>
					<Link
						to="/signup"
						className="inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 font-semibold text-foreground transition-transform hover:scale-[1.02]"
					>
						Create your account <FontAwesomeIcon icon={faArrowRight} />
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
					<p className="text-xs text-subtle">
						© {new Date().getFullYear()} FinAI
					</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
