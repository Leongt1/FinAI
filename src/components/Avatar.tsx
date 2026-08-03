interface AvatarProps {
	name?: string;
	src?: string | null;
	size?: number; // px
	className?: string;
}

const initials = (name?: string) => {
	if (!name) return "?";
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
	return (first + second).toUpperCase() || "?";
};

// Circular avatar: shows the image if given, otherwise the person's initials on
// a soft accent tile.
const Avatar = ({ name, src, size = 96, className = "" }: AvatarProps) => (
	<span
		className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-dim font-semibold text-foreground select-none ${className}`}
		style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
	>
		{src ? (
			<img src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />
		) : (
			initials(name)
		)}
	</span>
);

export default Avatar;
