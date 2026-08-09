/**
 * Ref-counted page scroll lock.
 *
 * Several overlays freeze the page (resume preview, certificate preview,
 * gallery lightbox, diagram lightbox). They previously each did it their own
 * way — two toggled `overflow-hidden` classes, one wrote
 * `document.body.style.overflow = "unset"` on cleanup — so whichever closed
 * FIRST released the lock for all of them, and the page could scroll behind an
 * overlay that was still open.
 *
 * Counting means the lock lifts only when the last holder lets go. Lenis is
 * stopped alongside, because the class alone does not stop smooth scrolling.
 */
type Lenis = { stop: () => void; start: () => void };

const lenis = () =>
  (globalThis as unknown as { lenis?: Lenis }).lenis;

let holders = 0;

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  holders += 1;
  if (holders > 1) return; // already locked by someone else
  document.documentElement.classList.add("overflow-hidden");
  document.body.classList.add("overflow-hidden");
  lenis()?.stop();
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  holders = Math.max(0, holders - 1);
  if (holders > 0) return; // someone else still needs it
  document.documentElement.classList.remove("overflow-hidden");
  document.body.classList.remove("overflow-hidden");
  lenis()?.start();
}

/** escape hatch for teardown paths that must not leave the page frozen */
export function forceUnlockScroll(): void {
  holders = 0;
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("overflow-hidden");
  document.body.classList.remove("overflow-hidden");
  lenis()?.start();
}
