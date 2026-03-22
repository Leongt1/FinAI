import { useEffect, useRef, useState } from "react";
import type { Category } from "../types";

interface CategoryDropdownProps {
	categories: Category[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const CategoryDropdown = ({
	categories,
	value,
	onChange,
	placeholder = "All Categories",
}: CategoryDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selected = categories.find((c) => c.id === value);

	return (
		<div ref={ref} className="relative">
			{/* trigger button */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex gap-2 items-center justify-between bg-white border-2 border-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer hover:border-gray-300 transition-colors"
			>
				<span>
					{selected ? (
						<span className="flex items-center gap-1">
							<span>{selected.icon}</span>
							<span>{selected.name}</span>
						</span>
					) : (
						<span className="text-gray-400">{placeholder}</span>
					)}
				</span>
				<span
					className={`text-gray-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
				>
					▼
				</span>
			</button>
			{/* dropdown list */}
			{isOpen && (
				<div
					className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-3"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-wrap gap-2 w-120">
						{/* all option */}
						<div
							onClick={() => {
								onChange("");
								setIsOpen(false);
							}}
							className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${
								!value
									? "bg-gray-800 text-white border-gray-800"
									: "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
							}`}
						>
							All Categories
						</div>

						{/* category pills */}
						{categories
							.filter((c) => !c.hidden)
							.map((c) => (
								<div
									key={c.id}
									onClick={() => {
										onChange(c.id);
										setIsOpen(false);
									}}
									className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors flex items-center gap-1 whitespace-nowrap ${
										value === c.id
											? "bg-gray-800 text-white border-gray-800"
											: "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
									}`}
								>
									<span>{c.icon}</span>
									<span>{c.name}</span>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoryDropdown;
