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

  // Background parallax Y offsets (for slide-in from bottom)
  earthY: 14.5,
  earthOpacity: 1.0, // opacity for Hero Earth fade-out
  oldMoonY: -9.5,
  oldMoonOpacity: 1.0, // opacity for Hero moon surface fade-out
  facilityY: -55.0, // starts hidden deep below horizon (no peeking)
  facilityOpacity: 1.0, // fades out on Journey exit (Projects entry)
  moonParallaxY: -55.0, // starts hidden deep below horizon (no peeking)
  moonParallaxOpacity: 1.0, // fades out on Journey exit (Projects entry)

  // Background parallax X offsets (for sideways scroll).
  // Pans are centered around 0 so both plane edges stay covered at fov 50
  // even on ultrawide aspect (edge = halfWidth - |pan|, must exceed ~21 wu).
  facilityX: 5.0,
  moonParallaxX: 22.5,
};
