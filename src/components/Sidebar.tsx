import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
	const { handleLogout } = useAuth();
	const currentUser = useAuthStore((s) => s.user);

	const navLinkClass = ({ isActive }: { isActive: boolean }) => {
		return isActive
			? "p-4 m-2 rounded-2xl w-full bg-green-100 border-1 border-green-500 text-green-600 font-semibold"
			: "p-4 m-2 rounded-2xl w-full text-black hover:text-green-600 transition-colors cursor-pointer";
	};

	return (
		<div className="w-64 bg-white text-black min-h-screen rounded-2xl flex flex-col items-start p-4 mr-4">
			{/* Logo */}
			<div className="border-b border-gray-100 pb-4 mb-4">
				<h1 className="text-2xl font-bold">FinAI</h1>
			</div>

			{/* Navigation links */}
			<nav className="flex flex-col items-center w-full">
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
			<div className="mt-auto border-t border-gray-100 pt-4 w-full flex items-center">
				<button
					onClick={handleLogout}
					className="p-4 m-2 rounded-2xl w-full bg-red-50 border-1 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer text-center"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
