"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hudAudio } from "@/lib/audio";

type Phase = "loading" | "waiting" | "revealing" | "ready" | "gone";

const FINAL_LETTERS = ["A", "E", "R", "A"];

/** spec §7 — read live, so an OS-level change mid-session is honoured */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/* crater rings for the engraved moon (x offset, y offset, radius — all
   relative to r). The two leading pairs are concentric "walled" craters. */
const CRATER_RINGS: Array<[number, number, number]> = [
  [-0.32, -0.12, 0.2],
  [-0.32, -0.12, 0.12],
  [0.26, 0.22, 0.15],
  [0.26, 0.22, 0.09],
  [0.02, -0.42, 0.11],
  [-0.12, 0.4, 0.09],
  [0.42, -0.18, 0.08],
  [-0.48, 0.18, 0.07],
  [0.12, 0.1, 0.05],
  [-0.2, 0.62, 0.06],
  [0.55, 0.35, 0.05],
  [-0.05, -0.15, 0.04],
  [0.3, -0.5, 0.05],
  [-0.55, -0.35, 0.05],
  [0.65, 0.05, 0.04],
];

/* stipple dots (x, y in the unit disk + dot radius relative to r) — fixed,
   seeded positions so the texture never shimmers between frames. Density is
   biased toward the rim and the lower-left, like an engraving's shading. */
const STIPPLE: Array<[number, number, number]> = (() => {
  let s = 42;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const dots: Array<[number, number, number]> = [];
  let guard = 0;
  while (dots.length < 240 && guard++ < 10000) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand()); // uniform over the disk
    const rimBias = Math.pow(rr, 2.2); // hug the rim
    // canvas +y is down, so lower-left shading peaks around a ≈ 0.75π
    const angleBias = 0.15 + 0.85 * Math.max(0, Math.cos(a - 0.75 * Math.PI));
    if (rand() > rimBias * angleBias) continue;
    dots.push([Math.cos(a) * rr, Math.sin(a) * rr, 0.008 + rand() * 0.016]);
  }
  return dots;
})();

/* ---------------- launch gate ----------------
   The world beyond this screen is a lunar facility, so the boot gate is an
   ignition instrument: hold to spin the thrust gauge up to launch. Engraved
   line-work only — tick rings and a needle, same printed language as the moon
   drawn above (spec §0: flat, no glow). */

/** spec §4 — click-and-hold is 1.2s; release before complete reverses at 2× */
const HOLD_SECONDS = 1.2;

/** gauge geometry in svg user units; 270° sweep opening at the bottom */
const G = { size: 160, cx: 80, cy: 80, r: 62, a0: 135, sweep: 270, arcR: 44 };

const deg2rad = (d: number) => (d * Math.PI) / 180;
const onDial = (deg: number, r: number): [number, number] => [
  G.cx + Math.cos(deg2rad(deg)) * r,
  G.cy + Math.sin(deg2rad(deg)) * r,
];

/** graduated ticks around the dial — every 5th is a major graduation */
const TICKS = Array.from({ length: 46 }, (_, i) => {
  const a = G.a0 + G.sweep * (i / 45);
  const major = i % 5 === 0;
  const [x1, y1] = onDial(a, G.r - (major ? 11 : 6));
  const [x2, y2] = onDial(a, G.r);
  return { x1, y1, x2, y2, major, i };
});

/** the thrust arc the hold inks in; pathLength=1 so dashoffset is just 1-p */
const ARC_PATH = (() => {
  const [x0, y0] = onDial(G.a0, G.arcR);
  const [x1, y1] = onDial(G.a0 + G.sweep, G.arcR);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A ${G.arcR} ${G.arcR} 0 1 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
})();

