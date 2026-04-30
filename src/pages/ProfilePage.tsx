import DashboardLayout from "../components/DashboardLayout";
import { useAuthStore } from "../store/authStore";
import CalendarInput from "../components/CalenderInput";
import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import { useUser } from "../hooks/useUsers";

const ProfilePage = () => {
	const { user: currentUser } = useAuthStore();
	const { updateUser, isUpdating } = useUser(currentUser?.id || "");

	const [name, setName] = useState(currentUser?.name || "");
	const [email, setEmail] = useState(currentUser?.email || "");
	const [dateOfBirth, setDateOfBirth] = useState<string | null>(
		currentUser?.date_of_birth || null,
	);
	const [gender, setGender] = useState(currentUser?.gender || "");

	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (currentUser) {
			setName(currentUser.name || "");
			setEmail(currentUser.email || "");
			setDateOfBirth(currentUser.date_of_birth || null);
			setGender(currentUser.gender || "");
		}
	}, [currentUser]);

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
					role: currentUser?.role || "User",
					gender,
					date_of_birth: dateOfBirth ? `${dateOfBirth}T00:00:00Z` : null,
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
				<div className="bg-white rounded-3xl p-6 mb-4 border border-gray-100">
					<h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
				</div>
				{/* Profile Form */}
				<div className="flex gap-4 bg-white rounded-3xl p-6 border border-gray-100">
					{/* Left */}
					<form onSubmit={handleSubmit} className="w-full flex-1">
						<div className="flex flex-col w-full gap-4 justify-between rounded-2xl p-4 border border-gray-200">
							<div className="flex flex-col items-start gap-1">
								<p>Full Name:</p>
								<input
									onChange={(e) => setName(e.target.value)}
									className={`rounded-xl border border-gray-200 text-sm p-3 focus:outline-none focus:ring-1 focus:ring-green-500 w-full ${!isEditing && "w-1/2 disabled:bg-gray-50 disabled:text-gray-400"}`}
									type="text"
									value={name}
									disabled={!isEditing || isUpdating}
								/>
							</div>
							<div className="flex flex-col items-start gap-1">
								<p>Email:</p>
								<input
									onChange={(e) => setEmail(e.target.value)}
									className={`rounded-xl border border-gray-200 text-sm p-3 focus:outline-none focus:ring-1 focus:ring-green-500 w-full ${!isEditing && "w-1/2 disabled:bg-gray-50 disabled:text-gray-400"}`}
									type="text"
									disabled={!isEditing || isUpdating}
									value={email}
								/>
							</div>
							<div className="flex flex-col items-start w-full gap-1">
								<p>Date of Birth:</p>
								<div
									className={`relative border border-gray-200 rounded-xl w-full ${!isEditing || isUpdating ? "pointer-events-none" : "pointer-events-auto"} ${!isEditing && "w-1/2 opacity-70"}`}
								>
									<div
										className={`absolute z-10 w-full h-full bg-gray-200 opacity-40 border-none rounded-xl ${!isEditing || isUpdating ? "block" : "hidden"}`}
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
									className={`rounded-xl border border-gray-200 text-sm p-3 focus:outline-none focus:ring-1 focus:ring-green-500 w-full ${!isEditing && "disabled:bg-gray-50 disabled:text-gray-400"}`}
									required
									value={gender}
									disabled={!isEditing || isUpdating}
									onChange={(e) =>
										setGender(e.target.value as "Male" | "Female")
									}
								>
									<option value="">Select gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>
							<div className="flex items-center justify-center gap-4 mt-4">
								<button
									type="submit"
									disabled={isUpdating}
									className={`border w-24 h-10 font-semibold rounded-lg text-sm p-2 px-4 transition-colors duration-300 ${isUpdating ? "bg-blue-300 text-white cursor-not-allowed border-none" : "text-blue-600 hover:bg-blue-500 hover:text-white border-2 border-blue-200 hover:border-none cursor-pointer"}`}
								>
									{isUpdating ? "Saving..." : isEditing ? "Save" : "Edit"}
								</button>
								{isEditing && !isUpdating && (
									<button
										type="button"
										onClick={handleCancel}
										className="border w-24 h-10 font-semibold text-red-600 hover:bg-red-500 hover:text-white border-2 border-red-200 hover:border-none rounded-lg text-sm p-2 px-4 cursor-pointer transition-colors duration-300"
									>
										Cancel
									</button>
								)}
							</div>
						</div>
					</form>

					{/* Right */}
					<div className="flex flex-col items-center justify-center gap-4 flex-1">
						<div className="w-50 h-50 bg-gray-500"></div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default ProfilePage;
