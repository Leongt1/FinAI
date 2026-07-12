import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useCategories } from "../hooks/useCategories";
import TitleText from "../components/TitleText";
import type { Category } from "../types";
import ConfirmDialog from "../components/ConfirmDialog";

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
		deleteCategory,
		renameError,
		createError,
		deleteError,
		isCreating,
		isRenaming,
		isDeleting,
	} = useCategories();

	const [isAddOpen, setIsAddOpen] = useState(false);

	const [newIcon, setNewIcon] = useState("");
	const [newName, setNewName] = useState("");
	const [addError, setAddError] = useState<string | null>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [editingIcon, setEditingIcon] = useState("");

	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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
	}, [isAddOpen]);

	return (
		<DashboardLayout>
			<div className="w-full h-full">
				{/* Header */}
					{/* Title */}
					<TitleText title="Categories" />
					{/* Add transaction Btn */}
					<div className="fixed right-4 bottom-4 sm:right-10 sm:bottom-10 z-20 flex items-center gap-2">
						{showToolTip && (
							<span className="text-accent-glow text-sm bg-surface-raised/90 px-2 py-1 rounded-lg border border-border-strong whitespace-nowrap shadow-md">
								New Category
							</span>
						)}
						<button
							onClick={() => setIsAddOpen(true)}
							onMouseEnter={() => setShowToolTip(true)}
							onMouseLeave={() => setShowToolTip(false)}
							className="bg-accent-dim w-12 h-12 text-accent-glow rounded-lg p-2 mt-3 font-semibold hover:bg-accent transition-colors cursor-pointer"
						>
							<p className="text-2xl mb-1 font-semibold text-accent-glow">+</p>
						</button>
					</div>
				{/* Categories List */}
				{isLoading && (
					<p className="text-center text-sm text-text-muted py-8">Loading...</p>
				)}
				{error && (
					<p className="text-center text-sm text-expense py-8">
						Something went wrong.
					</p>
				)}
				{!isLoading && categories?.length === 0 && (
					<p className="text-center text-sm text-text-muted py-8">
						No categories found.
					</p>
				)}
				<div className="flex flex-wrap gap-4 overflow-auto pb-25">
					{categories?.map((cat) => (
						<div
							key={cat.id}
							className={`flex flex-col items-center justify-between gap-2 bg-surface border rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow ${cat.hidden ? "border-dashed border-border-strong" : "border-border"}`}
						>
							{renameError && editingId === cat.id && (
								<p className="text-expense p-1 bg-expense-bg rounded-lg mb-2 text-sm border border-expense">
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
											className="rounded-lg w-15 border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-income"
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
											className="rounded-lg border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-income"
										/>
									</>
								) : (
									<>
										<span className={`text-lg ${cat.hidden ? "opacity-60 grayscale" : ""}`}>{cat.icon}</span>
										<p
											className={`text-sm font-medium ${
												cat.hidden
													? "line-through text-subtle"
													: "text-text-muted"
											}`}
										>
											{cat.name}
										</p>
									</>
								)}
								{cat.hidden && (
									<span className="text-xs bg-surface-raised text-text-muted px-2 py-0.5 border border-border rounded-full">
										Hidden
									</span>
								)}
							</div>

							<div className="flex gap-3 mt-2">
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
											className="text-text-muted hover:bg-surface-raised rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border"
										>
											Save
										</button>
										<button
											onClick={() => {
												setEditingId(null);
												setEditingName("");
												setEditingIcon("");
											}}
											className="text-text-muted rounded-xl cursor-pointer p-2 transition-colors
											hover:bg-surface-raised border border-border"
										>
											Cancel
										</button>
									</>
								) : (
									<>
										{!cat.hidden && (
											<button
												onClick={() => {
													setEditingId(cat.id);
													setEditingName(cat.name);
													setEditingIcon(cat.icon);
												}}
											className="text-text-muted hover:bg-surface-raised rounded-xl cursor-pointer p-2 transition-colors border border-border"
										>
											Edit
										</button>
										)}
										{cat.hidden && (
											<button
												onClick={() => setCategoryToDelete(cat)}
												disabled={isDeleting}
												className="text-expense hover:bg-expense-bg rounded-xl cursor-pointer p-2 transition-colors border border-expense"
											>
												{isDeleting ? "Deleting..." : "Delete"}
											</button>
										)}
										<button
											onClick={() =>
												cat.hidden
													? unhideCategory(cat.id)
													: hideCategory(cat.id)
											}
											className={`rounded-xl cursor-pointer p-2 transition-colors border border-border text-text-muted hover:bg-surface-raised ${cat.hidden ? "border-border-strong" : "hover:border-border-strong"}`}
										>
											<span>{cat.hidden ? "Unhide" : "Hide"}</span>
										</button>
									</>
								)}
							</div>
						</div>
					))}
					{/* Add Category */}
					{addError && (
						<div className="flex items-center justify-between bg-expense-bg border border-expense rounded-3xl px-6 py-4">
							<p className="text-expense text-sm">{addError}</p>
						</div>
					)}
					{isAddOpen && (
						<div
							ref={bottomRef}
							className="flex flex-col gap-2 items-center justify-between bg-surface rounded-3xl px-6 py-4 border border-border shadow-md"
						>
							{createError || deleteError ? (
								<p className="text-expense p-2 bg-expense-bg mb-4 text-sm">
									{createError
										? "Failed to create category. Please try again."
										: "Failed to delete category. Please try again."
									}
								</p>
							) : null}
							<div className="flex flex-col gap-2">
								<input
									type="text"
									value={newIcon}
									maxLength={2}
									onChange={(e) => setNewIcon(e.target.value)}
									placeholder="Icon (optional)"
									className="rounded-lg border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-income w-full"
								/>
								<input
									autoFocus
									type="text"
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									placeholder="Category Name"
									className="rounded-lg border border-border text-sm p-2 px-4 focus:outline-none focus:ring-2 focus:ring-income w-full"
								/>
							</div>

							<div className="flex gap-3 mt-3">
								<button
									onClick={() => {
										if (!newName.trim()) return;
										// optimistic: temp card shows immediately, rolls back on error
										createCategory({ icon: newIcon, name: newName });
										handleAddClose();
									}}
									disabled={isCreating}
									className="text-text-muted hover:bg-surface-raised rounded-xl cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border"
								>
									{isCreating ? "Saving..." : "Save"}
								</button>
								<button
									onClick={() => {
										handleAddClose();
									}}
									className="text-text-muted hover:bg-surface-raised rounded-xl cursor-pointer p-2 transition-colors border border-border"
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<ConfirmDialog
				isOpen={!!categoryToDelete}
				title="Delete category?"
				message={`Delete "${categoryToDelete?.name}"? Transactions using this category will be reassigned.`}
				isLoading={isDeleting}
				onCancel={() => setCategoryToDelete(null)}
				onConfirm={() => {
					if (!categoryToDelete) return;
					deleteCategory(categoryToDelete.id);
					setCategoryToDelete(null);
				}}
			/>
		</DashboardLayout>
	);
};

export default CategoriesPage;
