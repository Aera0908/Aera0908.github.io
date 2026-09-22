"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type LenisWindow = {
  lenis?: {
    scrollTo: (
      target: number | Element | string,
      options?: {
        offset?: number;
        immediate?: boolean;
        lock?: boolean;
        duration?: number;
        easing?: (t: number) => number;
        onComplete?: () => void;
        force?: boolean;
      }
    ) => void;
    stop: () => void;
    start: () => void;
  };
};

function canElementScroll(target: EventTarget | null, deltaY: number): boolean {
  if (!(target instanceof HTMLElement)) return false;
  let el: HTMLElement | null = target;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 2) {
        if (deltaY > 0 && el.scrollTop < maxScroll - 2) {
          return true; // Still has room to scroll down internally
        }
        if (deltaY < 0 && el.scrollTop > 2) {
          return true; // Still has room to scroll up internally
        }
      }
    }
    el = el.parentElement;
  }
  return false;
}

function isModalOrOverlayActive(): boolean {
  if (typeof document === "undefined") return false;
  if (
    document.documentElement.classList.contains("overflow-hidden") ||
    document.body.classList.contains("overflow-hidden")
  ) {
    return true;
  }
  return !!document.querySelector("[role='dialog']");
}

export function useSectionSnap({
  enabled = true,
  initialSection = null,
  onStepChange,
}: {
  enabled?: boolean;
  initialSection?: string | null;
  onStepChange?: () => void;
}) {
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Helper to compute landmark scroll coordinates
  const getCoordinates = useCallback(() => {
    const heroST = ScrollTrigger.getById("hero-pin");
    const journeyST = ScrollTrigger.getById("journey-pin");

    const heroStart = heroST ? heroST.start : 0;
    const heroEnd = heroST ? heroST.end : 2800;
    const heroDur = 5.45;

    // Timeline positions in Hero.tsx
    // Expanded profile starts around 1.3 (~667px) and finishes before card shrinks at 3.5 (~1798px)
    const heroExpandedStart = heroStart + (heroEnd - heroStart) * (1.3 / heroDur);
    const heroExpandedEnd = heroStart + (heroEnd - heroStart) * (3.5 / heroDur);

    const journeyEl = document.getElementById("journey");
    const journeyStart = journeyST
      ? journeyST.start
      : journeyEl
        ? Math.round(journeyEl.getBoundingClientRect().top + window.scrollY)
        : heroEnd;

    const vaultEl = document.getElementById("vault");
    const vaultY = vaultEl
      ? Math.round(vaultEl.getBoundingClientRect().top + window.scrollY)
      : (journeyST ? journeyST.end : journeyStart + 3000);

    const journeyEnd = journeyST ? journeyST.end : vaultY;

    const credEl = document.getElementById("credentials");
    const credentialsY = credEl
      ? Math.round(credEl.getBoundingClientRect().top + window.scrollY)
      : vaultY + window.innerHeight;

    const contactEl = document.getElementById("contact");
    const contactY = contactEl
      ? Math.round(contactEl.getBoundingClientRect().top + window.scrollY)
      : credentialsY + window.innerHeight;

    return {
      heroTop: 0,
      heroExpandedStart,
      heroExpandedEnd,
      heroFig1: heroExpandedStart,
      heroProfileExit: heroExpandedEnd,
      journeyStart,
      journeyEnd,
      vaultY,
      credentialsY,
      contactY,
    };
  }, []);

  const smoothScrollTo = useCallback(
    (
      targetY: number,
      duration = 1.0,
      sectionPath?: string,
      options: { immediate?: boolean } = {}
    ) => {
      if (options.immediate) {
        const lenis = (window as unknown as LenisWindow).lenis;
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true, force: true });
        } else {
          window.scrollTo(0, targetY);
        }
        if (sectionPath !== undefined) {
          window.history.replaceState(null, "", sectionPath ? `/${sectionPath}` : "/");
        }
        ScrollTrigger.update();
        return;
      }

      isLockedRef.current = true;
      if (onStepChange) onStepChange();

      if (sectionPath !== undefined) {
        window.history.replaceState(null, "", sectionPath ? `/${sectionPath}` : "/");
      }

      const easing =
        duration >= 2.0
          ? (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) // smooth in-out for slow sequence
          : (t: number) => 1 - Math.pow(1 - t, 2.6); // smooth cubic ease for responsive section snaps

      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      // Hard safety timer to prevent any lock deadlock
      lockTimerRef.current = setTimeout(() => {
        isLockedRef.current = false;
      }, Math.round(duration * 1000) + 300);

      const unlock = () => {
        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        lockTimerRef.current = setTimeout(() => {
          isLockedRef.current = false;
        }, 180);
      };

      const lenis = (window as unknown as LenisWindow).lenis;
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration,
          easing,
          lock: true,
          force: true,
          onComplete: unlock,
        });
      } else {
        gsap.to(window, {
          scrollTo: targetY,
          duration,
          ease: duration >= 2.0 ? "power2.inOut" : "power2.out",
          onComplete: unlock,
        });
      }
    },
    [onStepChange]
  );

  const goToSection = useCallback(
    (target: string, immediate = false) => {
      const coords = getCoordinates();
      switch (target) {
        case "top":
        case "hero-top":
        case "":
          smoothScrollTo(coords.heroTop, 1.8, "", { immediate });
          break;
        case "hero-profile":
          smoothScrollTo(coords.heroExpandedStart, 1.8, "", { immediate });
          break;
        case "journey":
          smoothScrollTo(coords.journeyStart, 1.4, "journey", { immediate });
          break;
        case "vault":
          smoothScrollTo(coords.vaultY, 1.0, "vault", { immediate });
          break;
        case "credentials":
          smoothScrollTo(coords.credentialsY, 0.9, "credentials", { immediate });
          break;
        case "contact":
          smoothScrollTo(coords.contactY, 0.9, "contact", { immediate });
          break;
        default:
          const el = document.getElementById(target);
          if (el) {
            smoothScrollTo(el.getBoundingClientRect().top + window.scrollY, 1.0, target, {
              immediate,
            });
          }
          break;
      }
    },
    [getCoordinates, smoothScrollTo]
  );

  const initialLandedRef = useRef(false);
  // Deep-link initial section landing - strictly one-shot on mount
  useEffect(() => {
    if (!initialSection || initialLandedRef.current) return;
    initialLandedRef.current = true;
    const t = setTimeout(() => {
      goToSection(initialSection, true);
    }, 600);
    return () => clearTimeout(t);
  }, [initialSection, goToSection]);

  // Main listener for wheel, keyboard, and touch
  useEffect(() => {
    if (!enabled) return;

    const handleStepNavigation = (direction: 1 | -1) => {
      const coords = getCoordinates();
      const curY = window.scrollY;

      if (direction === 1) {
        // DOWNWARDS STEP NAVIGATION (Between Sections)
        if (curY < coords.heroExpandedStart - 40) {
          smoothScrollTo(coords.heroExpandedStart, 1.6, "");
        } else if (curY < coords.journeyStart - 40) {
          smoothScrollTo(coords.journeyStart, 1.4, "journey");
        } else if (curY < coords.vaultY - 40) {
          smoothScrollTo(coords.vaultY, 1.0, "vault");
        } else if (curY < coords.credentialsY - 40) {
          smoothScrollTo(coords.credentialsY, 0.9, "credentials");
        } else if (curY < coords.contactY - 40) {
          smoothScrollTo(coords.contactY, 0.9, "contact");
        }
        return;
      } else {
        // UPWARDS STEP NAVIGATION (Between Sections)
        if (curY >= coords.contactY - 40) {
          smoothScrollTo(coords.credentialsY, 0.9, "credentials");
        } else if (curY >= coords.credentialsY - 40) {
          smoothScrollTo(coords.vaultY, 0.9, "vault");
        } else if (curY >= coords.vaultY - 40) {
          smoothScrollTo(coords.journeyEnd, 1.0, "journey");
        } else if (curY >= coords.journeyStart - 40) {
          smoothScrollTo(coords.heroExpandedEnd, 1.4, "");
        } else if (curY > coords.heroExpandedStart + 40) {
          smoothScrollTo(coords.heroTop, 1.8, "");
        } else {
          smoothScrollTo(coords.heroTop, 1.8, "");
        }
        return;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (isModalOrOverlayActive()) return;

      // Allow internal scrolling inside scrollable components (e.g. credentials log table)
      if (canElementScroll(e.target, e.deltaY)) {
        return;
      }

      const curY = window.scrollY;
      const coords = getCoordinates();

      // Free scroll zone 1: Inside Expanded White (photos & profile content)
      const isInExpandedWhiteMiddle =
        curY > coords.heroExpandedStart + 40 && curY < coords.heroExpandedEnd - 40;

      if (isInExpandedWhiteMiddle) {
        // Freely browse between photos and collage inside Expanded White
        return;
      }

      // Free scroll zone 2: Inside Journey (horizontal cards scrub)
      const isInJourneyMiddle =
        curY > coords.journeyStart + 40 && curY < coords.journeyEnd - 40;

      if (isInJourneyMiddle) {
        // Freely browse between horizontal cards inside Journey
        return;
      }

      // Boundary: Expanded White top edge -> snap up to Hero Top
      if (curY <= coords.heroExpandedStart + 40 && curY > coords.heroTop + 40) {
        if (e.deltaY < 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
          if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
            smoothScrollTo(coords.heroTop, 1.8, "");
          }
          return;
        }
        // If scrolling down, let user scroll into Expanded White content freely
        return;
      }

      // Boundary: Expanded White bottom edge -> snap down to Journey Start
      if (curY >= coords.heroExpandedEnd - 40 && curY < coords.journeyStart - 40) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
          if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
            smoothScrollTo(coords.journeyStart, 1.4, "journey");
          }
          return;
        }
        // If scrolling up, let user scroll back into Expanded White content freely
        return;
      }

      // Boundary: Journey start edge -> snap up to Expanded White
      if (curY <= coords.journeyStart + 40 && curY >= coords.heroExpandedEnd) {
        if (e.deltaY < 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
          if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
            smoothScrollTo(coords.heroExpandedEnd, 1.4, "");
          }
          return;
        }
        // If scrolling down, let user scroll into Journey cards freely
        return;
      }

      // Boundary: Journey end edge -> snap down to Vault
      if (curY >= coords.journeyEnd - 40 && curY < coords.vaultY - 40) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
          if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
            smoothScrollTo(coords.vaultY, 1.0, "vault");
          }
          return;
        }
        // If scrolling up, let user scroll back into Journey cards freely
        return;
      }

      // Section locking for Hero Top, Vault, Credentials, Contact:
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;

      if (isLockedRef.current) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 14) return;

      const direction = delta > 0 ? 1 : -1;
      handleStepNavigation(direction);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOrOverlayActive()) return;

      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;

      let dir: 1 | -1 | 0 = 0;
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        dir = 1;
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        dir = -1;
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSection("hero-top");
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        goToSection("contact");
        return;
      }

      if (dir !== 0) {
        if (e.key === " " && t?.closest("button, a, [role='button']")) return;

        const curY = window.scrollY;
        const coords = getCoordinates();
        const isInJourneyMiddle =
          curY > coords.journeyStart + 40 && curY < coords.journeyEnd - 40;
        const isInExpandedWhiteMiddle =
          curY > coords.heroExpandedStart + 40 && curY < coords.heroExpandedEnd - 40;

        if (isInJourneyMiddle || isInExpandedWhiteMiddle) {
          e.preventDefault();
          window.scrollBy({ top: dir * 450, behavior: "smooth" });
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (isLockedRef.current) return;

        handleStepNavigation(dir);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isModalOrOverlayActive()) return;
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isModalOrOverlayActive()) return;
      if (!touchStartRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;

      if (canElementScroll(e.target, deltaY)) {
        return;
      }

      const curY = window.scrollY;
      const coords = getCoordinates();

      const isInExpandedWhiteMiddle =
        curY > coords.heroExpandedStart + 40 && curY < coords.heroExpandedEnd - 40;
      if (isInExpandedWhiteMiddle) return;

      const isInJourneyMiddle =
        curY > coords.journeyStart + 40 && curY < coords.journeyEnd - 40;
      if (isInJourneyMiddle) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absY > 40 || absX > 40) {
        const primaryDelta = absY >= absX ? deltaY : deltaX;
        const dir = primaryDelta > 0 ? 1 : -1;

        if (dir > 0 && curY <= coords.heroExpandedStart + 40 && curY > coords.heroTop + 40) {
          return;
        }
        if (dir < 0 && curY >= coords.heroExpandedEnd - 40 && curY < coords.journeyStart - 40) {
          return;
        }
        if (dir > 0 && curY <= coords.journeyStart + 40 && curY >= coords.heroExpandedEnd) {
          return;
        }
        if (dir < 0 && curY >= coords.journeyEnd - 40 && curY < coords.vaultY - 40) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        (e as unknown as { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
        if (isLockedRef.current) return;

        touchStartRef.current = null;
        handleStepNavigation(dir);
      }
    };

    const onTouchEnd = () => {
      touchStartRef.current = null;
    };

    // Custom jump events from navbar links
    const onJumpEvent = (e: Event) => {
      const ce = e as CustomEvent<{ target: string; immediate?: boolean }>;
      if (ce.detail?.target) {
        goToSection(ce.detail.target, ce.detail.immediate);
      }
    };

    const isMobileQuery = window.matchMedia("(max-width: 767px)");
    let isMobile = isMobileQuery.matches;

    const attachDesktopListeners = () => {
      window.addEventListener("wheel", onWheel, { passive: false, capture: true });
      window.addEventListener("keydown", onKeyDown, { capture: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    };

    const removeDesktopListeners = () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", onKeyDown, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchstart", onTouchStart, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchmove", onTouchMove, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchend", onTouchEnd, { capture: true } as EventListenerOptions);
    };

    if (!isMobile) {
      attachDesktopListeners();
    }

    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Switched to mobile -> detach snapping
        isMobile = true;
        removeDesktopListeners();
      } else {
        // Switched to desktop -> attach snapping
        isMobile = false;
        attachDesktopListeners();
      }
    };

    if (isMobileQuery.addEventListener) {
      isMobileQuery.addEventListener("change", onMediaChange);
    } else {
      isMobileQuery.addListener(onMediaChange);
    }

    window.addEventListener("aera-snap-jump", onJumpEvent as EventListener);

    return () => {
      if (!isMobile) {
        removeDesktopListeners();
      }
      if (isMobileQuery.removeEventListener) {
        isMobileQuery.removeEventListener("change", onMediaChange);
      } else {
        isMobileQuery.removeListener(onMediaChange);
      }
      window.removeEventListener("aera-snap-jump", onJumpEvent as EventListener);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [enabled, getCoordinates, smoothScrollTo, goToSection]);

  return {
    goToSection,
  };
}
