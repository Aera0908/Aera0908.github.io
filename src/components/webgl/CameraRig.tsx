"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { hudState } from "@/lib/hud-state";
import { CAMERA_PATH, expDampAlpha, getLookTarget } from "@/lib/scene";

/** mouse influence on camera position (world units at full deflection) */
const MOUSE_X = 0.6;
const MOUSE_Y = 0.35;
/** damping stiffness — spec §3 says λ = 4–6 */
const LAMBDA = 4.5;

/**
 * Positions the camera every frame: base position from the scroll path
 * (fixed at p=0 until Step 5 wires scrollProgress) plus a damped offset
 * that follows the normalized pointer.
 */
export function CameraRig() {
  // scratch vectors hoisted out of the frame loop (spec §7: no per-frame allocs)
  const offset = useRef(new THREE.Vector3()).current;
  const target = useRef(new THREE.Vector3()).current;
  const pathPos = useRef(new THREE.Vector3()).current;
  const lookAt = useRef(new THREE.Vector3()).current;

  useFrame(({ camera }, delta) => {
    const p = hudState.scrollProgress;
    CAMERA_PATH.getPoint(p, pathPos);
    getLookTarget(p, lookAt);

    target.set(hudState.pointer.x * MOUSE_X, hudState.pointer.y * MOUSE_Y, 0);
    offset.lerp(target, expDampAlpha(LAMBDA, delta));

    camera.position.copy(pathPos).add(offset);
    camera.lookAt(lookAt);
  });

  return null;
}
