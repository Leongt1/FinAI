import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		// app shell: exactly viewport height, never grows - only <main> scrolls
		// (dvh, not vh: on phones the URL bar overlaps 100vh)
		<div className="flex h-dvh overflow-hidden p-3 sm:p-4 gap-4">
			{/* Mobile top bar */}
			<header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center gap-3 bg-surface border-b border-border px-4 py-3">
				<button
					onClick={() => setIsSidebarOpen(true)}
					aria-label="Open menu"
					className="text-text-muted hover:text-accent-glow p-1 cursor-pointer"
				>
					{/* hamburger */}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<line x1="4" y1="6" x2="20" y2="6" />
						<line x1="4" y1="12" x2="20" y2="12" />
						<line x1="4" y1="18" x2="20" y2="18" />
					</svg>
				</button>
				<div>
					<span className="text-accent-glow text-lg font-semibold tracking-widest">Fin</span>
					<span className="text-foreground text-lg font-bold">AI</span>
				</div>
			</header>

			{/* Backdrop for mobile drawer */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			{/* min-w-0 lets flex children (tables, charts) shrink instead of overflowing */}
			<main className="flex-1 min-w-0 overflow-y-auto pt-16 lg:pt-0">{children}</main>
		</div>
	);
};

export default DashboardLayout;
