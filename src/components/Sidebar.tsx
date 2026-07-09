import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const { handleLogout } = useAuth();
	const currentUser = useAuthStore((s) => s.user);

	const navLinkClass = ({ isActive }: { isActive: boolean }) => {
		return isActive
			? "flex items-center p-3 m-1 rounded-xl w-full bg-accent-dim border border-border-strong text-accent-glow transition-colors cursor-pointer"
			: "flex items-center p-3 m-1 rounded-xl w-full text-text-muted hover:text-foreground hover:bg-surface-raised transition-all cursor-pointer";
	};

	return (
		<div
			className={`w-64 bg-surface border border-border text-foreground flex flex-col items-start p-4
				fixed inset-y-0 left-0 z-50 transform transition-transform duration-200
				${isOpen ? "translate-x-0" : "-translate-x-full"}
				lg:static lg:z-auto lg:translate-x-0 lg:h-full lg:rounded-2xl lg:shrink-0`}
		>
			{/* Logo */}
			<div className="border-b-2 border-border pb-4 mb-4 w-full px-2 flex items-center justify-between">
				<div>
					<span className="text-accent-glow text-2xl font-semibold tracking-widest uppercase">Fin</span>
					<span className="text-foreground text-2xl font-bold">AI</span>
				</div>
				{/* Close button — mobile drawer only */}
				<button
					onClick={onClose}
					aria-label="Close menu"
					className="lg:hidden text-text-muted hover:text-accent-glow p-1 cursor-pointer"
				>
					✕
				</button>
			</div>

			{/* Navigation links */}
			<nav className="flex flex-col gap-3 items-center w-full">
				<NavLink to={"/dashboard"} className={navLinkClass} onClick={onClose}>
					Dashboard
				</NavLink>
				<NavLink to={"/transactions"} className={navLinkClass} onClick={onClose}>
					Transactions
				</NavLink>
				<NavLink to="/budget" className={navLinkClass} onClick={onClose}>
					Budget
				</NavLink>
				<NavLink to="/categories" className={navLinkClass} onClick={onClose}>
					Categories
				</NavLink>
				<NavLink to="/profile" className={navLinkClass} onClick={onClose}>
					Profile
				</NavLink>
				{currentUser?.role === "Admin" && (
					<NavLink to={"/admin/users"} className={navLinkClass} onClick={onClose}>
						Users
					</NavLink>
				)}
			</nav>

			{/* Logout button */}
			<div className="mt-auto border-t-2 border-border pt-4 w-full">
				<button
					onClick={handleLogout}
					className="w-full p-3 m-1 rounded-xl text-expense hover:bg-expense-bg border border-transparent hover:border-expense/30 transition-all font-medium cursor-pointer"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
