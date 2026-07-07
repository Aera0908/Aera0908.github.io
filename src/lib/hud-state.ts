/**
 * Shared mutable HUD state, written by DOM listeners / ScrollTrigger and
 * read inside the R3F frame loop every frame. Deliberately NOT React
 * state — nothing here should ever cause a re-render (spec §7).
 */
export const hudState = {
  /** normalized pointer, -1..1 on both axes, +y = up (GL convention) */
  pointer: { x: 0, y: 0 },
  /** master scroll progress 0..1 — written by the master ScrollTrigger (Step 5) */
  scrollProgress: 0,
};
