"use client";

import { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { hudState } from "@/lib/hud-state";
import { WORLD } from "@/lib/scene";
import { CameraRig } from "./CameraRig";
import { MoonScene } from "./MoonScene";

/**
 * The single persistent WebGL canvas, fixed behind all HTML content.
 * Pointer tracking happens on window (the canvas sits below the DOM and
 * would never receive pointer events itself).
 */
export default function SceneCanvas() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      hudState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      hudState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0.0, -2.5, 12.0] }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={(state) => {
          if (process.env.NODE_ENV === "development") {
            // dev-only handle for inspecting camera/renderer from devtools
            (window as unknown as Record<string, unknown>).__r3f = state;
          }
        }}
      >
        <color attach="background" args={[WORLD]} />
        <fogExp2 attach="fog" args={[WORLD, 0.022]} />
        <CameraRig />
        <Suspense fallback={null}>
          <MoonScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
