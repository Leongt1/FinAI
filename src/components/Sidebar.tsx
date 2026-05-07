import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
	const { handleLogout } = useAuth();
	const currentUser = useAuthStore((s) => s.user);

	const navLinkClass = ({ isActive }: { isActive: boolean }) => {
		return isActive
			? "flex items-center p-3 m-1 rounded-xl w-full bg-accent-dim border border-border-strong text-accent-glow transition-colors cursor-pointer"
			: "flex items-center p-3 m-1 rounded-xl w-full text-muted hover:text-foreground hover:bg-surface-raised transition-all cursor-pointer";
	};

	return (
		<div className="w-64 bg-surface border border-border text-foreground min-h-screen rounded-2xl flex flex-col items-start p-4 mr-4">
			{/* Logo */}
			<div className="border-b-2 border-border pb-4 mb-4 w-full px-2">
				<span className="text-accent-glow text-2xl font-semibold tracking-widest uppercase">Fin</span>
				<span className="text-foreground text-2xl font-bold">AI</span>
			</div>

			{/* Navigation links */}
			<nav className="flex flex-col gap-3 items-center w-full">
				<NavLink to={"/dashboard"} className={navLinkClass}>
					Dashboard
				</NavLink>
				<NavLink to={"/transactions"} className={navLinkClass}>
					Transactions
				</NavLink>
				<NavLink to="/budget" className={navLinkClass}>
					Budget
				</NavLink>
				<NavLink to="/categories" className={navLinkClass}>
					Categories
				</NavLink>
				<NavLink to="/profile" className={navLinkClass}>
					Profile
				</NavLink>
				{currentUser?.role === "Admin" && (
					<NavLink to={"/admin/users"} className={navLinkClass}>
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
