import { useEffect, useState } from "react";
import Logo from "./Logo";

// Shown while data loads. The rotating tips make the wait feel intentional and
// quietly teach the product's core habit (log by chatting, not by forms).
const TIPS = [
	"Just tell the assistant “add 250 lunch” - no forms to fill.",
	"Log expenses as they happen; catching up a month later is the hard part.",
	"Set a budget per category to see exactly where money leaks.",
	"Ask the assistant “how much did I spend on food this month?”",
	"Income shows green, expenses red - scan your whole month at a glance.",
	"You can create a new category straight from the chat.",
];

interface TipsLoaderProps {
	fullscreen?: boolean;
	label?: string;
}

const TipsLoader = ({ fullscreen = false, label = "Getting things ready" }: TipsLoaderProps) => {
	const [i, setI] = useState(() => Math.floor(Math.random() * TIPS.length));

	useEffect(() => {
		const id = setInterval(() => setI((prev) => (prev + 1) % TIPS.length), 3200);
		return () => clearInterval(id);
	}, []);

	return (
		<div
			className={`${
				fullscreen ? "min-h-screen" : "h-full min-h-[280px]"
			} w-full flex flex-col items-center justify-center gap-6 px-6 text-center`}
			role="status"
			aria-live="polite"
		>
			<Logo withWordmark={false} className="scale-125 animate-pulse" />

			<div className="flex flex-col items-center gap-2">
				<p className="font-semibold text-foreground">{label}</p>
				<p key={i} className="max-w-xs text-sm text-text-muted animate-fade-in">
					<span className="font-medium text-foreground">Tip: </span>
					{TIPS[i]}
				</p>
			</div>

			{/* bouncing dots */}
			<div className="flex items-center gap-1.5" aria-hidden="true">
				<span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
				<span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
				<span className="h-2 w-2 rounded-full bg-accent animate-bounce" />
			</div>
		</div>
	);
};

export default TipsLoader;
