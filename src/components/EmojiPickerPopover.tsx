import { useEffect, useRef } from "react";
import EmojiPicker, { EmojiStyle, Theme, type EmojiClickData } from "emoji-picker-react";
import { useThemeStore } from "../store/themeStore";

interface EmojiPickerPopoverProps {
	onPick: (emoji: string) => void;
	onClose: () => void;
}

// Lazy-loaded (see AssistantPage) so the emoji dataset stays out of the initial
// bundle. Native emoji style => renders the system emoji font, no network.
const EmojiPickerPopover = ({ onPick, onClose }: EmojiPickerPopoverProps) => {
	const theme = useThemeStore((s) => s.theme);
	const ref = useRef<HTMLDivElement>(null);

	// close when clicking outside the popover (deferred one tick so the click
	// that opened it doesn't immediately close it)
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
		document.addEventListener("keydown", onEsc);
		return () => {
			clearTimeout(t);
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("keydown", onEsc);
		};
	}, [onClose]);

	return (
		<div ref={ref} className="absolute bottom-full left-0 z-50 mb-2">
			<EmojiPicker
				onEmojiClick={(data: EmojiClickData) => onPick(data.emoji)}
				emojiStyle={EmojiStyle.NATIVE}
				theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
				lazyLoadEmojis
				skinTonesDisabled
				previewConfig={{ showPreview: false }}
				height={360}
				width={320}
			/>
		</div>
	);
};

export default EmojiPickerPopover;
