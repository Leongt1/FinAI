import DashboardLayout from "../components/DashboardLayout";

const ProfilePage = () => {
	return (
		<DashboardLayout>
			<div className="w-full h-full">
				<div className="bg-white rounded-3xl p-6 mb-4">
					<h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default ProfilePage;
