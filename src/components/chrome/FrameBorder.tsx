"use client";

/**
 * Thin inset frame around the viewport with tiny mono readouts,
 * KPR-style. difference blending keeps it legible over paper and world.
 */
export function FrameBorder() {
  return (
    <div className="viewport-frame" aria-hidden="true" />
  );
}
