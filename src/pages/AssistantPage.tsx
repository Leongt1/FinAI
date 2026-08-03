import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../components/DashboardLayout";
import { useAI } from "../hooks/useAI";
import type { AIChatTurn } from "../types";

interface DisplayMessage {
	role: "user" | "assistant";
	content: string;
	actions?: string[];
	failed?: boolean;
}

const WELCOME =
	"Hi, I'm Fin - your finance assistant. Tell me what you spent and I'll log it " +
	'(try "add a 250 lunch expense"), create categories, or answer questions about ' +
	'your spending ("how much did I spend this month?").';

// Fin's little avatar, shown beside each of its messages.
const FinAvatar = () => (
	<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
		<FontAwesomeIcon icon={faRobot} className="text-sm" />
	</span>
);

const AssistantPage = () => {
	const { credits, isLoadingCredits, sendMessage, isThinking } = useAI();
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [draft, setDraft] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isThinking]);

	const isUnlimited = credits !== undefined && credits < 0;
	const outOfCredits = credits === 0;

	const handleSend = async () => {
		const message = draft.trim();
		if (!message || isThinking || outOfCredits) return;

		// history = everything said so far (successful turns only)
		const history: AIChatTurn[] = messages
			.filter((m) => !m.failed)
			.map((m) => ({ role: m.role, content: m.content }));

		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setDraft("");

		try {
			const res = await sendMessage({ message, history });
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: res.reply, actions: res.actions },
			]);
		} catch {
			// error toast comes from the hook; keep an inline trace too
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Sorry - that didn't go through. Your credit wasn't spent if I was unreachable.",
					failed: true,
				},
			]);
		}
	};

	return (
		<DashboardLayout>
			{/* Chat fills the viewport: header + scrolling conversation + pinned composer */}
			<div className="flex flex-col h-[calc(100dvh-5.5rem)] lg:h-[calc(100dvh-2rem)]">
				{/* Header */}
				<div className="flex items-center justify-between gap-3 pb-4 border-b border-border shrink-0">
					<div className="flex items-center gap-3">
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-on-accent">
							<FontAwesomeIcon icon={faRobot} />
						</span>
						<div>
							<h1 className="text-lg font-bold leading-tight text-foreground">Fin</h1>
							<p className="text-xs text-text-muted">Your finance assistant</p>
						</div>
					</div>
					<span
						className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
							outOfCredits
								? "border-expense bg-expense-bg text-expense"
								: "border-border bg-surface-raised text-text-muted"
						}`}
					>
						{isLoadingCredits
							? "…"
							: isUnlimited
								? "Unlimited"
								: `${credits ?? 0} credit${credits === 1 ? "" : "s"} left`}
					</span>
				</div>

				{/* Conversation */}
				<div className="flex-1 min-h-0 overflow-y-auto py-6">
					<div className="mx-auto flex max-w-3xl flex-col gap-6 px-1">
						{/* Fin's greeting */}
						<div className="flex items-start gap-3">
							<FinAvatar />
							<div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-3 text-sm text-text-muted">
								{WELCOME}
							</div>
						</div>

						{messages.map((m, i) =>
							m.role === "user" ? (
								<div key={i} className="flex justify-end">
									<div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-accent-dim px-4 py-3 text-sm text-foreground">
										{m.content}
									</div>
								</div>
							) : (
								<div key={i} className="flex items-start gap-3">
									<FinAvatar />
									<div className="flex max-w-[85%] flex-col gap-2">
										<div
											className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm whitespace-pre-wrap ${
												m.failed
													? "border border-expense text-expense"
													: "bg-surface-raised text-text-muted"
											}`}
										>
											{m.content}
										</div>
										{m.actions && m.actions.length > 0 && (
											<div className="flex flex-col gap-1">
												{m.actions.map((action, j) => (
													<span
														key={j}
														className="self-start rounded-full border border-income/40 bg-income-bg px-3 py-1 text-xs text-income"
													>
														✓ {action}
													</span>
												))}
											</div>
										)}
									</div>
								</div>
							),
						)}

						{isThinking && (
							<div className="flex items-start gap-3">
								<FinAvatar />
								<div className="rounded-2xl rounded-tl-sm bg-surface-raised px-4 py-3 text-sm text-subtle animate-pulse">
									Fin is thinking…
								</div>
							</div>
						)}
						<div ref={bottomRef} />
					</div>
				</div>

				{/* Composer - pinned to the bottom of the screen */}
				<div className="shrink-0 border-t border-border pt-3">
					<div className="mx-auto flex max-w-3xl gap-2">
						<input
							type="text"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSend();
							}}
							disabled={outOfCredits || isThinking}
							placeholder={outOfCredits ? "You're out of credits" : "Message Fin…"}
							className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
						<button
							onClick={handleSend}
							disabled={outOfCredits || isThinking || !draft.trim()}
							className="rounded-2xl bg-accent px-6 font-semibold text-on-accent transition-all hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							Send
						</button>
					</div>
					{outOfCredits && (
						<p className="mx-auto mt-2 max-w-3xl text-xs text-expense">
							You&apos;ve used your launch credits - more coming soon.
						</p>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default AssistantPage;
