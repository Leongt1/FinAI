import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import Logo from "./Logo";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		// The page itself scrolls (scrollbar at the viewport edge); the sidebar
		// sticks. dvh, not vh: on phones the URL bar overlaps 100vh.
		<div className="min-h-dvh p-3 sm:p-4">
			{/* Mobile top bar */}
			<header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center gap-3 bg-surface border-b border-border px-4 py-3">
				<button
					onClick={() => setIsSidebarOpen(true)}
					aria-label="Open menu"
					className="text-text-muted hover:text-foreground p-1 cursor-pointer"
				>
					<FontAwesomeIcon icon={faBars} className="text-xl" />
				</button>
				<Logo />
			</header>

			{/* Backdrop for mobile drawer */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<div className="flex gap-4 items-start">
				<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

				{/* min-w-0 lets flex children (tables, charts) shrink instead of overflowing */}
				<main className="flex-1 min-w-0 pt-16 lg:pt-0">{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
