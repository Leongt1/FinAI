import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	return (
		<div
			className="flex min-h-screen p-4 gap-4"
		>
			<Sidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
};

export default DashboardLayout;
