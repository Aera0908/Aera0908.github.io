/**
 * WebGL scene constants — kprverse-design-spec §3.
 * The camera travels CAMERA_PATH as scroll progress goes 0 → 1.
 */
import * as THREE from "three";

/** deep indigo night — WebGL clear color + fog (matches --world token) */
export const WORLD = "#141630";

export const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.0, -2.5, 12.0),  // p=0.00 Hero — sitting on the moon surface, looking at Earth
    new THREE.Vector3(2.0, -2.0, 4.0),   // p≈0.30 About — camera shifts Z forward
    new THREE.Vector3(0.0, -1.5, -2.0),  // p≈0.45 — crossing the threshold
    new THREE.Vector3(-4.0, -1.0, -8.0), // p≈0.70 — lower level shadow view
    new THREE.Vector3(0.0, -2.0, -14.0), // p=1.00 — street/crater level on the dark side
  ],
  false,
  "catmullrom",
  0.5,
);

/** what the camera looks at per section; blended by scroll progress */
export const LOOK_TARGETS = [
  new THREE.Vector3(0.0, 7.0, -38.0),  // hero: looking up at the giant Earth in the sky
  new THREE.Vector3(0.0, 2.0, -20.0),  // about: looking down/forward
  new THREE.Vector3(0.0, -1.0, 5.0),   // projects: panning backward
  new THREE.Vector3(0.0, -3.0, 30.0),  // uplink: looking back into deep space starry void (dark side)
];

/** progress stops where each LOOK_TARGET fully applies */
const LOOK_STOPS = [0, 0.4, 0.7, 1];

/** writes the interpolated look-at point for progress p into `out` */
export function getLookTarget(p: number, out: THREE.Vector3): THREE.Vector3 {
  if (p <= LOOK_STOPS[0]) return out.copy(LOOK_TARGETS[0]);
  for (let i = 0; i < LOOK_STOPS.length - 1; i++) {
    if (p <= LOOK_STOPS[i + 1]) {
      const t = (p - LOOK_STOPS[i]) / (LOOK_STOPS[i + 1] - LOOK_STOPS[i]);
      // smoothstep so the gaze doesn't snap at segment boundaries
      const s = t * t * (3 - 2 * t);
      return out.lerpVectors(LOOK_TARGETS[i], LOOK_TARGETS[i + 1], s);
    }
  }
  return out.copy(LOOK_TARGETS[LOOK_TARGETS.length - 1]);
}

/**
 * Frame-rate independent damping factor: use as `v.lerp(target, alpha)`.
 * Never use a raw per-frame constant like 0.1 — it speeds up at high fps.
 */
export function expDampAlpha(lambda: number, dt: number): number {
  return 1 - Math.exp(-lambda * dt);
}
