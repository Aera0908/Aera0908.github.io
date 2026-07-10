"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

interface PageTransitionContextProps {
  transitionTo: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextProps | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Reset layers function
  const resetLayers = () => {
    gsap.set(layersRef.current, { xPercent: -100 });
  };

  const transitionTo = (href: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTargetHref(href);

    // Stop Lenis scroll if active
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (lenis) lenis.stop();
    document.body.classList.add("overflow-hidden");

    // Reset positions before animating
    resetLayers();

    // Slide-in timeline
    gsap.timeline({
      onComplete: () => {
        // Trigger client-side navigation
        router.push(href);
      },
    })
    .to(layersRef.current, {
      xPercent: 0,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.08,
    });
  };

  // Watch for pathname changes to trigger the slide-out
  useEffect(() => {
    if (isTransitioning && targetHref && pathname === targetHref) {
      // Small timeout to allow the browser to paint the new route
      const t = setTimeout(() => {
        const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
        
        // Reverse layers array for slide out so the top layer (index 3) slides first,
        // followed by index 2, 1, and 0. This creates a beautiful peeling effect.
        const reversedLayers = [...layersRef.current].reverse();

        gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
            setTargetHref(null);
            
            // Re-enable scrolling
            if (lenis) lenis.start();
            document.body.classList.remove("overflow-hidden");
            
            // Reset layers position offscreen
            resetLayers();
          },
        })
        .to(reversedLayers, {
          xPercent: 100,
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.08,
        });
      }, 100);

      return () => clearTimeout(t);
    }
  }, [pathname, isTransitioning, targetHref]);

  // Fallback safety timeout: if navigation hangs, unlock after 3.5s
  useEffect(() => {
    if (isTransitioning) {
      const fallback = setTimeout(() => {
        const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
        setIsTransitioning(false);
        setTargetHref(null);
        if (lenis) lenis.start();
        document.body.classList.remove("overflow-hidden");
        resetLayers();
      }, 3500);

      return () => clearTimeout(fallback);
    }
  }, [isTransitioning]);

  return (
    <PageTransitionContext.Provider value={{ transitionTo, isTransitioning }}>
      {children}
      
      {/* Transition Overlay Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[999] flex flex-col justify-stretch pointer-events-none"
        style={{
          // Only capture events when transitioning to prevent blocking normal clicks
          pointerEvents: isTransitioning ? "auto" : "none",
        }}
      >
        {/* Layer 1: Lighter dark background */}
        <div
          ref={(el) => { layersRef.current[0] = el; }}
          className="absolute inset-0 bg-world-2 w-full h-full"
          style={{ transform: "translateX(-100%)" }}
        />
        {/* Layer 2: Electric yellow */}
        <div
          ref={(el) => { layersRef.current[1] = el; }}
          className="absolute inset-0 bg-iris w-full h-full"
          style={{ transform: "translateX(-100%)" }}
        />
        {/* Layer 3: Signal alert red */}
        <div
          ref={(el) => { layersRef.current[2] = el; }}
          className="absolute inset-0 bg-alert w-full h-full"
          style={{ transform: "translateX(-100%)" }}
        />
        {/* Layer 4: Main dark background */}
        <div
          ref={(el) => { layersRef.current[3] = el; }}
          className="absolute inset-0 bg-world w-full h-full"
          style={{ transform: "translateX(-100%)" }}
        />
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}
