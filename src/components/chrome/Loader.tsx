"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hudAudio } from "@/lib/audio";

type Phase = "loading" | "waiting" | "revealing" | "ready" | "gone";

/** spec §7 — read live, so an OS-level change mid-session is honoured */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** boot log lines for professional portfolio initialization */
/** boot log lines for professional portfolio initialization */
const BOOT_LINES: Array<{ at: number; text: string; status?: string }> = [
  { at: 5, text: "$ boot portfolio.sys // v2.6.4", status: "OK" },
  { at: 15, text: "> mounting /dev/webgl3d ...........", status: "OK" },
  { at: 25, text: "> compiling shader pipeline [2/2] ...", status: "OK" },
  { at: 38, text: "> spawning neural particles [14,000]", status: "OK" },
  { at: 50, text: "> binding fullstack & embedded runtime", status: "OK" },
  { at: 62, text: "> loading engineering vault & case files", status: "OK" },
  { at: 74, text: "> establishing high-speed telemetry uplink", status: "ONLINE" },
  { at: 84, text: "> authenticating operator // @AERA0908", status: "GRANTED" },
  { at: 92, text: "> system ready // sector aera 384,400 KM", status: "NOMINAL" },
  { at: 98, text: "// ALL SYSTEMS OPERATIONAL: AWAITING USER", status: "READY" },
];

/** Streamlined milestones for mobile screens to eliminate crowding */
const BOOT_LINES_MOBILE: Array<{ at: number; text: string; status?: string }> = [
  { at: 10, text: "$ boot portfolio.sys // v2.6", status: "OK" },
  { at: 35, text: "> mounting 3D graphics & shaders", status: "OK" },
  { at: 65, text: "> loading engineering vault", status: "OK" },
  { at: 92, text: "// ALL SYSTEMS OPERATIONAL", status: "READY" },
];

/**
 * Cyberpunk Industrial Yellow Poster Terminal Loader.
 */
