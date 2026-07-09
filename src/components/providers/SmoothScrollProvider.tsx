"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Kinetic smooth scrolling. Lenis drives the scroll position; GSAP's
 * ticker drives Lenis, and every Lenis scroll event pings ScrollTrigger,
 * so WebGL + HTML scroll animations stay frame-synced (spec §4).
 *
 * With prefers-reduced-motion, native scrolling is left untouched —
 * ScrollTrigger still works off the native scroll events.
 */
// Standalone cast type — do NOT `extends Window` (the lenis package globally
// augments Window.lenis with a different shape, which conflicts at build time).
type LenisWindow = { lenis?: Lenis };

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1, // kinetic weight; higher = snappier
      smoothWheel: true,
      anchors: true,
    });

    if (typeof window !== "undefined") {
      (window as unknown as LenisWindow).lenis = lenis;
      if (
        document.documentElement.classList.contains("overflow-hidden") ||
        document.body.classList.contains("overflow-hidden")
      ) {
        lenis.stop();
      }
    }

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (typeof window !== "undefined") {
        (window as unknown as LenisWindow).lenis = undefined;
      }
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
