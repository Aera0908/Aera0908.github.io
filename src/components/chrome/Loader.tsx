"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hudAudio } from "@/lib/audio";

type Phase = "loading" | "ready" | "gone";

/** boot log lines, revealed when the progress passes their threshold */
const BOOT_LINES: Array<{ at: number; text: string; status?: string }> = [
  { at: 3, text: "$ boot portfolio.sys" },
  { at: 14, text: "> mounting /dev/webgl .............", status: "OK" },
  { at: 28, text: "> compiling shaders [2/2] .........", status: "OK" },
  { at: 42, text: "> spawning particles [14000] ......", status: "OK" },
  { at: 56, text: "> binding scroll timeline .........", status: "OK" },
  { at: 68, text: "> loading experience.log ..........", status: "OK" },
  { at: 80, text: "> decrypting vault ................", status: "OK" },
  { at: 93, text: "> uplink standby ..................", status: "READY" },
];

/**
 * White terminal boot screen.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  
  const [phase, setPhase] = useState<Phase>("loading");
  const [activeLineCount, setActiveLineCount] = useState(0);
  const activeCountRef = useRef(0);

  /* progress tween drives the % readouts and reveals boot lines */
  useEffect(() => {
    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: 100,
      duration: 2.4,
      ease: "power1.inOut",
      onUpdate: () => {
        const pctVal = Math.round(proxy.v);
        const pctStr = String(pctVal);
        if (pctRef.current) pctRef.current.textContent = pctStr;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${pctVal}%`;
        }

        let count = 0;
        BOOT_LINES.forEach((line) => {
          if (proxy.v >= line.at) {
            count++;
          }
        });

        if (count !== activeCountRef.current) {
          activeCountRef.current = count;
          setActiveLineCount(count);
        }
      },
      onComplete: () => {
        setPhase("ready");
        // Automatically proceed after logo reveal completes (1.8s delay)
        gsap.delayedCall(1.8, () => {
          enter(true);
        });
      },
    });
    return () => {
      tween.kill();
    };
  }, []);

  /* Clean reveal for "AERA" text when ready */
  useEffect(() => {
    if (phase !== "ready") return;

    if (logoRef.current) {
      logoRef.current.style.display = "flex";
    }

    const letters = logoRef.current?.querySelectorAll(".aera-letter");
    if (letters && letters.length > 0) {
      // Set initial state below the mask with full opacity (no fade)
      gsap.set(letters, { yPercent: 110, opacity: 1 });

      gsap.to(
        letters,
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.12,
          ease: "power4.out",
        }
      );
    }
  }, [phase]);

  /* ESC enters without sound (optional fallback, but is auto now) */
  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") enter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const enter = (withSound: boolean) => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    
    // Attempt WebAudio boot
    try {
      hudAudio.boot();
      hudAudio.setMuted(!withSound);
    } catch (e) {
      console.warn("Audio autoplay blocked by browser policy.", e);
    }

    const logo = logoRef.current;
    if (!logo) {
      setPhase("gone");
      onDone();
      return;
    }

    const target = document.querySelector(".hero-logo-target");
    const source = logo.querySelector(".aera-letters-wrapper");
    const letters = logo.querySelectorAll(".aera-letter");

    // Kill any active reveal animations to prevent visual conflicts
    gsap.killTweensOf([logo, letters]);

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("gone");
        onDone();
      },
    });

    // 1. Fade out the loader elements (terminal log and progress bar)
    tl.to(".pointer-events-none.absolute.inset-0.flex.flex-col.justify-between", {
      opacity: 0,
      duration: 0.45,
    });

    // 2. Perform FLIP transition: move the loader's black AERA logo to the Hero target logo position
    tl.addLabel("morph", "+=0.1");

    if (target && source) {
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const sourceCenterX = sourceRect.left + sourceRect.width / 2;
      const sourceCenterY = sourceRect.top + sourceRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const dx = targetCenterX - sourceCenterX;
      const dy = targetCenterY - sourceCenterY;
      const scale = targetRect.width / sourceRect.width;

      tl.to(logo, {
        x: dx,
        y: dy,
        scale: scale,
        duration: 1.25,
        ease: "power3.inOut",
      }, "morph");
    }

    // 3. Slide up the loader overlay background using clipPath (reveals Hero section underneath)
    tl.to(
      overlayRef.current,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.1,
        ease: "power3.inOut",
      }
    );
  };

  if (phase === "gone") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-paper text-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* HUGE centered "AERA" logo */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center z-[102]"
      >
        <div className="aera-letters-wrapper flex gap-[0.15em] font-display font-black tracking-[-0.06em] text-ink text-[16vw] md:text-[12vw] uppercase select-none overflow-hidden py-2 px-4">
          <span className="aera-letter inline-block">A</span>
          <span className="aera-letter inline-block">E</span>
          <span className="aera-letter inline-block">R</span>
          <span className="aera-letter inline-block">A</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-10 md:px-16 md:py-16">
        {/* Top rule */}
        <div className="flex items-baseline justify-between border-t border-ink/25 pt-2">
          <span className="t-micro text-ink-soft">
            HTTPS://PORTFOLIO.DEV/AJ/FULL-STACK/EMBEDDED/AI
          </span>
        </div>

        {/* Bottom area containing both lower left/right content and silent path hint */}
        <div className="pointer-events-none flex flex-col gap-8 w-full mt-auto">
          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
            {/* Lower Left content (command texts) */}
            <div className="flex flex-col items-start font-mono text-[0.75rem] leading-[1.8] tracking-[0.08em] text-ink/85 max-w-lg">
              {BOOT_LINES.map((line, i) => (
                <TypingLine
                  key={line.at}
                  text={line.text}
                  status={line.status}
                  active={activeLineCount > i}
                  isComplete={phase === "ready"}
                />
              ))}
              {phase === "ready" && (
                <p className="text-ink-soft mt-1">
                  $ awaiting operator input <span className="animate-pulse">▊</span>
                </p>
              )}
            </div>

            {/* Small loading bar on bottom right */}
            <div className="flex flex-col gap-1.5 w-64 border-t border-ink/25 pt-4 self-start md:self-auto">
              <div className="h-1 w-full bg-ink/10 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-ink rounded-full"
                  style={{ width: phase === "ready" ? "100%" : "0%" }}
                />
              </div>
              <span className="t-micro flex justify-between text-ink/65 font-mono">
                <span>SYSTEM STATUS: {phase === "ready" ? "READY" : "BOOTING"}</span>
                <span>
                  <span ref={pctRef}>{phase === "ready" ? "100" : "0"}</span>%
                </span>
              </span>
            </div>
          </div>

          {/* silent path hint */}
          <p className="t-micro self-center text-ink-soft">
            PRESS [ESC] TO CONTINUE WITHOUT SOUND
          </p>
        </div>
      </div>
    </div>
  );
}

/** helper component to handle terminal-style typing animation for each line */
function TypingLine({
  text,
  status,
  active,
  isComplete,
}: {
  text: string;
  status?: string;
  active: boolean;
  isComplete: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isComplete) {
      setDisplayedText(text);
      setShowStatus(true);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }

    if (!active) {
      setDisplayedText("");
      setShowStatus(false);
      return;
    }

    if (displayedText.length === text.length) {
      setShowStatus(true);
      return;
    }

    let currentIndex = displayedText.length;
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    typingTimerRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setShowStatus(true);
      }
    }, 8);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [active, isComplete, text]);

  if (!active && !isComplete) return null;

  return (
    <p>
      {displayedText}
      {!showStatus && active && <span className="animate-pulse">▊</span>}
      {showStatus && status && (
        <span
          className={
            status === "READY" ? "font-bold text-iris" : "text-iris/80"
          }
        >
          {" "}
          {status}
        </span>
      )}
    </p>
  );
}