export function Loader({ onDone, onWaiting }: { onDone: () => void; onWaiting?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const launchedRef = useRef(false);

  const onWaitingRef = useRef(onWaiting);
  useEffect(() => {
    onWaitingRef.current = onWaiting;
  }, [onWaiting]);

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const [phase, setPhase] = useState<Phase>("loading");
  const [activeLineCount, setActiveLineCount] = useState(0);
  const [activeMobileCount, setActiveMobileCount] = useState(0);
  const activeCountRef = useRef(0);
  const activeMobileRef = useRef(0);

  useEffect(() => {
    if (phase !== "waiting") return;
    const prompt = promptRef.current;
    if (!prompt) return;

    gsap.fromTo(
      prompt,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [phase]);

  useEffect(() => {
    document.body.classList.add("intro-cursor");
    return () => document.body.classList.remove("intro-cursor");
  }, []);

  /* progress tween drives % readouts and reveals boot lines */
  useEffect(() => {
    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: 100,
      duration: 2.2,
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

        let mobileCount = 0;
        BOOT_LINES_MOBILE.forEach((line) => {
          if (proxy.v >= line.at) {
            mobileCount++;
          }
        });

        if (mobileCount !== activeMobileRef.current) {
          activeMobileRef.current = mobileCount;
          setActiveMobileCount(mobileCount);
        }
      },
      onComplete: () => {
        if (enteredRef.current) return;
        setPhase("waiting");
        onWaitingRef.current?.();
      },
    });
    progressTweenRef.current = tween;
    return () => {
      tween.kill();
      progressTweenRef.current = null;
    };
  }, []);

  function enter(withSound: boolean) {
    if (enteredRef.current) return;
    enteredRef.current = true;

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

    if (prefersReducedMotion()) {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "none",
        onComplete: () => {
          setPhase("gone");
          onDone();
        },
      });
      return;
    }

    const target = document.querySelector(".hero-logo-target");
    const source = logo.querySelector(".aera-letters-wrapper");
    const letters = logo.querySelectorAll(".aera-letter");
    const fetchingBadge = logo.querySelector(".fetching-badge");

    revealTlRef.current?.kill();
    revealTlRef.current = null;
    gsap.killTweensOf([logo, letters]);
    gsap.set(letters, { yPercent: 0, x: 0, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("gone");
        onDone();
      },
    });

    // 1. Fade out boot chrome elements & fetching badge smoothly
    tl.to([".boot-chrome", fetchingBadge], {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    }, 0);

    // 2. Wipe the yellow background layer up via clipPath
    if (bgLayerRef.current) {
      tl.to(
        bgLayerRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
        },
        0.08
      );
    }

    // 3. Smooth FLIP morph: move & scale the AERA logo directly to the Hero target
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

      tl.to(
        logo,
        {
          x: dx,
          y: dy,
          scale: scale,
          duration: 1.25,
          ease: "power3.inOut",
          transformOrigin: "50% 50%",
        },
        0.08
      );

      // Transition text color from black (#0d0d10) to paper-white (#f4f3ee) as the yellow background lifts
      tl.to(
        letters,
        {
          color: "#f4f3ee",
          duration: 0.95,
          ease: "power2.inOut",
        },
        0.2
      );
    }
  }

  /* AERA letter-by-letter reveal entry animation */
  useEffect(() => {
    if (phase !== "revealing") return;

    const logo = logoRef.current;
    if (!logo) {
      enter(true);
      return;
    }
    logo.style.display = "flex";

    const letters = Array.from(logo.querySelectorAll<HTMLElement>(".aera-letter"));
    if (letters.length === 0) {
      enter(true);
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(letters, { yPercent: 0, opacity: 1 });
      enter(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        enter(true);
      },
    });
    revealTlRef.current = tl;

    // Letters rise up sequentially from mask
    gsap.set(letters, { yPercent: 130, opacity: 1, x: 0 });
    tl.to(
      letters,
      {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
      },
      0
    );

    // Subtle misprint registration settle
    if (letters[1] && letters[2]) {
      tl.to(letters[1], { x: -3, duration: 0.08, ease: "steps(2)", yoyo: true, repeat: 1 }, 0.9);
      tl.to(letters[2], { x: 3, duration: 0.08, ease: "steps(2)", yoyo: true, repeat: 1 }, 0.9);
    }

    return () => {
      tl.kill();
      revealTlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const skipIntro = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    launchedRef.current = true;

    progressTweenRef.current?.kill();
    revealTlRef.current?.kill();
    revealTlRef.current = null;

    try {
      hudAudio.boot();
      hudAudio.setMuted(false);
    } catch {}

    const done = () => {
      setPhase("gone");
      onDone();
    };
    const overlay = overlayRef.current;
    if (!overlay || prefersReducedMotion()) {
      done();
      return;
    }
    gsap.to(overlay, { opacity: 0, duration: 0.28, ease: "power2.out", onComplete: done });
  };

  /** Click anywhere or press key to proceed */
  const proceed = () => {
    if (phase !== "waiting" || enteredRef.current || launchedRef.current) return;
    launchedRef.current = true;

    try {
      hudAudio.boot();
      hudAudio.confirm();
    } catch {}

    const prompt = promptRef.current;
    if (prompt) {
      gsap.to(prompt, {
        opacity: 0,
        y: -15,
        scale: 0.96,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => setPhase("revealing"),
      });
    } else {
      setPhase("revealing");
    }
  };

  const proceedRef = useRef(proceed);
  useEffect(() => {
    proceedRef.current = proceed;
  });

  /* Listen for any keypress (Enter, Space, etc.) to proceed */
  useEffect(() => {
    if (phase !== "waiting") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      proceedRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Yellow Poster Background Layer (Click anywhere to proceed) */}
      <div
        ref={bgLayerRef}
        onClick={phase === "waiting" ? proceed : undefined}
        className={`absolute inset-0 bg-[#e6e200] text-[#0d0d10] overflow-hidden select-none font-mono pointer-events-auto ${
          phase === "waiting" ? "cursor-pointer" : ""
        }`}
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        {/* Tactile Moving Risograph Noise Layer: softened and actively animated at 24fps */}
        <div
          className="pointer-events-none absolute -inset-20 z-10 opacity-[0.06] mix-blend-multiply select-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='posterNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23posterNoise)'/%3E%3C/svg%3E")`,
            animation: "grain-shift 0.22s steps(6) infinite",
          }}
          aria-hidden="true"
        />

        {/* Micro CRT Scanline Texture: subtle glare diffusion */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.018] select-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
          }}
          aria-hidden="true"
        />
        {/* Framing corner tick marks */}
        <div className="pointer-events-none absolute left-4 top-4 border-l-2 border-t-2 border-[#0d0d10] w-5 h-5 z-30" />
        <div className="pointer-events-none absolute right-4 top-4 border-r-2 border-t-2 border-[#0d0d10] w-5 h-5 z-30" />
        <div className="pointer-events-none absolute left-4 bottom-4 border-l-2 border-b-2 border-[#0d0d10] w-5 h-5 z-30" />
        <div className="pointer-events-none absolute right-4 bottom-4 border-r-2 border-b-2 border-[#0d0d10] w-5 h-5 z-30" />

        {/* Top right Japanese vertical text + bar with Scramble Decode Animation */}
        <div className="absolute top-6 right-6 md:top-10 md:right-12 hidden sm:flex items-start gap-3 z-30 pointer-events-none">
          <div className="font-mono text-[11px] tracking-[0.25em] font-bold uppercase [writing-mode:vertical-rl] flex items-center gap-1 text-[#0d0d10]">
            <JapaneseDecoder isEnglish={phase === "revealing" || phase === "ready"} />
          </div>
          <div
            className={`w-2.5 bg-[#0d0d10] transition-all duration-500 ease-out ${
              phase === "revealing" || phase === "ready" ? "h-28" : "h-20"
            }`}
          />
        </div>

        {/* Skip button */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            skipIntro();
          }}
          aria-label="Skip intro and go straight to the site"
          className="absolute left-4 top-4 md:left-12 md:top-8 z-30 cursor-pointer font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#0d0d10]/80 transition-colors hover:text-[#0d0d10] focus-visible:text-[#0d0d10] px-2 py-0.5 border border-[#0d0d10]/20 bg-[#e6e200]/60 rounded-xs"
        >
          SKIP INTRO →
        </button>

        {/* Click/tap anywhere to proceed prompt */}
        {phase === "waiting" && (
          <div
            ref={promptRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 select-none px-4 md:px-6"
            style={{ opacity: 0 }}
          >
            <ProceedPrompt onProceed={proceed} />
          </div>
        )}

        {/* Boot Chrome & Poster Layout */}
        <div className={`boot-chrome pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-12 z-20 transition-opacity duration-300 ${phase === "waiting" ? "opacity-25 md:opacity-100" : "opacity-100"}`}>
          {/* Top bar info */}
          <div className="flex items-baseline justify-between border-t-2 border-[#0d0d10]/40 pt-2 max-w-xs md:max-w-sm mt-8 md:mt-0">
            <span className="t-micro text-[#0d0d10] font-bold tracking-wider">
              GITHUB.COM/AERA0908 // SOFTWARE & SYSTEMS
            </span>
          </div>

          {/* Bottom area */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 w-full mt-auto">
            {/* Desktop Terminal Logs */}
            <div className="hidden md:flex flex-col items-start font-mono text-[0.75rem] leading-[1.7] tracking-[0.08em] text-[#0d0d10] font-bold max-w-lg">
              {BOOT_LINES.map((line, i) => (
                <TypingLine
                  key={line.at}
                  text={line.text}
                  status={line.status}
                  active={activeLineCount > i}
                  isComplete={phase === "waiting" || phase === "revealing" || phase === "ready"}
                />
              ))}

              {/* Segmented Square Block Progress Bar */}
              <div className="mt-3 flex items-center">
                <div className="flex items-center gap-1 p-1 border-2 border-[#0d0d10] bg-[#e6e200]">
                  {Array.from({ length: 14 }).map((_, idx) => {
                    const isFilled =
                      phase !== "loading" ||
                      Math.floor((activeLineCount / BOOT_LINES.length) * 14) > idx;
                    return (
                      <div
                        key={idx}
                        className={`w-2.5 h-3.5 transition-colors duration-75 ${
                          isFilled ? "bg-[#0d0d10]" : "bg-transparent border border-[#0d0d10]/20"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Bottom status line */}
              <div className="mt-4 font-mono text-xs font-black tracking-widest text-[#0d0d10] flex items-center gap-2">
                <span className="animate-pulse">❯❯</span> UPLINK ONLINE // INITIALIZATION COMPLETE...
              </div>
            </div>

            {/* Mobile Streamlined Terminal Logs */}
            <div className="flex md:hidden flex-col items-start font-mono text-[0.7rem] leading-[1.6] tracking-[0.06em] text-[#0d0d10] font-bold w-full">
              {BOOT_LINES_MOBILE.map((line, i) => (
                <TypingLine
                  key={line.at}
                  text={line.text}
                  status={line.status}
                  active={activeMobileCount > i}
                  isComplete={phase === "waiting" || phase === "revealing" || phase === "ready"}
                />
              ))}

              <div className="mt-2 font-mono text-[10px] font-black tracking-widest text-[#0d0d10] flex items-center gap-1.5">
                <span className="animate-pulse">❯❯</span> READY // SECTOR AERA
              </div>
            </div>

            {/* Bottom Right: Cross arrow directional box icon + progress bar */}
            <div className="flex flex-col items-end gap-2 md:gap-3 w-full md:w-auto self-end">
              <div className="hidden md:flex w-12 h-12 border-2 border-[#0d0d10] items-center justify-center p-1.5 relative bg-[#e6e200]">
                <svg viewBox="0 0 24 24" className="w-full h-full text-[#0d0d10] fill-none stroke-current stroke-[2.2]">
                  <path d="M4 4l16 16M20 4L4 20" />
                  <path d="M4 8V4h4M16 4h4v4M4 16v4h4M20 16v4h-4" />
                </svg>
              </div>

              <div className="flex flex-col gap-1 w-full md:w-48 border-t-2 border-[#0d0d10]/40 pt-2">
                <div className="h-1.5 w-full bg-[#0d0d10]/20 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[#0d0d10] rounded-full transition-all duration-100"
                    style={{ width: phase === "loading" ? "0%" : "100%" }}
                  />
                </div>
                <span className="t-micro flex justify-between text-[#0d0d10] font-bold font-mono">
                  <span>STATUS: {phase === "loading" ? "BOOTING" : "READY"}</span>
                  <span>
                    <span ref={pctRef}>{phase === "loading" ? "0" : "100"}</span>%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AERA Logo Layer (Separate from the clipping background layer so it NEVER gets cut off) */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center z-[110]"
      >
        <div className="relative flex flex-col items-center justify-center">
          <div className="aera-letters-wrapper relative z-[2] flex gap-[0.02em] font-display font-black tracking-[-0.08em] text-[#0d0d10] text-[16vw] md:text-[12vw] leading-none uppercase select-none overflow-hidden py-4 px-8">
            <span className="aera-letter inline-block">A</span>
            <span className="aera-letter inline-block">E</span>
            <span className="aera-letter inline-block">R</span>
            <span className="aera-letter inline-block">A</span>
          </div>

          {/* _2K.045_FETCHING badge - fades out cleanly on morph */}
          <div className="fetching-badge flex items-center gap-2 mt-2 font-mono text-xs font-black tracking-widest text-[#0d0d10] self-end pr-8">
            <span className="inline-block w-3 h-3 bg-[#0d0d10]" />
            <span>_2K.045_FETCHING</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Click anywhere to proceed prompt with cyan typing animation & blinking cyan block cursor */
function ProceedPrompt({ onProceed }: { onProceed: () => void }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fullText = isMobile ? "TAP TO PROCEED" : "CLICK ANYWHERE TO PROCEED";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      setDisplayedText(fullText.slice(0, currentIdx));
      if (currentIdx >= fullText.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <button
      type="button"
      onClick={onProceed}
      aria-label="Proceed to portfolio"
      className="group flex flex-col items-center gap-2.5 md:gap-3 p-4 md:p-6 text-center cursor-pointer select-none focus-visible:outline-none"
    >
      <div className="flex items-center justify-center gap-1.5 md:gap-2 font-mono text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-[0.1em] md:tracking-[0.12em] text-[#0d0d10] group-hover:scale-105 transition-transform duration-200">
        <span className="text-[#0d0d10]/60">❯</span>
        <span>{displayedText}</span>
        <span
          className="inline-block w-3 h-5 sm:w-4 sm:h-7 md:w-5 md:h-9 bg-[#0d0d10] opacity-80 animate-pulse ml-0.5"
          aria-hidden="true"
        />
      </div>
      <span className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-[0.18em] md:tracking-[0.25em] text-[#0d0d10]/75">
        [ SYSTEM READY // TAP ANYWHERE TO ENTER ]
      </span>
    </button>
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
  const elRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (isComplete) {
      el.innerHTML = `${text}${status ? `<span class="font-black text-[#0d0d10]"> ${status}</span>` : ""}`;
      return;
    }

    if (!active) {
      el.innerHTML = "";
      return;
    }

    let currentLen = 0;
    let raf = 0;
    let tick: ReturnType<typeof setTimeout> | undefined;

    const typeFast = () => {
      const isFinished = currentLen >= text.length;
      const sliced = text.slice(0, currentLen);
      const cursor = !isFinished ? '<span class="animate-pulse">▊</span>' : '';
      const statusHTML = isFinished && status 
        ? `<span class="font-black text-[#0d0d10]"> ${status}</span>`
        : "";
      el.innerHTML = `${sliced}${cursor}${statusHTML}`;

      if (!isFinished) {
        currentLen += 2;
        tick = setTimeout(() => {
          raf = requestAnimationFrame(typeFast);
        }, 16);
      }
    };

    typeFast();

    return () => {
      if (tick) clearTimeout(tick);
      cancelAnimationFrame(raf);
    };
  }, [active, isComplete, text, status]);

  if (!active && !isComplete) return null;

  return <p ref={elRef} />;
}

const JAPANESE_GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789X#@!%";

/** Scramble text decode animation for vertical cyberpunk Japanese accent with translation on proceed */
function JapaneseDecoder({ isEnglish = false }: { isEnglish?: boolean }) {
  const currentTarget = isEnglish ? "|| NEVER FADE AWAY" : "|| 決して消えない";
  const [displayText, setDisplayText] = useState(currentTarget);

  useEffect(() => {
    let frame = 0;
    const totalFrames = isEnglish ? 22 : 28;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const chars = currentTarget.split("");

      const scrambled = chars
        .map((char, index) => {
          if (char === " " || char === "|") return char;
          const charProgress = index / chars.length;
          if (progress > charProgress) {
            return char;
          }
          return JAPANESE_GLYPHS[Math.floor(Math.random() * JAPANESE_GLYPHS.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(currentTarget);
      }
    }, 32);

    return () => clearInterval(interval);
  }, [currentTarget, isEnglish]);

  return <span>{displayText}</span>;
}
