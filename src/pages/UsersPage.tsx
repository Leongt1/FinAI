import Navbar from "../components/Navbar";
import { useUsers } from "../hooks/useUsers";

const UsersPage = () => {
	const { users, isLoading, error, deleteUser, isDeleting } = useUsers();

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-red-400">Something went wrong</p>
			</div>
		);

	return (
		<div
			className="min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat p-4"
			style={{ backgroundImage: `url('/background_image.png')` }}
		>
			<Navbar />
			{/* main content */}
			<main className="max-w-7xl mx-auto px-8 py-6">
				<div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-100">
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Gender
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date of Birth
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{users?.map((user) => (
								<tr
									key={user.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4 text-sm text-gray-900">
										{user.name}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										{user.email}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										{user.gender}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										{user.date_of_birth
											? new Date(user.date_of_birth).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
													},
												)
											: "-"}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										<button
											onClick={() => deleteUser(user.id)}
											disabled={isDeleting}
											className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 hover:bg-red-700 transition-colors cursor-pointer"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

export default UsersPage;
