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
				className="flex gap-3 items-center justify-between bg-surface border border-border rounded-full px-4 py-2 text-sm cursor-pointer hover:border-border-strong transition-colors"
			>
				<span>
					{selected ? (
						<span className="flex items-center gap-2 text-text-muted">
							<span>{selected.icon}</span>
							<span>{selected.name}</span>
						</span>
					) : (
						<span className="text-text-muted">{placeholder}</span>
					)}
				</span>
				<span
					className={`text-text-muted text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
				>
					▼
				</span>
			</button>
			{/* dropdown list */}
			{isOpen && (
				<div
					className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-2xl shadow-md z-50 p-3"
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
									? "bg-surface-raised font-bold text-text-muted border-border-strong"
									: "bg-surface text-text-muted border-border hover:border-border-strong"
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
											? "bg-surface-raised text-accent-glow font-bold border-border-strong"
											: "bg-surface text-text-muted border-border hover:border-border-strong"
									}`}
								>
									<span>{c.icon}</span>
									<span className="text-text-muted">{c.name}</span>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoryDropdown;
