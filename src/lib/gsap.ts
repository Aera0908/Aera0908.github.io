/**
 * Single GSAP entry point — import gsap/ScrollTrigger from here only,
 * so plugin registration happens exactly once.
 * Motion presets per kprverse-design-spec §4.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE = {
  /** panels, opacity, HUD reveals */
  hud: "power2.out",
  /** scroll-scrubbed WebGL values — always linear, scrub does the smoothing */
  cam: "none",
  /** scramble/glitch steps */
  glitch: "steps(6)",
  /** number counters, bars */
  elastic: "expo.out",
} as const;

/** default ScrollTrigger scrub smoothing */
export const SCRUB = 0.8;

export { gsap, ScrollTrigger };
