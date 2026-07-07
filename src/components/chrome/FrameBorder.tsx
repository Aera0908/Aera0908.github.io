"use client";

/**
 * Thin inset frame around the viewport with tiny mono readouts,
 * KPR-style. difference blending keeps it legible over paper and world.
 */
export function FrameBorder() {
  return (
    <div className="viewport-frame" aria-hidden="true">
      <span className="t-micro absolute bottom-2 left-4 text-white">
        PORTFOLIO.SYS
      </span>
      <span className="t-micro absolute right-4 bottom-2 text-white">
        BUILD 2026.07
      </span>
    </div>
  );
}
