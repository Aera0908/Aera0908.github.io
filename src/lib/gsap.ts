/**
 * Single GSAP entry point — import gsap/ScrollTrigger from here only,
 * so plugin registration happens exactly once.
 * Motion presets per kprverse-design-spec §4.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
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

/**
 * Motion vocabulary — every new animation picks one of these on purpose.
 *  snap:   UI arriving fast and locking in
 *  servo:  mechanical parts docking — small overshoot, then settle
 *  glitch: digital things (text, readouts) — hard steps, no easing
 */
export const MOTION = {
  snap: "expo.out",
  servo:
    typeof window !== "undefined"
      ? CustomEase.create("servo", "M0,0 C0.18,0 0.24,1.1 0.52,1.07 0.72,1.04 0.84,1 1,1")
      : "power3.out",
  glitch: "steps(4)",
} as const;

/** duration ceilings (seconds) — feedback / content entrance / transitions */
export const DUR = {
  feedback: 0.2,
  enter: 0.5,
  transition: 0.9,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** default ScrollTrigger scrub smoothing */
export const SCRUB = 0.8;

export { gsap, ScrollTrigger };
