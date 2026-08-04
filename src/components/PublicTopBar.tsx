import { Link } from "react-router-dom";
import Logo from "./Logo";

interface PublicTopBarProps {
	// tunes the right-side action so it points at the page you're NOT on
	variant?: "landing" | "login" | "signup";
}

// Shared top bar for the public (logged-out) pages - landing, login, signup.
// The logo always links home, so there's always a way back to the landing page.
const PublicTopBar = ({ variant = "landing" }: PublicTopBarProps) => (
	<header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
		<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
			<Link to="/" aria-label="FinAI home" className="transition-opacity hover:opacity-80">
				<Logo />
			</Link>

			<div className="flex items-center gap-1.5 sm:gap-2">
				{/* secondary text link only on the landing page */}
				{variant === "landing" && (
					<Link
						to="/login"
						className="rounded-xl px-3.5 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-foreground"
					>
						Log in
					</Link>
				)}
				{/* one primary action, pointing at the page you're not on */}
				{variant === "signup" ? (
					<Link
						to="/login"
						className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
					>
						Log in
					</Link>
				) : (
					<Link
						to="/signup"
						className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
					>
						Get started
					</Link>
				)}
			</div>
		</nav>
	</header>
);

export default PublicTopBar;
