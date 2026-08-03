import DashboardLayout from "../components/DashboardLayout";
import { useAuthStore } from "../store/authStore";
import CalendarInput from "../components/CalendarInput";
import { useState } from "react";
import type { SyntheticEvent, ChangeEvent } from "react";
import { useUser } from "../hooks/useUser";
import TitleText from "../components/TitleText";
import Avatar from "../components/Avatar";
import { toast } from "../store/toastStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

// Avatar is stored on-device (localStorage) per user for now - a server-backed
// version can replace this key without touching the UI.
const avatarKey = (id: string) => `finai-avatar-${id}`;

const inputClass =
	"w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-surface-raised disabled:text-text-muted";

// Resize/crop an uploaded image to a small square JPEG data URI so it stays
// tiny in storage.
const resizeImage = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const size = 256;
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				if (!ctx) return reject(new Error("no canvas context"));
				const scale = Math.max(size / img.width, size / img.height);
				const w = img.width * scale;
				const h = img.height * scale;
				ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
				resolve(canvas.toDataURL("image/jpeg", 0.85));
			};
			img.onerror = () => reject(new Error("invalid image"));
			img.src = reader.result as string;
		};
		reader.onerror = () => reject(new Error("read failed"));
		reader.readAsDataURL(file);
	});

const ProfilePage = () => {
	const { user: currentUser } = useAuthStore();
	const { updateUser, isUpdating } = useUser(currentUser?.id || "");

	const [name, setName] = useState(currentUser?.name || "");
	const [email, setEmail] = useState(currentUser?.email || "");
	const [dateOfBirth, setDateOfBirth] = useState<string | null>(currentUser?.date_of_birth ?? null);
	const [gender, setGender] = useState(currentUser?.gender || "");
	const [avatar, setAvatar] = useState<string | null>(
		currentUser ? localStorage.getItem(avatarKey(currentUser.id)) : null,
	);
	const [isEditing, setIsEditing] = useState(false);

	// sync form + avatar during render when the store user changes
	// (session restore or profile update) instead of via an effect
	const [prevUser, setPrevUser] = useState(currentUser);
	if (currentUser !== prevUser) {
		setPrevUser(currentUser);
		if (currentUser) {
			setName(currentUser.name || "");
			setEmail(currentUser.email || "");
			setDateOfBirth(currentUser.date_of_birth || null);
			setGender(currentUser.gender || "");
			setAvatar(localStorage.getItem(avatarKey(currentUser.id)));
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
			return;
		}
		updateUser(
			{ name, gender, date_of_birth: dateOfBirth },
			{ onSuccess: () => setIsEditing(false) },
		);
	};

	const onPickAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = ""; // allow re-picking the same file
		if (!file || !currentUser) return;
		try {
			const data = await resizeImage(file);
			localStorage.setItem(avatarKey(currentUser.id), data);
			setAvatar(data);
			toast.success("Profile photo updated");
		} catch {
			toast.error("Couldn't read that image - try another file");
		}
	};

	const removeAvatar = () => {
		if (!currentUser) return;
		localStorage.removeItem(avatarKey(currentUser.id));
		setAvatar(null);
	};

	return (
		<DashboardLayout>
			<TitleText title="Profile" />

			<div className="flex flex-col gap-4 max-w-3xl">
				{/* Identity card */}
				<div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-start">
					<div className="relative">
						<Avatar name={currentUser?.name} src={avatar} size={104} className="border border-border" />
						<label
							className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent text-on-accent shadow-card transition hover:brightness-95"
							title="Change photo"
						>
							<FontAwesomeIcon icon={faCamera} className="text-sm" />
							<input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
						</label>
					</div>

					<div className="flex-1 text-center sm:text-left">
						<div className="flex items-center justify-center gap-2 sm:justify-start">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								{currentUser?.name}
							</h2>
							<span className="rounded-full bg-accent-dim px-2 py-0.5 text-xs font-semibold text-foreground">
								{currentUser?.role}
							</span>
						</div>
						<p className="mt-0.5 text-sm text-text-muted">{currentUser?.email}</p>
						{avatar && (
							<button
								onClick={removeAvatar}
								className="mt-2 cursor-pointer text-xs text-expense hover:underline"
							>
								Remove photo
							</button>
						)}
					</div>
				</div>

				{/* Details card */}
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-card"
				>
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-foreground">Personal details</h3>
						{!isEditing && (
							<button
								type="submit"
								className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-foreground cursor-pointer"
							>
								Edit
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1.5 block text-xs font-medium text-text-muted">Full name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={!isEditing || isUpdating}
								autoComplete="name"
								className={inputClass}
							/>
						</div>

						<div>
							<label className="mb-1.5 block text-xs font-medium text-text-muted">
								Email <span className="text-subtle">- can't be changed</span>
							</label>
							<input type="email" value={email} disabled className={inputClass} />
						</div>

						<div>
							<label className="mb-1.5 block text-xs font-medium text-text-muted">Date of birth</label>
							<div className={!isEditing || isUpdating ? "pointer-events-none opacity-70" : ""}>
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

						<div>
							<label className="mb-1.5 block text-xs font-medium text-text-muted">Gender</label>
							<select
								value={gender}
								onChange={(e) => setGender(e.target.value)}
								disabled={!isEditing || isUpdating}
								required
								className={inputClass}
							>
								<option value="">Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>
					</div>

					{isEditing && (
						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={handleCancel}
								disabled={isUpdating}
								className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-foreground cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isUpdating}
								className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition hover:brightness-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isUpdating ? "Saving..." : "Save changes"}
							</button>
						</div>
					)}
				</form>
			</div>
		</DashboardLayout>
	);
};

export default ProfilePage;
