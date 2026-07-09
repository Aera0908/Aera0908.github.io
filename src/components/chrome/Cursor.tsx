"use client";

import { useEffect, useRef } from "react";
import { expDampAlpha } from "@/lib/scene";

/**
 * KPR-style crosshair cursor: a cross with elongated vertical strokes
 * riding the pointer exactly, plus a small dot that lags behind with
 * exponential damping. Desktop / fine pointers only.
 */
export function Cursor() {
  const crossRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cross = crossRef.current!;
    const circle = circleRef.current!;
    const dot = dotRef.current!;
    cross.style.display = "block";
    circle.style.display = "block"; // CSS hides whichever design is inactive
    dot.style.display = "block";

    let x = -100;
    let y = -100;
    let dx = -100;
    let dy = -100;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    // grow the crosshair over interactive elements
    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      targetScale = el.closest("a, button, [role='button']") ? 1.8 : 1;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const alpha = expDampAlpha(10, dt);
      dx += (x - dx) * alpha;
      dy += (y - dy) * alpha;
      scale += (targetScale - scale) * alpha;
      cross.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      circle.style.transform = cross.style.transform;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* crosshair: vertical strokes longer than horizontal, like KPR */}
      <div
        ref={crossRef}
        aria-hidden="true"
        className="cursor-cross pointer-events-none fixed top-0 left-0 z-[120] hidden mix-blend-difference"
      >
        <div className="relative h-9 w-9">
          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
          <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
          <span className="absolute top-1/2 left-0 h-px w-2 -translate-y-1/2 bg-white" />
          <span className="absolute top-1/2 right-0 h-px w-2 -translate-y-1/2 bg-white" />
          <span className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-white" />
        </div>
      </div>
      {/* intro reticle: rotating dashed ring + tick marks + core dot —
          swapped in via body.intro-cursor while the boot screen is up */}
      <div
        ref={circleRef}
        aria-hidden="true"
        className="cursor-circle pointer-events-none fixed top-0 left-0 z-[120] hidden mix-blend-difference"
      >
        <div className="relative h-10 w-10">
          <span className="reticle-spin absolute inset-0 rounded-full border border-dashed border-white/90" />
          <span className="absolute inset-[7px] rounded-full border border-white/50" />
          <span className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute top-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white" />
          <span className="absolute top-1/2 left-0 h-px w-1.5 -translate-y-1/2 bg-white" />
          <span className="absolute top-1/2 right-0 h-px w-1.5 -translate-y-1/2 bg-white" />
        </div>
      </div>
      {/* lag dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[119] hidden h-1.5 w-1.5 rounded-full bg-iris-bright"
      />
    </>
  );
}
