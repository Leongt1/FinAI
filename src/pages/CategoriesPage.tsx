import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useCategories } from "../hooks/useCategories";

const CategoriesPage = () => {
	const [showToolTip, setShowToolTip] = useState(false);

	const {
		categories,
		isLoading,
		error,
		createCategory,
		renameCategory,
		hideCategory,
		unhideCategory,
		renameError,
		createError,
		isCreating,
		isRenaming,
	} = useCategories();

	const [isAddOpen, setIsAddOpen] = useState(false);

	const [newIcon, setNewIcon] = useState("");
	const [newName, setNewName] = useState("");
	const [addError, setAddError] = useState<string | null>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [editingIcon, setEditingIcon] = useState("");

	const handleAddClose = () => {
		setIsAddOpen(false);
		setNewName("");
		setNewIcon("");
		setAddError(null);
	};

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isAddOpen) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [categories?.length]);

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
				<div className="bg-white rounded-3xl p-6 mb-4 flex justify-between items-center">
					<h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
					{/* Add transaction Btn */}
					<div className="fixed flex-col right-10 bottom-10 flex items-center gap-2">
						{showToolTip && (
							<span className="text-gray-600 text-sm bg-white/50 px-2 py-1 rounded-lg whitespace-nowrap shadow-md">
								New Category
							</span>
						)}
						<button
							onClick={() => setIsAddOpen(true)}
							onMouseEnter={() => setShowToolTip(true)}
							onMouseLeave={() => setShowToolTip(false)}
							className="bg-white w-12 h-12 border border-gray-300 p-2 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-md"
						>
							<p className="text-2xl mb-1 font-semibold text-black">+</p>
						</button>
					</div>
				</div>
				{/* Categories List */}
				{isLoading && (
					<p className="text-center text-sm text-gray-400 py-8">Loading...</p>
				)}
				{error && (
					<p className="text-center text-sm text-red-500 py-8">
						Something went wrong.
					</p>
				)}
				{!isLoading && categories?.length === 0 && (
					<p className="text-center text-sm text-gray-400 py-8">
						No categories found.
					</p>
				)}
				<div className="flex flex-wrap gap-4 overflow-auto pb-25">
					{categories?.map((cat) => (
						<div
							key={cat.id}
							className={`flex flex-col items-center justify-between gap-2 bg-white/90 border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow ${cat.hidden ? "opacity-50" : ""}`}
						>
							{renameError && editingId === cat.id && (
								<p className="text-red-500 p-2 bg-red-200 rounded-lg mb-4">
									Invalid input
								</p>
							)}
							<div className="flex gap-3 items-center">
								{editingId == cat.id ? (
									<>
										<input
											type="text"
											maxLength={2}
											value={editingIcon}
											onChange={(e) => setEditingIcon(e.target.value)}
											className="rounded-lg w-15 border border-gray-200 text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
										/>
										<input
											autoFocus
											type="text"
											value={editingName}
											onChange={(e) => setEditingName(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													renameCategory(
														cat.id,
														editingName,
														editingIcon,
														{
															onSuccess: () => {
																setEditingId(null);
																setEditingName("");
																setEditingIcon("");
															},
														},
													);
												}
												if (e.key == "Escape") {
													setEditingId(null);
													setEditingName("");
													setEditingIcon("");
												}
											}}
											className="rounded-lg border border-gray-200 text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
										/>
									</>
								) : (
									<>
										<span className="text-lg">{cat.icon}</span>
										<p
											className={`text-sm font-medium ${
												cat.hidden
													? "line-through text-gray-400"
													: "text-gray-900"
											}`}
										>
											{cat.name}
										</p>
									</>
								)}
								{cat.hidden && (
									<span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full">
										Hidden
									</span>
								)}
							</div>

							<div className="flex gap-2">
								{editingId == cat.id ? (
									<>
										<button
											onClick={() =>
												renameCategory(
													cat.id,
													editingName,
													editingIcon,
													{
														onSuccess: () => {
															setEditingId(null);
															setEditingName("");
															setEditingIcon("");
														},
													},
												)
											}
											disabled={isRenaming}
											className="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Save
										</button>
										<button
											onClick={() => {
												setEditingId(null);
												setEditingName("");
												setEditingIcon("");
											}}
											className="text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer p-2 transition-colors"
										>
											Cancel
										</button>
									</>
								) : (
									<>
										<button
											onClick={() => {
												setEditingId(cat.id);
												setEditingName(cat.name);
												setEditingIcon(cat.icon);
											}}
											className="text-blue-500 hover:bg-blue-50 rounded-xl cursor-pointer p-2 transition-colors"
										>
											Edit
										</button>
										<button
											onClick={() =>
												cat.hidden
													? unhideCategory(cat.id)
													: hideCategory(cat.id)
											}
											className={`rounded-xl cursor-pointer p-2 transition-colors ${
												cat.hidden
													? "text-green-500 hover:bg-green-50"
													: "text-red-500 hover:bg-red-50"
											}`}
										>
											{cat.hidden ? "Unhide" : "Hide"}
										</button>
									</>
								)}
							</div>
						</div>
					))}
					{/* Add Category */}
					{addError && (
						<div className="flex items-center justify-between bg-white/90 rounded-3xl px-6 py-4">
							<p className="text-red-500">{addError}</p>
						</div>
					)}
					{isAddOpen && (
						<div
							ref={bottomRef}
							className="flex flex-col gap-2 items-center justify-between bg-white/90 rounded-3xl px-6 py-4"
						>
							{createError && (
								<p className="text-red-500 p-2 bg-red-200 mb-4">
									Invalid input
								</p>
							)}
							<div className="flex gap-2">
								<input
									type="text"
									value={newIcon}
									maxLength={2}
									onChange={(e) => setNewIcon(e.target.value)}
									placeholder="Icon (optional)"
									className="rounded-lg w-15 border border-gray-200 text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
								<input
									autoFocus
									type="text"
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									placeholder="Category Name"
									className="rounded-lg border border-gray-200 text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => {
										if (!newName.trim()) return;
										createCategory(
											{ icon: newIcon, name: newName },
											{
												onSuccess: () => {
													handleAddClose();
												},
											},
										);
									}}
									disabled={isCreating}
									className="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isCreating ? "Saving..." : "Save"}
								</button>
								<button
									onClick={() => {
										handleAddClose();
									}}
									className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer p-2 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default CategoriesPage;
