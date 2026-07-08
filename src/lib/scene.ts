/**
 * WebGL scene constants — kprverse-design-spec §3.
 * The camera travels CAMERA_PATH as scroll progress goes 0 → 1.
 */
import * as THREE from "three";

/** deep indigo night — WebGL clear color + fog (matches --world token) */
export const WORLD = "#000000";

export const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.0, -2.5, 12.0),
    new THREE.Vector3(0.0, -2.5, 12.0),
    new THREE.Vector3(0.0, -2.5, 12.0),
    new THREE.Vector3(0.0, -2.5, 12.0),
    new THREE.Vector3(0.0, -2.5, 12.0),
  ],
  false,
  "catmullrom",
  0.5,
);

/** what the camera looks at per section; blended by scroll progress */
export const LOOK_TARGETS = [
  new THREE.Vector3(0.0, 7.0, -38.0),
  new THREE.Vector3(0.0, 7.0, -38.0),
  new THREE.Vector3(0.0, 7.0, -38.0),
  new THREE.Vector3(0.0, 7.0, -38.0),
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
