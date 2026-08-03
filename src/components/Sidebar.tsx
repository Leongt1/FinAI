import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faArrowRightArrowLeft,
	faWallet,
	faTags,
	faRobot,
	faUser,
	faUsers,
	faRightFromBracket,
	faSun,
	faMoon,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../store/themeStore";
import Logo from "./Logo";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

interface NavItem {
	to: string;
	label: string;
	icon: IconDefinition;
}

const navItems: NavItem[] = [
	{ to: "/dashboard", label: "Dashboard", icon: faHouse },
	{ to: "/transactions", label: "Transactions", icon: faArrowRightArrowLeft },
	{ to: "/budget", label: "Budget", icon: faWallet },
	{ to: "/categories", label: "Categories", icon: faTags },
	{ to: "/assistant", label: "AI Assistant", icon: faRobot },
	{ to: "/profile", label: "Profile", icon: faUser },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const { handleLogout } = useAuth();
	const currentUser = useAuthStore((s) => s.user);
	const { theme, toggleTheme } = useThemeStore();

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		[
			"flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium transition-all cursor-pointer",
			isActive
				? "bg-accent-dim text-foreground font-semibold"
				: "text-text-muted hover:text-foreground hover:bg-surface-raised",
		].join(" ");

	return (
		<div
			className={`w-64 bg-surface border border-border text-foreground flex flex-col p-4 shadow-card
				fixed inset-y-0 left-0 z-50 transform transition-transform duration-200
				${isOpen ? "translate-x-0" : "-translate-x-full"}
				lg:static lg:z-auto lg:translate-x-0 lg:h-full lg:rounded-2xl lg:shrink-0`}
		>
			{/* Logo */}
			<div className="flex items-center justify-between pb-4 mb-3 border-b border-border">
				<Logo />
				<button
					onClick={onClose}
					aria-label="Close menu"
					className="lg:hidden text-text-muted hover:text-foreground p-1 cursor-pointer"
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-1 w-full">
				{navItems.map((item) => (
					<NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
						<FontAwesomeIcon icon={item.icon} className="w-5 text-base" fixedWidth />
						{item.label}
					</NavLink>
				))}
				{currentUser?.role === "Admin" && (
					<NavLink to="/admin/users" className={linkClass} onClick={onClose}>
						<FontAwesomeIcon icon={faUsers} className="w-5 text-base" fixedWidth />
						Users
					</NavLink>
				)}
			</nav>

			{/* Theme toggle + Logout */}
			<div className="mt-auto pt-4 border-t border-border flex flex-col gap-1">
				<button
					onClick={toggleTheme}
					className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-raised transition-all cursor-pointer"
				>
					<FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="w-5 text-base" fixedWidth />
					{theme === "dark" ? "Light mode" : "Dark mode"}
				</button>
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-expense hover:bg-expense-bg transition-all cursor-pointer"
				>
					<FontAwesomeIcon icon={faRightFromBracket} className="w-5 text-base" fixedWidth />
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
