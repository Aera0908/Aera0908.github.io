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
    const heroFig1Y = heroStart + (heroEnd - heroStart) * (1.4 / heroDur); // ~719px (Expanded profile start)
    const heroFig2Y = heroStart + (heroEnd - heroStart) * (1.9 / heroDur);
    const heroFig3Y = heroStart + (heroEnd - heroStart) * (2.4 / heroDur);
    const heroFig4Y = heroStart + (heroEnd - heroStart) * (3.0 / heroDur); // ~1541px (Last image in expanded profile)
    const heroProfileExitY = heroStart + (heroEnd - heroStart) * (3.25 / heroDur); // ~1670px

    const journeyStart = journeyST ? journeyST.start : heroEnd;
    const journeyEnd = journeyST ? journeyST.end : journeyStart + 3000;

    const vaultEl = document.getElementById("vault");
    const vaultY = vaultEl
      ? Math.round(vaultEl.getBoundingClientRect().top + window.scrollY)
      : journeyEnd;

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
      heroFig1: heroFig1Y,
      heroFig2: heroFig2Y,
      heroFig3: heroFig3Y,
      heroFig4: heroFig4Y,
      heroProfileExit: heroProfileExitY,
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
        return;
      }

      isLockedRef.current = true;
      if (onStepChange) onStepChange();

      if (sectionPath !== undefined) {
        window.history.replaceState(null, "", sectionPath ? `/${sectionPath}` : "/");
      }

      const easing =
        duration >= 3.0
          ? (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) // smooth in-out for 3x slower sequence
          : (t: number) => 1 - Math.pow(1 - t, 3); // power3.out for crisp section snaps

      const lenis = (window as unknown as LenisWindow).lenis;
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration,
          easing,
          lock: true,
          onComplete: () => {
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            lockTimerRef.current = setTimeout(() => {
              isLockedRef.current = false;
            }, 260);
          },
        });
      } else {
        gsap.to(window, {
          scrollTo: targetY,
          duration,
          ease: duration >= 3.0 ? "power2.inOut" : "power3.out",
          onComplete: () => {
            if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
            lockTimerRef.current = setTimeout(() => {
              isLockedRef.current = false;
            }, 260);
          },
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
          smoothScrollTo(coords.heroFig1, 1.8, "", { immediate });
          break;
        case "journey":
          smoothScrollTo(coords.journeyStart, 4.0, "journey", { immediate });
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

  // Deep-link initial section landing
  useEffect(() => {
    if (!initialSection) return;
    const t = setTimeout(() => {
      goToSection(initialSection, true);
    }, 600);
    return () => clearTimeout(t);
  }, [initialSection, goToSection]);

  // Main listener for wheel, keyboard, and touch
  useEffect(() => {
    if (!enabled) return;

    const handleStepNavigation = (direction: 1 | -1, isKeyboard = false) => {
      const coords = getCoordinates();
      const curY = window.scrollY;

      // 1. HERO TOP ZONE
      if (curY <= coords.heroTop + 100) {
        if (direction === 1) {
          // Slow, cinematic scroll from Hero Top to Expanded Profile
          smoothScrollTo(coords.heroFig1, 1.8, "");
        }
        return;
      }

      // 2. EXPANDED PROFILE ZONE (between Fig 1 and Fig Exit)
      if (curY >= coords.heroFig1 - 60 && curY <= coords.heroProfileExit + 60) {
        if (direction === 1) {
          if (isKeyboard) {
            // Arrow Down steps through the figures
            if (curY < coords.heroFig2 - 40) {
              smoothScrollTo(coords.heroFig2, 0.7, "");
            } else if (curY < coords.heroFig3 - 40) {
              smoothScrollTo(coords.heroFig3, 0.7, "");
            } else if (curY < coords.heroFig4 - 40) {
              smoothScrollTo(coords.heroFig4, 0.7, "");
            } else {
              // From last image, 3x slower cinematic transition to Journey (4.0s)
              smoothScrollTo(coords.journeyStart, 4.0, "journey");
            }
          } else {
            // Mouse wheel / trackpad: only lock when reaching the last image going down
            if (curY >= coords.heroFig4 - 20) {
              smoothScrollTo(coords.journeyStart, 4.0, "journey");
            }
          }
        } else {
          if (isKeyboard) {
            // Arrow Up steps back through the figures
            if (curY > coords.heroFig4 + 40) {
              smoothScrollTo(coords.heroFig4, 0.7, "");
            } else if (curY > coords.heroFig3 + 40) {
              smoothScrollTo(coords.heroFig3, 0.7, "");
            } else if (curY > coords.heroFig2 + 40) {
              smoothScrollTo(coords.heroFig2, 0.7, "");
            } else if (curY > coords.heroFig1 + 40) {
              smoothScrollTo(coords.heroFig1, 0.7, "");
            } else {
              // From first image, smooth transition to Hero Top
              smoothScrollTo(coords.heroTop, 1.8, "");
            }
          } else {
            // Mouse wheel / trackpad: only lock when reaching the first image going up
            if (curY <= coords.heroFig1 + 40) {
              smoothScrollTo(coords.heroTop, 1.8, "");
            }
          }
        }
        return;
      }

      // Transition bridge between Expanded Profile exit and Journey
      if (curY > coords.heroProfileExit && curY < coords.journeyStart) {
        if (direction === 1) {
          smoothScrollTo(coords.journeyStart, 4.0, "journey");
        } else {
          smoothScrollTo(coords.heroFig4, 4.0, "");
        }
        return;
      }

      // 3. JOURNEY ZONE (normal scroll on cards, lock on boundaries)
      if (curY >= coords.journeyStart - 20 && curY <= coords.journeyEnd + 20) {
        if (direction === 1) {
          // When at or near the last card / end of Journey
          if (curY >= coords.journeyEnd - 30) {
            smoothScrollTo(coords.vaultY, 1.0, "vault");
          }
        } else {
          // When at or near the first card / start of Journey (3x slower back to Expanded Profile)
          if (curY <= coords.journeyStart + 30) {
            smoothScrollTo(coords.heroFig4, 4.0, "");
          }
        }
        return;
      }

      // Transition bridge between Journey and Vault
      if (curY > coords.journeyEnd && curY < coords.vaultY - 40) {
        if (direction === 1) {
          smoothScrollTo(coords.vaultY, 1.0, "vault");
        } else {
          smoothScrollTo(coords.journeyEnd, 1.0, "journey");
        }
        return;
      }

      // 4. THE VAULT ZONE
      if (curY >= coords.vaultY - 40 && curY < coords.credentialsY - 40) {
        if (direction === 1) {
          smoothScrollTo(coords.credentialsY, 0.9, "credentials");
        } else {
          smoothScrollTo(coords.journeyEnd, 1.0, "journey");
        }
        return;
      }

      // 5. CREDENTIALS ZONE
      if (curY >= coords.credentialsY - 40 && curY < coords.contactY - 40) {
        if (direction === 1) {
          smoothScrollTo(coords.contactY, 0.9, "contact");
        } else {
          smoothScrollTo(coords.vaultY, 0.9, "vault");
        }
        return;
      }

      // 6. CONTACT ZONE
      if (curY >= coords.contactY - 40) {
        if (direction === -1) {
          smoothScrollTo(coords.credentialsY, 0.9, "credentials");
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

      // Check if we are in a Free-Scroll Zone:
      // A) Inside Expanded Profile (between Fig 1 and Fig 4)
      const isInExpandedProfileMiddle =
        curY > coords.heroFig1 + 40 && curY < coords.heroFig4 - 20;

      // B) Inside Journey (between start + 30 and end - 30)
      const isInJourneyMiddle =
        curY > coords.journeyStart + 30 && curY < coords.journeyEnd - 30;

      // If user is inside Journey middle or Expanded Profile middle, let them scroll normally!
      if (isInExpandedProfileMiddle || isInJourneyMiddle) {
        if (isInExpandedProfileMiddle) {
          if (e.deltaY > 0 && curY >= coords.heroFig4 - 50) {
            e.preventDefault();
            if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
              handleStepNavigation(1, false);
            }
            return;
          }
          if (e.deltaY < 0 && curY <= coords.heroFig1 + 60) {
            e.preventDefault();
            if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
              handleStepNavigation(-1, false);
            }
            return;
          }
          return; // Allow normal smooth wheel scroll inside profile
        }

        if (isInJourneyMiddle) {
          if (e.deltaY > 0 && curY >= coords.journeyEnd - 60) {
            e.preventDefault();
            if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
              handleStepNavigation(1, false);
            }
            return;
          }
          if (e.deltaY < 0 && curY <= coords.journeyStart + 60) {
            e.preventDefault();
            if (!isLockedRef.current && Math.abs(e.deltaY) > 12) {
              handleStepNavigation(-1, false);
            }
            return;
          }
          return; // Allow normal smooth wheel scroll across cards
        }
      }

      // In all locked zones (Hero Top, Vault, Credentials, Contact, and zone boundaries):
      // ALWAYS prevent default to completely eliminate micro-scrolling/drifting!
      e.preventDefault();
      e.stopPropagation();

      if (isLockedRef.current) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 14) return;

      const direction = delta > 0 ? 1 : -1;
      handleStepNavigation(direction, false);
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

        e.preventDefault();
        if (isLockedRef.current) return;

        handleStepNavigation(dir, true);
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
      const isInExpandedProfileMiddle =
        curY > coords.heroFig1 + 40 && curY < coords.heroFig4 - 20;
      const isInJourneyMiddle =
        curY > coords.journeyStart + 30 && curY < coords.journeyEnd - 30;

      if (isInExpandedProfileMiddle || isInJourneyMiddle) {
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absY > 40 || absX > 40) {
        e.preventDefault();
        if (isLockedRef.current) return;

        const primaryDelta = absY >= absX ? deltaY : deltaX;
        const dir = primaryDelta > 0 ? 1 : -1;
        touchStartRef.current = null;

        handleStepNavigation(dir, false);
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

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("aera-snap-jump", onJumpEvent as EventListener);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("aera-snap-jump", onJumpEvent as EventListener);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [enabled, getCoordinates, smoothScrollTo, goToSection]);

  return {
    goToSection,
  };
}
