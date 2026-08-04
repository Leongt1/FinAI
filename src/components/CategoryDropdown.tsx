import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Category } from "../types";

interface CategoryDropdownProps {
	categories: Category[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	// When true the menu renders in a portal with fixed positioning so it escapes
	// overflow-clipping ancestors (e.g. the scrollable bulk-import review table),
	// overlaying the page instead of forcing the container to scroll.
	menuInPortal?: boolean;
}

const CategoryDropdown = ({
	categories,
	value,
	onChange,
	placeholder = "All Categories",
	menuInPortal = false,
}: CategoryDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [coords, setCoords] = useState<{
		top: number;
		left: number;
		width: number;
	} | null>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// click-outside also accounts for the portaled menu, which lives outside wrapRef
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (wrapRef.current?.contains(target)) return;
			if (menuRef.current?.contains(target)) return;
			setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// position the fixed menu under the trigger from its viewport rect
	useLayoutEffect(() => {
		if (!isOpen || !menuInPortal) return;
		const el = triggerRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		// wider than the trigger so pills wrap 2+ per row (like the normal
		// selector) instead of stacking into a single column
		const width = Math.max(rect.width, 336);
		const maxLeft = window.innerWidth - width - 16;
		setCoords({
			top: rect.bottom + 4,
			left: Math.max(16, Math.min(rect.left, maxLeft)),
			width,
		});
	}, [isOpen, menuInPortal]);

	// a fixed menu can't follow a scroll, so close on scroll/resize while open
	useEffect(() => {
		if (!isOpen || !menuInPortal) return;
		const close = () => setIsOpen(false);
		window.addEventListener("resize", close);
		window.addEventListener("scroll", close, true); // capture: catch ancestor scrolls
		return () => {
			window.removeEventListener("resize", close);
			window.removeEventListener("scroll", close, true);
		};
	}, [isOpen, menuInPortal]);

	const selected = categories.find((c) => c.id === value);

	// shared menu body (the wrapping pill list) used by both render modes
	const menuBody = (
		<div className="flex flex-wrap gap-2">
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
	);

	return (
		<div ref={wrapRef} className="relative">
			{/* trigger button */}
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex gap-3 items-center justify-between bg-surface border border-border rounded-full px-4 py-3 text-sm cursor-pointer hover:border-border-strong transition-all"
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

			{/* in-flow menu (default): absolutely positioned under the trigger */}
			{isOpen && !menuInPortal && (
				<div
					className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-2xl shadow-md z-50 p-3 w-full min-w-64 max-w-[calc(100vw-2rem)] max-h-72 overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
				>
					{menuBody}
				</div>
			)}

			{/* portaled menu: fixed to the viewport so overflow ancestors can't clip it */}
			{isOpen &&
				menuInPortal &&
				coords &&
				createPortal(
					<div
						ref={menuRef}
						style={{
							position: "fixed",
							top: coords.top,
							left: coords.left,
							width: coords.width,
						}}
						className="bg-surface border border-border rounded-2xl shadow-md z-50 p-3 max-w-[calc(100vw-2rem)] max-h-72 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						{menuBody}
					</div>,
					document.body,
				)}
		</div>
	);
};

export default CategoryDropdown;
