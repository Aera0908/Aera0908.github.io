"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Full-screen black curtain that starts opaque and fades out on mount — it
 * receives the hand-off from the vault card's open animation (which ends on
 * solid black) so navigating into a case file reads as one continuous shot.
 */
export function CaseEnter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tw = gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.05,
      onComplete: () => {
        el.style.display = "none";
      },
    });
    return () => {
      tw.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[1000] bg-black pointer-events-none"
      aria-hidden="true"
    />
  );
}
