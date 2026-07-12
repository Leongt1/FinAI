import { useToastStore } from "../store/toastStore";
import type { ToastType } from "../store/toastStore";

const typeStyles: Record<ToastType, string> = {
	success: "border-income text-income bg-income-bg",
	error: "border-expense text-expense bg-expense-bg",
	warning: "border-warning text-warning bg-warning-bg",
};

const ToastContainer = () => {
	const { toasts, dismiss } = useToastStore();

	if (toasts.length === 0) return null;

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 px-4 w-full max-w-md pointer-events-none">
			{toasts.map((t) => (
				<button
					key={t.id}
					onClick={() => dismiss(t.id)}
					className={`pointer-events-auto w-full text-left text-sm font-medium border rounded-2xl px-4 py-3 shadow-lg cursor-pointer animate-toast-in ${typeStyles[t.type]}`}
				>
					{t.message}
				</button>
			))}
		</div>
	);
};

export default ToastContainer;
