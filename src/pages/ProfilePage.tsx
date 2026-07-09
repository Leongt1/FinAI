import DashboardLayout from "../components/DashboardLayout";
import { useAuthStore } from "../store/authStore";
import CalendarInput from "../components/CalendarInput";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useUser } from "../hooks/useUser";
import TitleText from "../components/TitleText";

const ProfilePage = () => {
	const { user: currentUser } = useAuthStore();
	const { updateUser, isUpdating } = useUser(currentUser?.id || "");

	const [name, setName] = useState(currentUser?.name || "");
	const [email, setEmail] = useState(currentUser?.email || "");
	const [dateOfBirth, setDateOfBirth] = useState<string | null>(currentUser?.date_of_birth ?? null);
	const [gender, setGender] = useState(currentUser?.gender || "");

	const [isEditing, setIsEditing] = useState(false);

	// sync form state during render when the store user changes
	// (session restore or profile update) instead of via an effect
	const [prevUser, setPrevUser] = useState(currentUser);
	if (currentUser !== prevUser) {
		setPrevUser(currentUser);
		if (currentUser) {
			setName(currentUser.name || "");
			setEmail(currentUser.email || "");
			setDateOfBirth(currentUser.date_of_birth || null);
			setGender(currentUser.gender || "");
		}
	}

	const handleCancel = () => {
		setIsEditing(false);
		if (currentUser) {
			setName(currentUser.name || "");
			setEmail(currentUser.email || "");
			setDateOfBirth(currentUser.date_of_birth || null);
			setGender(currentUser.gender || "");
		}
	};

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		if (!isEditing) {
			setIsEditing(true);
		} else {
			updateUser(
				{
					name,
					gender,
					date_of_birth: dateOfBirth,
				},
				{
					onSuccess() {
						setIsEditing(false);
					},
				},
			);
		}
	};

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
				<TitleText title="Profile" />
				{/* Profile Form */}
				<div className="flex flex-col lg:flex-row gap-4 bg-surface rounded-3xl p-4 sm:p-6 border border-border">
					{/* Left */}
					<form onSubmit={handleSubmit} className="w-full flex-1">
						<div className="flex flex-col w-full gap-4 justify-between rounded-2xl p-4 border border-border">
							<div className="flex flex-col items-start gap-1">
								<p>Full Name:</p>
								<input
									name="fullname"
									onChange={(e) => setName(e.target.value)}
									className={`rounded-xl border border-border text-sm p-3 focus:outline-none focus:ring-1 focus:ring-accent w-full ${!isEditing && "w-1/2 disabled:bg-surface-raised disabled:text-text-muted"}`}
									type="text"
									value={name}
									disabled={!isEditing || isUpdating}
									autoComplete="on"
								/>
							</div>
							<div className="flex flex-col items-start gap-1">
								<p>Email:</p>
								<input
									name="email"
									onChange={(e) => setEmail(e.target.value)}
									className={`rounded-xl border border-border text-sm p-3 focus:outline-none focus:ring-1 focus:ring-accent w-full  disabled:bg-surface-raised disabled:text-text-muted`}
									type="text"
									disabled={true}
									value={email}
									autoComplete="off"
								/>
							</div>
							<div className="flex flex-col items-start w-full gap-1">
								<p>Date of Birth:</p>
								<div
									className={`relative border border-border rounded-xl w-full ${!isEditing || isUpdating ? "pointer-events-none" : "pointer-events-auto"} ${!isEditing && "w-1/2 opacity-70"}`}
								>
									<div
										className={`absolute z-10 w-full h-full bg-surface-raised opacity-40 border-none rounded-xl ${!isEditing || isUpdating ? "block" : "hidden"}`}
									></div>
									<CalendarInput
										date={dateOfBirth}
										setDate={(date: string | null) => {
											if (isEditing && !isUpdating) setDateOfBirth(date);
										}}
										showDropdowns
										placeholder="Select date of birth"
									/>
								</div>
							</div>
							<div className="flex flex-col items-start gap-1">
								<p>Gender:</p>
								<select
									name="gender"
									className={`rounded-xl border border-border text-sm p-3 focus:outline-none focus:ring-1 focus:ring-accent w-full ${!isEditing && "disabled:bg-surface disabled:text-subtle"}`}
									required
									value={gender}
									disabled={!isEditing || isUpdating}
									onChange={(e) =>
										setGender(e.target.value as "Male" | "Female")
									}
								>
									<option className="text-text-muted bg-surface" value="">Select gender</option>
									<option className="text-text-muted bg-surface" value="Male">Male</option>
									<option className="text-text-muted bg-surface" value="Female">Female</option>
								</select>
							</div>
							<div className="flex items-center justify-center gap-4 mt-4">
								<button
									type="submit"
									disabled={isUpdating}
									className={`border w-24 h-10 font-semibold rounded-lg text-sm p-2 px-4 transition-colors duration-300 ${isUpdating ? "bg-accent-dim text-accent-glow opacity-50 cursor-not-allowed border-none" : "text-text-muted hover:bg-surface-raised hover:text-accent-glow border-2 border-border hover:border-border-strong cursor-pointer transition-colors"}`}
								>
									{isUpdating ? "Saving..." : isEditing ? "Save" : "Edit"}
								</button>
								{isEditing && !isUpdating && (
									<button
										type="button"
										onClick={handleCancel}
										className="w-24 h-10 font-semibold text-text-muted hover:bg-surface-raised hover:text-accent-glow border border-border hover:border-border-strong cursor-pointer transition-colors duration-300 rounded-lg text-sm p-2 px-4"
									>
										Cancel
									</button>
								)}
							</div>
						</div>
					</form>

					{/* Right — avatar placeholder, hidden on small screens */}
					<div className="hidden lg:flex flex-col items-center justify-center gap-4 flex-1">
						<div className="w-50 h-50 bg-surface-raised border border-border rounded-2xl"></div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default ProfilePage;
