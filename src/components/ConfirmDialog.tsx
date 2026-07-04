type ConfirmDialogProps = {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	isLoading?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const ConfirmDialog = ({
	isOpen,
	title,
	message,
	confirmText = "Delete",
	isLoading = false,
	onCancel,
	onConfirm,
}: ConfirmDialogProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<h2 className="text-lg font-semibold text-text-muted">{title}</h2>
				<p className="mt-2 text-sm text-subtle">{message}</p>

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="rounded-xl border border-border p-2 text-text-muted transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="rounded-xl border border-expense p-2 text-expense transition-colors hover:bg-expense-bg disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? "Deleting..." : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
