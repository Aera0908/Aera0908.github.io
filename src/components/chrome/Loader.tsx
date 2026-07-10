"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hudAudio } from "@/lib/audio";

type Phase = "loading" | "waiting" | "revealing" | "ready" | "gone";

const FINAL_LETTERS = ["A", "E", "R", "A"];

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
 * Flat 2D moon (spec §0: printed, no shading): a solid silhouette disc.
 * "dark" draws it as solid ink on the back canvas; "light" draws it solid
 * white on the difference-blended front canvas, so it still reads as a black
 * disc over paper and only the region intersecting the wordmark flips white.
 */
function drawMoon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  mode: "dark" | "light",
  alpha: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle =
    mode === "light"
      ? `rgba(255,255,255,${alpha})`
      : `rgba(13,13,16,${alpha})`;
  ctx.fill();
}

/**
 * White terminal boot screen.
 */
export function Loader({ onDone, onWaiting }: { onDone: () => void; onWaiting?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const enteredRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const scrambleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrambleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canvasState = useRef({
    angle: Math.PI / 2,
    drawProgress: 0,
    moonX: 1200,
    moonY: 580,
    opacity: 0,
    moonOpacity: 0,
    exitOpacity: 1,
    isExiting: false,
    trail: [] as { x: number; y: number }[]
  });

  const draw = () => {
    const canvasBack = canvasBackRef.current;
    const canvasFront = canvasFrontRef.current;
    if (!canvasBack || !canvasFront) return;

    const ctxBack = canvasBack.getContext("2d");
    const ctxFront = canvasFront.getContext("2d");
    if (!ctxBack || !ctxFront) return;

    // Clear both
    ctxBack.clearRect(0, 0, 2400, 800);
    ctxFront.clearRect(0, 0, 2400, 800);

    const state = canvasState.current;
    const centerX = 1200;
    const centerY = 400;
    const rx = 720; // Original path size (horizontal)
    const ry = 180; // Original path size (vertical)

    // 1. Calculate moon position
    let moonX = 0;
    let moonY = 0;

    if (!state.isExiting) {
      moonX = centerX + rx * Math.cos(state.angle);
      moonY = centerY + ry * Math.sin(state.angle);
      
      // Update trail history
      state.trail.push({ x: moonX, y: moonY });
      if (state.trail.length > 500) {
        state.trail.shift();
      }
    } else {
      moonX = state.moonX;
      moonY = state.moonY;

      // Update trail history with the animated moon position
      state.trail.push({ x: moonX, y: moonY });
      
      // The speed up should ONLY happen once the moon is already outside the view (moonX < -60).
      if (moonX >= -60) {
        if (state.trail.length > 500) {
          state.trail.shift();
        }
      } else {
        // Once the moon is off-screen, speed up trail shrinking:
        // Shift out multiple points from the tail per frame so it zips off-screen!
        for (let k = 0; k < 15; k++) {
          if (state.trail.length > 0) {
            state.trail.shift();
          }
        }
      }
    }

    // 2. Draw solid line trail of the moon (no static orbit line, constant thickness)
    if (state.trail.length > 1) {
      const baseOpacity = state.isExiting ? state.exitOpacity : state.opacity;
      const lineWidth = 6;

      let currentCanvas: "back" | "front" | null = null;
      let pathPoints: { x: number; y: number }[] = [];

      const flushPath = () => {
        if (pathPoints.length < 2 || !currentCanvas) return;
        const ctx = currentCanvas === "back" ? ctxBack : ctxFront;
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
          ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (currentCanvas === "back") {
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.4 * baseOpacity})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`;
        }
        ctx.stroke();
        pathPoints = [];
      };

      for (let i = 0; i < state.trail.length; i++) {
        const pt = state.trail[i];
        const canvasType = (state.isExiting || pt.y < centerY) ? "back" : "front";

        if (canvasType !== currentCanvas) {
          if (pathPoints.length > 0) {
            pathPoints.push(pt); // Connect path to boundary
            flushPath();
          }
          currentCanvas = canvasType;
        }
        pathPoints.push(pt);
      }
      flushPath();
    }

    // 3. Draw the 2.5D moon (shaded sphere + flat craters) — back canvas when
    // upper-half or exiting (ink), front canvas when lower-half (light,
    // inverted by the difference blend for the color flip over the wordmark)
    if (state.moonOpacity > 0) {
      if (state.isExiting || moonY < centerY) {
        drawMoon(ctxBack, moonX, moonY, 60, "dark", state.moonOpacity);
      } else {
        drawMoon(ctxFront, moonX, moonY, 60, "light", state.moonOpacity);
      }
    }
  };

  const [phase, setPhase] = useState<Phase>("loading");
  const [activeLineCount, setActiveLineCount] = useState(0);
  const activeCountRef = useRef(0);

  /* terminal treatment for the proceed prompt: the command line types on,
     the headline scramble-decodes left→right, a block cursor keeps blinking */
  useEffect(() => {
    if (phase !== "waiting") return;
    const prompt = promptRef.current;
    if (!prompt) return;

    gsap.fromTo(
      prompt,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );

    const headEl = prompt.querySelector<HTMLElement>(".proceed-head");
    const HEAD = "CLICK TO PROCEED";
    const timers: ReturnType<typeof setInterval>[] = [];

    if (headEl) {
      let idx = 0;
      const typeTimer = setInterval(() => {
        idx++;
        headEl.textContent = HEAD.slice(0, idx);
        if (idx >= HEAD.length) {
          clearInterval(typeTimer);
        }
      }, 40);
      timers.push(typeTimer);
    }

    return () => timers.forEach(clearInterval);
  }, [phase]);

  /* sci-fi reticle cursor while the intro is up — Cursor.tsx swaps designs
     based on this body class (removed automatically when the Loader leaves) */
  useEffect(() => {
    document.body.classList.add("intro-cursor");
    return () => document.body.classList.remove("intro-cursor");
  }, []);

  /** stop the letter scramble and lock in the final wordmark */
  const settleScramble = () => {
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current);
      scrambleIntervalRef.current = null;
    }
    scrambleTimersRef.current.forEach(clearTimeout);
    scrambleTimersRef.current = [];
    logoRef.current
      ?.querySelectorAll(".aera-letter")
      .forEach((el, i) => (el.textContent = FINAL_LETTERS[i]));
  };

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
        setPhase("waiting");
        onWaiting?.();
      },
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enter(withSound: boolean) {
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

    // Kill any active reveal animations to prevent visual conflicts, and
    // make sure the wordmark reads AERA (not mid-scramble) before it morphs
    settleScramble();
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

    // 1. Fade out the loader elements (terminal log and progress bar),
    //    the orbit ring and the caption — the logo must morph alone
    tl.to(".pointer-events-none.absolute.inset-0.flex.flex-col.justify-between", {
      opacity: 0,
      duration: 0.45,
    });
    // Set canvas exit state
    canvasState.current.isExiting = true;
    canvasState.current.exitOpacity = 1;
    canvasState.current.moonX = 1200;
    canvasState.current.moonY = 580;

    // 1. Animate moon position off-screen in 0.5s
    tl.to(canvasState.current, {
      moonX: -400,
      moonY: 580,
      duration: 0.5,
      ease: "power2.in",
    }, 0);

    // 2. Keep drawing and fade out exitOpacity over 1.0 second (gives time for trail to zip off)
    tl.to(canvasState.current, {
      exitOpacity: 0,
      duration: 1.0,
      ease: "power1.out",
      onUpdate: draw,
    }, 0);

    // Fade out both canvases only after the exit animation completes (1.0s)
    if (canvasFrontRef.current) {
      tl.to(canvasFrontRef.current, { opacity: 0, duration: 0.1 }, 1.0);
    }
    if (canvasBackRef.current) {
      tl.to(canvasBackRef.current, { opacity: 0, duration: 0.1 }, 1.0);
    }
    if (captionRef.current) {
      tl.to(captionRef.current, { opacity: 0, duration: 0.3 }, 0);
    }

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
  }

  /* "AERA" orbital reveal — letters decode while rising, a thin orbit ring
     draws around the wordmark and a satellite dot sweeps over it (flat
     ink-on-paper per spec §0; scramble charset per §4) */
  useEffect(() => {
    if (phase !== "revealing") return;

    const logo = logoRef.current;
    if (!logo) return;
    logo.style.display = "flex";

    const letters = Array.from(logo.querySelectorAll<HTMLElement>(".aera-letter"));
    if (letters.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // spec §7: reveals become fades, no scramble loops
      gsap.set(letters, { yPercent: 0, opacity: 0 });
      gsap.to(letters, { opacity: 1, duration: 0.6, ease: "power2.out" });
      if (captionRef.current) {
        gsap.fromTo(captionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        enter(true);
      }
    });
    revealTlRef.current = tl;

    // -- letters rise from below the mask together (no scramble, no stagger)
    gsap.set(letters, { yPercent: 130, opacity: 1, x: 0 });
    tl.to(letters, {
      yPercent: 0,
      duration: 1.15,
      stagger: 0,
      ease: "power3.out",
    }, 0);

    // -- canvas properties animation (draws and sweeps clockwise starting at t = 0)
    // Initialize canvasState values
    canvasState.current.angle = Math.PI / 2; // bottom center
    canvasState.current.drawProgress = 0;
    canvasState.current.opacity = 0;
    canvasState.current.moonOpacity = 0;
    canvasState.current.isExiting = false;
    canvasState.current.exitOpacity = 1;
    canvasState.current.trail = [];

    tl.to(canvasState.current, {
      opacity: 1,
      moonOpacity: 1,
      drawProgress: 1,
      angle: 2.5 * Math.PI, // 1 full clockwise rotation
      duration: 3.2,
      ease: "power2.inOut",
      onUpdate: draw,
    }, 0);

    // -- mono caption under the wordmark
    if (captionRef.current) {
      tl.fromTo(captionRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.15);
    }

    // -- one tiny registration "misprint" jitter once everything settles
    if (letters[1] && letters[2]) {
      tl.to(letters[1], { x: -3, duration: 0.09, ease: "steps(2)", yoyo: true, repeat: 1 }, 1.55);
      tl.to(letters[2], { x: 3, duration: 0.09, ease: "steps(2)", yoyo: true, repeat: 1 }, 1.55);
    }

    return () => {
      tl.kill();
      revealTlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleOverlayClick = () => {
    if (phase !== "waiting" || enteredRef.current) return;

    try {
      hudAudio.boot();
    } catch {
    }

    const prompt = promptRef.current;
    if (prompt) {
      gsap.to(prompt, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          setPhase("revealing");
        }
      });
    } else {
      setPhase("revealing");
    }
  };

  if (phase === "gone") return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-paper text-ink ${phase === "waiting" ? "cursor-pointer" : ""}`}
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      onClick={handleOverlayClick}
    >
      {phase === "waiting" && (
        <div
          ref={promptRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[10] select-none"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-5 px-6 text-center">
            <h2 className="font-mono text-3xl font-bold uppercase tracking-[0.08em] text-ink md:text-5xl">
              <span className="proceed-head" />
              <span className="animate-pulse text-ink">▊</span>
            </h2>
            <p className="t-micro animate-pulse text-ink-soft">
              ■ CLICK ANYWHERE TO BOOT SYSTEM
            </p>
          </div>
        </div>
      )}
      {/* HUGE centered "AERA" logo with orbit ring + satellite dot */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          {/* Back Orbit layer (drawn behind text, normal blend mode, dark color) */}
          <canvas
            ref={canvasBackRef}
            width={2400}
            height={800}
            className="absolute pointer-events-none z-[1] max-w-none"
            style={{ width: "100vw", height: "33.33vw" }}
          />

          {/* AERA Wordmark in the middle */}
          <div className="aera-letters-wrapper relative z-[2] flex gap-[0.02em] font-display font-black tracking-[-0.08em] text-ink text-[16vw] md:text-[12vw] uppercase select-none overflow-hidden py-2 px-6">
            <span className="aera-letter inline-block">A</span>
            <span className="aera-letter inline-block">E</span>
            <span className="aera-letter inline-block">R</span>
            <span className="aera-letter inline-block">A</span>
          </div>

          {/* Front Orbit layer (drawn in front of text, difference blend mode, white color) */}
          <canvas
            ref={canvasFrontRef}
            width={2400}
            height={800}
            className="absolute pointer-events-none z-[3] max-w-none"
            style={{ mixBlendMode: "difference", width: "100vw", height: "33.33vw" }}
          />
          <p
            ref={captionRef}
            className="t-micro absolute bottom-full mb-6 whitespace-nowrap text-ink-soft opacity-0"
          >
            LUNAR ORBIT INSERTION // 384,400 KM // SECTOR AERA
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-10 md:px-16 md:py-16">
        {/* Top rule */}
        <div className="flex items-baseline justify-between border-t border-ink/25 pt-2">
          <span className="t-micro text-ink-soft">
            GITHUB.COM/AERA0908 // AIRA YNTE // SOFTWARE ENGINEER & SYSTEM ARCHITECT
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
                  isComplete={phase === "waiting" || phase === "revealing" || phase === "ready"}
                />
              ))}
              {(phase === "waiting" || phase === "revealing") && (
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
  const elRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (isComplete) {
      el.innerHTML = `${text}${status ? `<span class="${status === "READY" ? "font-bold text-iris" : "text-iris/80"}"> ${status}</span>` : ""}`;
      return;
    }

    if (!active) {
      el.innerHTML = "";
      return;
    }

    let currentLen = 0;
    let timer: number;

    const typeFast = () => {
      const isFinished = currentLen >= text.length;
      const sliced = text.slice(0, currentLen);
      const cursor = !isFinished ? '<span class="animate-pulse">▊</span>' : '';
      const statusHTML = isFinished && status 
        ? `<span class="${status === "READY" ? "font-bold text-iris" : "text-iris/80"}"> ${status}</span>`
        : "";
      el.innerHTML = `${sliced}${cursor}${statusHTML}`;

      if (!isFinished) {
        currentLen += 2; // Type 2 characters at a time for snappiness
        setTimeout(() => {
          timer = requestAnimationFrame(typeFast);
        }, 16); // Throttle slightly to limit DOM updates to ~30fps
      }
    };

    typeFast();

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [active, isComplete, text, status]);

  if (!active && !isComplete) return null;

  return <p ref={elRef} />;
}
