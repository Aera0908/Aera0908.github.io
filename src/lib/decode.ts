/**
 * Decode-text effect: letters cycle through random glyphs, then lock into the
 * real word left to right. Only letters and digits scramble — spaces and
 * punctuation hold still so the word shape stays readable while it resolves.
 */
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** uppercase + digits keep glyph widths close to Archivo caps (less jitter) */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>";
const SCRAMBLES = /[A-Za-z0-9]/;
/** glyph refresh interval — spec §4 scramble cadence */
const FRAME_MS = 40;

const rand = () => CHARS[(Math.random() * CHARS.length) | 0];

/** the final text with every letter/digit replaced by a random glyph */
export function scrambled(text: string) {
  return Array.from(text, (c) => (SCRAMBLES.test(c) ? rand() : c)).join("");
}

/**
 * Tween that decodes `el` into `text` (defaults to el.dataset.text, then its
 * current textContent). Returns an inert tween under reduced motion so it can
 * still be dropped into a timeline.
 */
export function decodeTween(
  el: HTMLElement,
  { duration = 0.6, text }: { duration?: number; text?: string } = {},
) {
  const final = text ?? el.dataset.text ?? el.textContent ?? "";
  if (prefersReducedMotion()) {
    return gsap.to({}, { duration: 0, onComplete: () => void (el.textContent = final) });
  }
  const state = { p: 0 };
  let last = 0;
  return gsap.to(state, {
    p: 1,
    duration,
    ease: "none",
    onStart: () => {
      el.textContent = scrambled(final);
    },
    onUpdate: () => {
      const now = performance.now();
      if (now - last < FRAME_MS && state.p < 1) return;
      last = now;
      // first 25% is pure noise, then letters lock in left to right
      const locked = Math.floor(gsap.utils.clamp(0, 1, (state.p - 0.25) / 0.75) * final.length);
      let out = final.slice(0, locked);
      for (let i = locked; i < final.length; i++) {
        out += SCRAMBLES.test(final[i]) ? rand() : final[i];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/* play-once registry: a decode that already ran this session renders final */
const played = new Set<string>();
export const decodePlayed = (id: string) => played.has(id);
export const markDecodePlayed = (id: string) => {
  played.add(id);
};
