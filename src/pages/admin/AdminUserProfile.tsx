import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useUser } from "../../hooks/useUser";

const Field = ({ label, value }: { label: string; value: string }) => (
	<div className="flex flex-col items-start gap-1">
		<p className="text-subtle text-xs uppercase tracking-wider">{label}</p>
		<p className="text-text-muted text-sm p-3 rounded-xl border border-border w-full bg-surface-raised">
			{value}
		</p>
	</div>
);

const AdminUserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user, isLoading, error } = useUser(id || "");

	if (isLoading)
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-full">
					<p className="text-text-muted text-sm">Loading...</p>
				</div>
			</DashboardLayout>
		);

	if (error || !user)
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-full">
					<p className="text-expense text-sm">User not found.</p>
				</div>
			</DashboardLayout>
		);

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
				<div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
					<button
						type="button"
						onClick={() => navigate("/admin/users")}
						className="text-text-muted hover:text-accent-glow text-sm cursor-pointer transition-colors"
					>
						← Back
					</button>
					<h1 className="text-2xl font-semibold text-text-muted">User Profile</h1>
				</div>

				<div className="flex gap-6 bg-surface rounded-3xl p-6 border border-border">
					{/* Left — fields */}
					<div className="flex-1">
						<div className="flex flex-col gap-4 rounded-2xl p-4 border border-border">
							<Field label="Full Name" value={user.name} />
							<Field label="Email" value={user.email} />
							<Field label="Role" value={user.role} />
							<Field label="Gender" value={user.gender} />
							<Field
								label="Date of Birth"
								value={
									user.date_of_birth
										? new Date(user.date_of_birth).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})
										: "—"
								}
							/>
							<Field
								label="Member Since"
								value={new Date(user.created_at).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							/>
						</div>
					</div>

					{/* Right — avatar + badge */}
					<div className="flex flex-col items-center justify-center gap-4 flex-1">
						<div className="w-24 h-24 rounded-full bg-accent-dim flex items-center justify-center border border-border-strong">
							<span className="text-4xl font-bold text-accent-glow">
								{user.name.charAt(0).toUpperCase()}
							</span>
						</div>
						<p className="text-foreground font-semibold">{user.name}</p>
						<span
							className={`text-xs px-3 py-1 rounded-full border ${
								user.role === "Admin"
									? "text-accent-glow border-accent bg-accent-dim"
									: "text-text-muted border-border bg-surface-raised"
							}`}
						>
							{user.role}
						</span>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default AdminUserProfile;