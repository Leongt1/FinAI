import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TitleText from "../components/TitleText";
import { useAI } from "../hooks/useAI";
import type { AIChatTurn } from "../types";

interface DisplayMessage {
	role: "user" | "assistant";
	content: string;
	actions?: string[];
	failed?: boolean;
}

const WELCOME =
	"Hi! I'm your FinAI assistant. I can record expenses and income for you " +
	'("add a 250 lunch expense"), create categories, and answer questions ' +
	'about your spending ("how much did I spend this month?"). Each message ' +
	"costs one credit.";

const AssistantPage = () => {
	const { credits, isLoadingCredits, sendMessage, isThinking } = useAI();
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [draft, setDraft] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isThinking]);

	// admins get a sentinel negative balance from the API meaning unlimited
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
					content: "Sorry - that didn't go through. Your credit was not wasted if the assistant was unreachable.",
					failed: true,
				},
			]);
		}
	};

	return (
		<DashboardLayout>
			<div className="w-full h-full flex flex-col">
				<div className="flex items-start justify-between gap-4">
					<TitleText title="AI Assistant" />
					<span
						className={`text-sm px-3 py-1.5 rounded-full border whitespace-nowrap ${
							outOfCredits
								? "text-expense border-expense bg-expense-bg"
								: "text-accent-glow border-border-strong bg-surface-raised"
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
				<div className="flex-1 min-h-0 bg-surface border border-border rounded-3xl p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto mb-4">
					<div className="max-w-[85%] sm:max-w-[70%] self-start bg-surface-raised border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-text-muted">
						{WELCOME}
					</div>

					{messages.map((m, i) =>
						m.role === "user" ? (
							<div
								key={i}
								className="max-w-[85%] sm:max-w-[70%] self-end bg-accent-dim text-accent-glow border border-border-strong rounded-2xl rounded-tr-sm px-4 py-3 text-sm"
							>
								{m.content}
							</div>
						) : (
							<div key={i} className="max-w-[85%] sm:max-w-[70%] self-start flex flex-col gap-2">
								<div
									className={`bg-surface-raised border rounded-2xl rounded-tl-sm px-4 py-3 text-sm whitespace-pre-wrap ${
										m.failed ? "border-expense text-expense" : "border-border text-text-muted"
									}`}
								>
									{m.content}
								</div>
								{m.actions && m.actions.length > 0 && (
									<div className="flex flex-col gap-1">
										{m.actions.map((action, j) => (
											<span
												key={j}
												className="text-xs text-income bg-income-bg border border-income/40 rounded-full px-3 py-1 self-start"
											>
												✓ {action}
											</span>
										))}
									</div>
								)}
							</div>
						),
					)}

					{isThinking && (
						<div className="max-w-[70%] self-start bg-surface-raised border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-subtle animate-pulse">
							Thinking…
						</div>
					)}
					<div ref={bottomRef} />
				</div>

				{/* Composer */}
				<div className="flex gap-2">
					<input
						type="text"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSend();
						}}
						disabled={outOfCredits || isThinking}
						placeholder={
							outOfCredits
								? "You're out of credits"
								: 'Ask anything - e.g. "add a 120 coffee expense"'
						}
						className="flex-1 bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-border-strong disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<button
						onClick={handleSend}
						disabled={outOfCredits || isThinking || !draft.trim()}
						className="bg-accent text-accent-glow rounded-2xl px-6 font-semibold hover:bg-accent-glow hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Send
					</button>
				</div>
				{outOfCredits && (
					<p className="text-xs text-expense mt-2">
						You&apos;ve used your launch credits - more coming soon.
					</p>
				)}
			</div>
		</DashboardLayout>
	);
};

export default AssistantPage;
