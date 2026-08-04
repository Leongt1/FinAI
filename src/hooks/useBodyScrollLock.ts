import { useEffect } from "react";

// Module-level so nested/stacked overlays share one lock: closing one modal
// won't unlock the page while another is still open.
let lockCount = 0;
let previousOverflow = "";

// Locks <body> scroll while `active` is true (a modal/overlay is open), so the
// page behind the backdrop can't scroll or be interacted with by wheel/touch.
// Restores the previous overflow once the last lock is released.
export const useBodyScrollLock = (active: boolean) => {
	useEffect(() => {
		if (!active) return;

		if (lockCount === 0) {
			previousOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		}
		lockCount++;

		return () => {
			lockCount--;
			if (lockCount === 0) {
				document.body.style.overflow = previousOverflow;
			}
		};
	}, [active]);
};
