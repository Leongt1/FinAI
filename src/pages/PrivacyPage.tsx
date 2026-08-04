import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Logo";

// Short, honest privacy note. FinAI handles financial data the user types or
// dictates - it never touches bank credentials - so this states that plainly.
// A full legal Terms of Service can wait until money changes hands.
const PrivacyPage = () => {
	const sections: { heading: string; body: string }[] = [
		{
			heading: "What we store",
			body: "Only what you give us: your account details (name, email) and the transactions, categories and budgets you enter or dictate. That's it.",
		},
		{
			heading: "What we never ask for",
			body: "We never ask for or store your bank login, card numbers, or UPI PIN. FinAI has no access to your bank accounts - you tell it what you spent, or paste text you already have.",
		},
		{
			heading: "The AI assistant",
			body: "When you chat with Fin or import pasted text, that text is sent to our AI provider (OpenAI) to extract the transaction details. Don't paste anything you wouldn't want processed this way, such as full card numbers or passwords.",
		},
		{
			heading: "Your control",
			body: "You can edit or delete any transaction, category or budget at any time from your account. Deleting a transaction removes it from your data.",
		},
		{
			heading: "Security",
			body: "Your password is stored hashed, never in plain text, and access to your data requires you to be logged in. Every request is scoped to your own account.",
		},
		{
			heading: "Questions",
			body: "This is an early product and this note will grow as it does. For anything privacy-related, reach out to the account you signed up through.",
		},
	];

	return (
		<div className="min-h-dvh bg-background text-foreground">
			<header className="border-b border-border">
				<div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
					<Link to="/">
						<Logo />
					</Link>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-foreground"
					>
						<FontAwesomeIcon icon={faArrowLeft} /> Home
					</Link>
				</div>
			</header>

			<main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
				<h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
				<p className="mt-3 text-text-muted">
					FinAI is a personal finance tracker. Here's how it handles your data, in
					plain language.
				</p>

				<div className="mt-10 flex flex-col gap-8">
					{sections.map((s) => (
						<section key={s.heading}>
							<h2 className="text-lg font-semibold">{s.heading}</h2>
							<p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
						</section>
					))}
				</div>

				<div className="mt-12 border-t border-border pt-6">
					<Link
						to="/signup"
						className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-on-accent transition-all hover:brightness-95"
					>
						Get started
					</Link>
				</div>
			</main>
		</div>
	);
};

export default PrivacyPage;
