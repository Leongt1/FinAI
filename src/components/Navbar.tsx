import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
	const navigate = useNavigate();
	const currentUser = useAuthStore((s) => s.user);
	const { handleLogout } = useAuth();

	const navLinkClass = ({ isActive }: { isActive: boolean }) => {
		return isActive
			? "text-green-500 font-semibold"
			: "text-gray-600 hover:text-gray-900 transition-colors cursor-pointer";
	};

	return (
		<nav className="flex justify-between items-center p-6 px-8 bg-black/10 backdrop-blur-sm rounded-3xl">
			{/* Left links */}
			<div className="flex items-center gap-3 text-3xl font-bold">
				{/* <img src="/logo.png" alt="" className="w-55 h-40" /> */}
				<h1>FinAI</h1>
			</div>

			{/* Middle links */}
			<div className="flex items-center gap-6 px-4">
				<NavLink to={"/dashboard"} className={navLinkClass}>
					Dashboard
				</NavLink>
				<NavLink to={"/transactions"} className={navLinkClass}>
					Transactions
				</NavLink>
				{currentUser?.role === "Admin" && (
					<NavLink to={"/admin/users"} className={navLinkClass}>
						Users
					</NavLink>
				)}
			</div>

			{/* Right links */}
			<div className="flex items-center gap-4">
				<button
					className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
					onClick={() => navigate(`/profile/${currentUser?.id}`)}
				>
					Profile
				</button>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
