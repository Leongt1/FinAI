import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import TitleText from "../../components/TitleText";
import { useUsers } from "../../hooks/useUsers";
import ConfirmDialog from "../../components/ConfirmDialog";
import type { User } from "../../types";
import { useState } from "react";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const { users = [], isLoading, error, deleteUser, isDeleting } = useUsers();

	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-text-muted">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-expense">Something went wrong</p>
			</div>
		);

	if (users.length === 0)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="italic text-subtle">No users found</p>
			</div>
		);

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				<TitleText title="Admin" />
				<div className="flex flex-col gap-2">
					{users.map((u) => (
						<div
							key={u.id}
							className="p-3 bg-surface-raised rounded-xl border border-border flex flex-wrap items-center gap-3 sm:gap-4 hover:border-border-strong transition-colors"
						>
							{/* Avatar + name */}
							<div className="flex items-center flex-1 gap-4 min-w-0">
								<div className="w-10 h-10 rounded-full bg-accent-dim border border-border-strong flex items-center justify-center shrink-0">
									<span className="text-accent-glow font-semibold text-sm">
										{u.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<div className="min-w-0">
									<button
										type="button"
										onClick={() => navigate(`/admin/users/${u.id}`)}
										className="text-accent-glow hover:underline text-sm font-medium cursor-pointer"
									>
										{u.name}
									</button>
									<p className="text-subtle text-xs truncate">{u.email}</p>
								</div>
							</div>

							{/* Role badge */}
							<span
								className={`text-xs px-2 py-0.5 rounded-full border ${
									u.role === "Admin"
										? "text-accent-glow border-accent bg-accent-dim"
										: "text-subtle border-border bg-surface"
								}`}
							>
								{u.role}
							</span>

							{/* Actions */}
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => navigate(`/admin/users/${u.id}`)}
									disabled={isDeleting}
									className="text-text-muted hover:text-accent-glow rounded-xl cursor-pointer px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-border-strong hover:border-border-strong transition-colors"
								>
									View
								</button>
								<button
									type="button"
									onClick={() => setUserToDelete(u)}
									disabled={isDeleting}
									className="text-expense hover:bg-expense-bg rounded-lg cursor-pointer px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-expense"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
			<ConfirmDialog
				isOpen={!!userToDelete}
				title="Delete user?"
				message={`Delete "${userToDelete?.name}"? This will permanently remove the user and all of their data.`}
				isLoading={isDeleting}
				onCancel={() => setUserToDelete(null)}
				onConfirm={() => {
					if (!userToDelete) return;
					deleteUser(userToDelete.id);
					setUserToDelete(null);
				}}
			/>
		</DashboardLayout>
	);
};

export default AdminDashboard;