/**
 * Flat 2D engraved moon (spec §0: printed, no shading gradients): a filled
 * disc with crater rings and stippled texture, like a woodcut print.
 *
 * The disc reads SOLID BLACK over the paper background; only the region a
 * wordmark block sits behind flips to white (the front canvas is CSS
 * difference-blended). The engraving stays visible in both states:
 *  - "dark"  (back canvas, normal blend, upper orbit over paper): ink disc
 *    with paper-toned craters → black moon, light engraving.
 *  - "light" (front canvas, difference blend, lower orbit near the wordmark):
 *    white disc + black craters → over paper it inverts to the SAME black
 *    moon with light engraving; over the wordmark it becomes a white moon
 *    with dark engraving (the reference look).
 */
function drawMoon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  mode: "dark" | "light",
  alpha: number,
) {
  // disc fill and engraving ink are inverted between the two canvases so the
  // difference blend lands on the same "black moon, light art" over paper
  const disc = mode === "light" ? "255,255,255" : "13,13,16";
  const ink = mode === "light" ? "0,0,0" : "244,243,238";

  // solid disc — occludes the orbit trail passing behind the moon
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(${disc},${alpha})`;
  ctx.fill();

  // rim outline
  ctx.lineWidth = Math.max(2, r * 0.05);
  ctx.strokeStyle = `rgba(${ink},${0.9 * alpha})`;
  ctx.stroke();

  // crater rings
  ctx.lineWidth = Math.max(1, r * 0.028);
  ctx.strokeStyle = `rgba(${ink},${0.7 * alpha})`;
  for (const [cx, cy, cr] of CRATER_RINGS) {
    ctx.beginPath();
    ctx.arc(x + cx * r, y + cy * r, cr * r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // stippled texture
  ctx.fillStyle = `rgba(${ink},${0.75 * alpha})`;
  for (const [dx, dy, dr] of STIPPLE) {
    ctx.beginPath();
    ctx.arc(x + dx * r * 0.92, y + dy * r * 0.92, Math.max(0.6, dr * r), 0, 2 * Math.PI);
    ctx.fill();
  }
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

  /* launch gate */
  const arcRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const thrustRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const gateBtnRef = useRef<HTMLButtonElement>(null);
  const holdTweenRef = useRef<gsap.core.Tween | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const launchedRef = useRef(false);

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

    // land keyboard focus on the gate so it is reachable without a pointer
    gateBtnRef.current?.focus({ preventScroll: true });
  }, [phase]);

  /**
   * Paint the scan at progress p (0→1). Written straight to the DOM rather
   * than through state — this runs every frame of the hold.
   */
  const paintLaunch = (p: number) => {
    // p can exceed 1 during the ignition kick so the needle physically
    // overshoots its stop and springs back; the readouts stay clamped.
    const shown = Math.min(1, Math.max(0, p));
    // arc has pathLength=1, so the dash offset is simply the remainder
    arcRef.current?.setAttribute("stroke-dashoffset", String(1 - shown));
    needleRef.current?.setAttribute(
      "transform",
      `rotate(${G.a0 + G.sweep * p} ${G.cx} ${G.cy})`,
    );
    if (thrustRef.current) {
      thrustRef.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
    }
    if (clockRef.current) {
      // counts down to zero as the gauge comes up
      clockRef.current.textContent = (HOLD_SECONDS * (1 - shown)).toFixed(1);
    }

    // Mechanical shake during hold: intensifies as thrust builds from 0% -> 100%
    if (!launchedRef.current && dialRef.current) {
      if (shown > 0) {
        const intensity = Math.pow(shown, 1.2);
        const dx = (Math.random() - 0.5) * 12 * intensity;
        const dy = (Math.random() - 0.5) * 12 * intensity;
        const rot = (Math.random() - 0.5) * 2.4 * intensity;
        gsap.set(dialRef.current, { x: dx, y: dy, rotation: rot });
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { scale: 1 + Math.random() * 0.007 * intensity });
        }
      } else {
        gsap.set(dialRef.current, { x: 0, y: 0, rotation: 0 });
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { scale: 1 });
        }
      }
    }
  };

  const setStatus = (text: string) => {
    if (statusRef.current) statusRef.current.textContent = text;
  };


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
        // a skip may have already torn the intro down
        if (enteredRef.current) return;
        setPhase("waiting");
        onWaiting?.();
      },
    });
    progressTweenRef.current = tween;
    return () => {
      tween.kill();
      progressTweenRef.current = null;
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

    // spec §7: with reduced motion the whole hand-off collapses to one fade —
    // no FLIP morph, no canvas exit flight, no clip-path wipe. It must still
    // finish by calling onDone(), or Home's scroll lock never lifts.
    if (prefersReducedMotion()) {
      settleScramble();
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.killTweensOf([logo, logo.querySelectorAll(".aera-letter")]);
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
    tl.to(".boot-chrome", {
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

    // Every exit from this effect MUST reach enter() — it is the only caller of
    // onDone(), and Home keeps the page hard scroll-locked until onDone fires.
    // Bailing out here (missing node, reduced motion) used to strand the
    // visitor on the boot screen with scrolling disabled and no way forward.
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
      // spec §7: reveals become fades, no scramble loops — then hand off
      gsap.set(letters, { yPercent: 0, opacity: 0 });
      if (captionRef.current) {
        gsap.fromTo(captionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      }
      const fade = gsap.to(letters, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => enter(true),
      });
      return () => {
        fade.kill();
      };
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

  /**
   * Bail out of the entire intro — the boot log, the gate and the AERA reveal.
   * Available from every phase, so it also works while the progress bar is
   * still filling. Skips straight to `gone` rather than into the reveal.
   */
  const skipIntro = () => {
    if (enteredRef.current) return;
    enteredRef.current = true; // also blocks a late enter() / launch()
    launchedRef.current = true;

    progressTweenRef.current?.kill();
    holdTweenRef.current?.kill();
    revealTlRef.current?.kill();
    revealTlRef.current = null;
    settleScramble();
    gsap.killTweensOf(
      [promptRef.current, dialRef.current, logoRef.current].filter(Boolean),
    );

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

  /** hand off to the AERA reveal (previously the whole of the click handler) */
  const leaveGate = () => {
    const prompt = promptRef.current;
    if (prompt) {
      gsap.to(prompt, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => setPhase("revealing"),
      });
    } else {
      setPhase("revealing");
    }
  };

  /** gauge topped out — fire the ignition kick, then release into the reveal */
  const launch = () => {
    if (launchedRef.current || enteredRef.current) return;
    launchedRef.current = true;

    try {
      hudAudio.boot();
      hudAudio.confirm();
    } catch {}

    paintLaunch(1);
    setStatus("IGNITION");

    if (prefersReducedMotion()) {
      leaveGate();
      return;
    }

    /**
     * Real launches are not smooth. The sequence is: engines light and the
     * whole stack rattles while the hold-downs are still clamped, the needle
     * slams its stop and springs back, then release — and the thing barely
     * moves at first before running away from the pad.
     *
     * So the motion is deliberately stuttered (steps easing over random
     * keyframes, not a sine) and the ascent is ease-IN, never ease-out.
     */
    const dial = dialRef.current;
    const prompt = promptRef.current;
    const overlay = overlayRef.current;
    const tl = gsap.timeline({ onComplete: () => setPhase("revealing") });

    // 1) the needle slams past its stop and springs back on the spring
    const kick = { p: 1 };
    tl.to(kick, {
      p: 1.05,
      duration: 0.08,
      ease: "power4.out",
      onUpdate: () => paintLaunch(kick.p),
    }, 0).to(kick, {
      p: 1,
      duration: 0.55,
      ease: "elastic.out(1, 0.3)",
      onUpdate: () => paintLaunch(kick.p),
    }, 0.08);

    // 2) engine light-up — hard mechanical rattle, stepped so it stutters
    if (dial) {
      tl.to(dial, {
        keyframes: {
          x: [-5, 6, -7, 5, -6, 4, -3, 2, 0],
          y: [4, -5, 6, -4, 4, -3, 2, -1, 0],
          rotation: [-0.9, 1.0, -1.1, 0.7, -0.8, 0.5, -0.3, 0.2, 0],
          // easeEach is the PER-SEGMENT ease; `ease` here would quantise the
          // whole sequence instead, holding the first value then snapping to
          // the last — which is exactly what it did before this was fixed.
          easeEach: "steps(1)",
          ease: "none",
          duration: 0.5,
        },
      }, 0);
    }
    // the structure itself shudders — scaled, not translated, so the paper
    // background can never pull away from the viewport edge
    if (overlay) {
      tl.to(overlay, {
        keyframes: {
          scale: [1.006, 1.002, 1.008, 1.003, 1.006, 1.001, 1],
          easeEach: "steps(1)",
          ease: "none",
          duration: 0.5,
        },
        transformOrigin: "50% 100%",
      }, 0);
    }

    // 3) hold-downs release: a beat of dead stillness before it commits
    tl.to({}, { duration: 0.12 }).call(() => setStatus("LIFTOFF"));

    // 4) ascent — barely moves, then runs away. power4.in does the work.
    if (prompt) {
      tl.to(prompt, {
        y: () => -(window.innerHeight * 0.9),
        scale: 0.82,
        duration: 0.62,
        ease: "power4.in",
      }, ">")
        .to(prompt, { opacity: 0, duration: 0.22, ease: "none" }, "<0.4");
    }
    if (overlay) {
      tl.to(overlay, { scale: 1, duration: 0.2 }, "<");
    }
  };

  const pressGate = () => {
    if (phase !== "waiting" || launchedRef.current) return;
    setStatus("IGNITION SEQUENCE");
    holdTweenRef.current?.timeScale(1).play();
  };

  const releaseGate = () => {
    if (phase !== "waiting" || launchedRef.current) return;
    const tw = holdTweenRef.current;
    if (!tw || tw.progress() === 0) return;
    setStatus("HOLD ABORTED");
    tw.timeScale(2).reverse(); // spec §4: release before complete reverses at 2×
  };

  /** keyboard / reduced-motion path: no hold required, launch outright */
  const launchInstant = () => {
    if (phase !== "waiting" || launchedRef.current) return;
    holdTweenRef.current?.pause();
    launch();
  };

  /* the hold tween — mirrors VaultCard's ring so the boot gate teaches the
     same "press and hold" grammar the vault uses later. Declared after
     launch() so the onComplete reference is not a use-before-declare. */
  useEffect(() => {
    if (phase !== "waiting") return;
    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: 1,
      duration: HOLD_SECONDS,
      ease: "none", // spec §4: hold progress is unsmoothed
      paused: true,
      onUpdate: () => paintLaunch(proxy.p),
      onComplete: () => launch(),
      onReverseComplete: () => {
        setStatus("AWAITING LAUNCH AUTHORITY");
        if (dialRef.current) gsap.set(dialRef.current, { x: 0, y: 0, rotation: 0 });
        if (overlayRef.current) gsap.set(overlayRef.current, { scale: 1 });
      },
    });
    holdTweenRef.current = tween;
    paintLaunch(0);
    return () => {
      tween.kill();
      holdTweenRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-paper text-ink ${phase === "waiting" ? "cursor-pointer" : ""}`}
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      onPointerDown={phase === "waiting" ? pressGate : undefined}
      onPointerUp={phase === "waiting" ? releaseGate : undefined}
    >
      {/* Skip — sits above every phase so it is available while the boot log
          is still running, not just at the gate. stopPropagation keeps the
          press off the overlay's hold handler. */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        aria-label="Skip intro and go straight to the site"
        className="absolute left-6 top-5 z-[20] cursor-pointer font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink focus-visible:text-ink md:left-16 md:top-8"
      >
        SKIP INTRO →
      </button>

      {phase === "waiting" && (
        <div
          ref={promptRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-[10] select-none"
          style={{ opacity: 0 }}
        >
          <button
            ref={gateBtnRef}
            type="button"
            /* pointer events bubble from the overlay too, so a press anywhere
               still starts the scan — this element exists so the gate is a real
               focusable control instead of a click-only <div> */
            onPointerDown={pressGate}
            onPointerUp={releaseGate}
            onPointerLeave={releaseGate}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                launchInstant();
              }
            }}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Hold to launch and boot the system. Press and hold, or press Enter."
            /* The gate is auto-focused so keyboard users start here, which
               means the ring shows on load — so it is scoped to the dial and
               reads as instrument chrome. `focus-visible:outline-none` (not
               plain `outline-none`) is required to beat the global
               :focus-visible rule in globals.css on specificity; that global
               ring is also --signal yellow, which is ~1:1 against --paper and
               would be invisible here anyway. */
            className="group flex cursor-pointer flex-col items-center gap-5 px-6 text-center focus-visible:outline-none"
            style={{ touchAction: "manipulation" }}
          >
            {/* thrust gauge */}
            <div
              ref={dialRef}
              className="relative rounded-full group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-ink/70"
            >
              <svg
                viewBox={`0 0 ${G.size} ${G.size}`}
                className="h-[188px] w-[188px] md:h-[224px] md:w-[224px]"
                aria-hidden="true"
              >
                {/* dial face — engraved rings, same line-work as the moon */}
                <circle
                  cx={G.cx}
                  cy={G.cy}
                  r={G.r}
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                />

                {/* graduations */}
                <g strokeLinecap="butt">
                  {TICKS.map((t) => (
                    <line
                      key={t.i}
                      x1={t.x1}
                      y1={t.y1}
                      x2={t.x2}
                      y2={t.y2}
                      stroke="var(--ink)"
                      strokeOpacity={t.major ? 0.55 : 0.25}
                      strokeWidth={t.major ? 1.6 : 1}
                    />
                  ))}
                </g>

                {/* unlit thrust track */}
                <path
                  d={ARC_PATH}
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity="0.14"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* the thrust the hold builds — the one signal element (spec §1) */}
                <path
                  ref={arcRef}
                  d={ARC_PATH}
                  pathLength={1}
                  fill="none"
                  stroke="var(--iris)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />

                {/* Pointer rides the leading edge of the arc rather than
                    pivoting from the centre — a centre needle swept straight
                    through the thrust readout. */}
                <g ref={needleRef} transform={`rotate(${G.a0} ${G.cx} ${G.cy})`}>
                  <line
                    x1={G.cx + G.arcR - 13}
                    y1={G.cy}
                    x2={G.cx + G.arcR + 13}
                    y2={G.cy}
                    stroke="var(--ink)"
                    strokeWidth="2"
                  />
                  <circle cx={G.cx + G.arcR + 13} cy={G.cy} r="2.4" fill="var(--ink)" />
                </g>
              </svg>

              {/* live thrust readout — the dial centre is kept clear for it */}
              <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="font-mono text-2xl font-bold tracking-tight text-ink md:text-3xl">
                  <span ref={thrustRef}>000</span>
                  <span className="text-ink-soft">%</span>
                </span>
                <span className="t-micro text-ink-soft/70">THRUST</span>
              </span>
            </div>

            {/* readouts */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="t-micro text-ink-soft">
                T-MINUS <span ref={clockRef} className="text-ink">0.6</span>
                <span className="mx-2 text-ink/25">|</span>
                DEST. LUNA — 384,400 KM
              </span>

              <span
                ref={statusRef}
                aria-live="polite"
                className="font-mono text-xl font-bold uppercase tracking-[0.08em] text-ink md:text-3xl"
              >
                AWAITING LAUNCH AUTHORITY
              </span>

              <span className="t-micro text-ink-soft group-hover:text-ink">
                ■ PRESS AND HOLD TO LAUNCH
              </span>
            </div>
          </button>
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

      <div className="boot-chrome pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-10 md:px-16 md:py-16">
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
    // BOTH handles must be tracked. Previously only the rAF id was, so the
    // pending setTimeout survived unmount, fired, and scheduled another frame
    // that wrote innerHTML on a detached node — the loop could not be stopped.
    let raf = 0;
    let tick: ReturnType<typeof setTimeout> | undefined;

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
        tick = setTimeout(() => {
          raf = requestAnimationFrame(typeFast);
        }, 16); // Throttle slightly to limit DOM updates to ~30fps
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
