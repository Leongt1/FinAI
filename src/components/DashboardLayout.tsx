import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	return (
		<div
			className="flex min-h-screen bg-gray-50 p-4 gap-4"
			style={{ backgroundImage: `url(/background_image.png)` }}
		>
			<Sidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
};

export default DashboardLayout;
