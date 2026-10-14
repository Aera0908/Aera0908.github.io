"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { hudAudio } from "@/lib/audio";
import { decodeTween } from "@/lib/decode";

type Phase = "loading" | "waiting" | "revealing" | "ready" | "gone";

/** spec §7 — read live, so an OS-level change mid-session is honoured */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INK = "#0d0d10";
const POSTER = "#e6e200";

/* ---------- chamber geometry (SVG viewBox 0 0 400 400, centre 200,200) ---------- */

const C = 200;
const RING_R = 170;
const RING_LEN = +(2 * Math.PI * RING_R).toFixed(1);
/** rounded so server and client render byte-identical SVG */
const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r2(C + r * Math.cos(a)), r2(C + r * Math.sin(a))];
};
const TICKS = Array.from({ length: 48 }, (_, i) => {
  const major = i % 6 === 0;
  const [x1, y1] = polar(major ? 138 : 148, i * 7.5);
  const [x2, y2] = polar(160, i * 7.5);
  return { x1, y1, x2, y2, major };
});
const arcPath = (r: number, from: number, to: number) => {
  const [x1, y1] = polar(r, from);
  const [x2, y2] = polar(r, to);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
/** clamps sit just outside the ring and slide in radially to lock it */
const CLAMPS = [
  { x: 192, y: 2, w: 16, h: 24, from: { y: -60 } },
  { x: 374, y: 192, w: 24, h: 16, from: { x: 60 } },
  { x: 192, y: 374, w: 16, h: 24, from: { y: 60 } },
  { x: 2, y: 192, w: 24, h: 16, from: { x: -60 } },
];
const GAUGE_SEGMENTS = 12;
const STAGES = ["FRAME", "CORE", "LINK"];
/** locking bolts sit this far above/below the seam centre (px) */
const BOLT_OFFSET = 132;
/** circuit traces on the door face, all running toward the lock housing */
const TRACES = [
  "M 60 140 H 300 L 360 200 V 360 L 430 430 H 520",
  "M 60 860 H 280 L 340 800 V 640 L 430 570 H 520",
  "M 130 300 H 220 L 260 340 V 470 H 485",
  "M 130 700 H 240 L 280 660 V 530 H 485",
  "M 20 500 H 200",
  "M 470 90 V 280 L 530 340 V 400",
  "M 470 910 V 720 L 530 660 V 600",
];
const RIVETS = Array.from({ length: 13 }, (_, i) => 30 + i * 45);
/** resting heights of the pressure meter bars (fraction of full) */
const EQ_REST = [0.35, 0.6, 0.45, 0.8, 0.5, 0.7, 0.3, 0.55];
/** the line shown when the doors open: AERA is the destination, not the viewer */
const ARRIVAL_LINE = "NOW ARRIVING";

/**
 * Intro: the poster assembles itself mechanically. Measuring lines draw
 * out, the frame clamps in, then a central chamber builds (ring, ratcheting
 * tick ring, locking arcs, clamps, diamond core). The gate waits for a tap;
 * on proceed, elevator doors slam shut and part to reveal AERA, which then
 * flies into the hero while the yellow layer wipes away.
 */
export function Loader({ onDone, onWaiting }: { onDone: () => void; onWaiting?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const doorsRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const buildTlRef = useRef<gsap.core.Timeline | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const launchedRef = useRef(false);

  const onWaitingRef = useRef(onWaiting);
  useEffect(() => {
    onWaitingRef.current = onWaiting;
  }, [onWaiting]);

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  /* camera waits below its rest pose until the loader lifts (see arrive()) */
  useEffect(() => {
    if (!prefersReducedMotion()) hudState.introArrival = 1;
    return () => {
      gsap.killTweensOf(hudState, "introArrival");
      hudState.introArrival = 0;
    };
  }, []);

  /** rise the camera into place — its own tween so it never delays onDone */
  function arrive(duration: number, ease: string | gsap.EaseFunction) {
    gsap.killTweensOf(hudState, "introArrival");
    if (prefersReducedMotion()) {
      hudState.introArrival = 0;
      return;
    }
    gsap.to(hudState, { introArrival: 0, duration, ease });
  }

  const [phase, setPhase] = useState<Phase>("loading");

  /* reticle cursor only while the boot screen is up. Keyed on phase, not
     mount: the Loader stays mounted (rendering null) after the intro, so a
     mount-only cleanup left the reticle on for the whole visit. */
  const introActive = phase !== "gone";
  useEffect(() => {
    if (!introActive) return;
    document.body.classList.add("intro-cursor");
    return () => document.body.classList.remove("intro-cursor");
  }, [introActive]);

  /* ---------- build sequence: the screen assembles itself ----------
     Layout effect so the hidden start states land before first paint.
     Every shape starts hidden in markup (opacity-0 / full dash offset), so
     the server-rendered frame never flashes a finished build. */
  useLayoutEffect(() => {
    const root = overlayRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => {
          const pct = Math.round(tl.progress() * 100);
          if (pctRef.current) pctRef.current.textContent = String(pct);
          if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
        },
        onComplete: () => {
          if (enteredRef.current) return;
          setPhase("waiting");
          onWaitingRef.current?.();
        },
      });
      buildTlRef.current = tl;

      // 1. measuring lines draw out from the centre
      tl.fromTo(".k-hline", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.4, ease: MOTION.snap }, 0);
      tl.fromTo(".k-vline", { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 0.4, ease: MOTION.snap }, 0.08);

      // 2. frame brackets fly in from the centre and clamp to the corners
      tl.fromTo(
        ".k-corner",
        {
          opacity: 0,
          scale: 0.5,
          x: (i: number) => (i % 2 === 0 ? 70 : -70),
          y: (i: number) => (i < 2 ? 70 : -70),
        },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.45, ease: MOTION.servo, stagger: 0.05 },
        0.2,
      );
      tl.fromTo(".k-rail", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.35, ease: MOTION.snap }, 0.35);
      tl.set(".k-rail-text", { opacity: 1 }, 0.45);
      const railText = root.querySelector<HTMLElement>(".k-rail-text");
      if (railText) tl.add(decodeTween(railText, { duration: 0.45 }), 0.45);

      // 3. the chamber: ring draws, tick ring ratchets, arcs lock, clamps engage
      tl.to(".k-ring", { strokeDashoffset: 0, duration: 0.7, ease: "power3.inOut" }, 0.45);
      tl.fromTo(".k-ticks", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: MOTION.glitch }, 0.6);
      [1.0, 1.25, 1.5].forEach((at, i) => {
        tl.to(".k-ticks", { rotation: (i + 1) * 15, svgOrigin: "200 200", duration: 0.12, ease: MOTION.servo }, at);
      });
      tl.fromTo(
        ".k-arc-a",
        { opacity: 1, rotation: -140, svgOrigin: "200 200" },
        { rotation: 0, svgOrigin: "200 200", duration: 0.6, ease: MOTION.servo },
        0.75,
      );
      tl.fromTo(
        ".k-arc-b",
        { opacity: 1, rotation: 140, svgOrigin: "200 200" },
        { rotation: 0, svgOrigin: "200 200", duration: 0.6, ease: MOTION.servo },
        0.8,
      );
      tl.fromTo(
        ".k-clamp",
        { opacity: 0, x: (i: number) => CLAMPS[i].from.x ?? 0, y: (i: number) => CLAMPS[i].from.y ?? 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.32, ease: MOTION.servo, stagger: 0.06 },
        1.05,
      );
      tl.fromTo(
        ".k-diamond",
        { opacity: 1, scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.4, ease: MOTION.servo },
        1.3,
      );
      tl.fromTo(
        ".k-core",
        { opacity: 1, scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.15, ease: "steps(3)" },
        1.6,
      );

      // 4. side modules: power gauge fills, hazard strip docks, status plate
      tl.fromTo(
        ".k-seg",
        { opacity: 0.15 },
        { opacity: 1, duration: 0.01, stagger: 0.14 },
        0.5,
      );
      tl.fromTo(".k-gauge", { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.35, ease: MOTION.servo }, 0.3);
      tl.fromTo(".k-hazard", { opacity: 1, xPercent: 160 }, { xPercent: 0, duration: 0.5, ease: MOTION.servo }, 1.4);
      tl.fromTo(
        ".k-status",
        { opacity: 1, scaleX: 0, transformOrigin: "100% 50%" },
        { scaleX: 1, duration: 0.3, ease: MOTION.snap },
        0.5,
      );
      tl.fromTo(".k-stages", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: MOTION.glitch }, 0.4);
      [0.6, 1.5, 2.2].forEach((at, i) => {
        tl.fromTo(
          `.k-stage-fill-${i}`,
          { scale: 0 },
          { scale: 1, duration: 0.12, ease: "steps(3)" },
          at,
        );
      });

      // 5. measuring lines recede once the build has locked
      tl.to([".k-hline", ".k-vline"], { opacity: 0.25, duration: 0.3, ease: MOTION.snap }, 2.2);

      if (prefersReducedMotion()) tl.progress(1);
    }, root);

    return () => {
      buildTlRef.current = null;
      ctx.revert();
    };
  }, []);

  /* ---------- gate: prompt plate snaps in, tick ring idles on a ratchet ---------- */
  useEffect(() => {
    if (phase !== "waiting") return;
    const prompt = promptRef.current;
    const plate = prompt?.querySelector<HTMLElement>(".k-plate");
    const label = prompt?.querySelector<HTMLElement>(".k-plate-text");
    if (!prompt || !plate) return;

    const tl = gsap.timeline();
    tl.set(prompt, { opacity: 1 });
    tl.fromTo(plate, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: MOTION.snap });
    if (label) tl.add(decodeTween(label, { duration: 0.45 }), 0.12);
    tl.fromTo(".k-plate-sub", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: MOTION.glitch }, 0.35);

    // one ratchet click every couple of seconds — the only idle motion
    let idle: gsap.core.Tween | null = null;
    const ratchet = () => {
      idle = gsap.to(".k-ticks", {
        rotation: "+=7.5",
        svgOrigin: "200 200",
        duration: 0.14,
        ease: MOTION.servo,
        onComplete: () => {
          idle = gsap.delayedCall(2.2, ratchet);
        },
      });
    };
    if (!prefersReducedMotion()) idle = gsap.delayedCall(1.2, ratchet);

    return () => {
      tl.kill();
      idle?.kill();
      gsap.killTweensOf(".k-ticks");
    };
  }, [phase]);

  /**
   * Hand over to the site. `viaDoors`: the bulkhead reveal already removed
   * the poster and started the camera, so only the logo flight remains.
   */
  function enter(withSound: boolean, viaDoors = false) {
    if (enteredRef.current) return;
    enteredRef.current = true;

    try {
      hudAudio.boot();
      hudAudio.setMuted(!withSound);
    } catch (e) {
      console.warn("Audio autoplay blocked by browser policy.", e);
    }

    // continues the liftoff: the camera keeps climbing and docks as the
    // yellow layer wipes up (bg wipe below runs 0.08s → 1.28s)
    if (!viaDoors) arrive(2.4, MOTION.servo);

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

    // 1. Fade out the poster frame chrome (or, via the doors, the arrival line)
    if (!viaDoors) tl.to(".boot-chrome", { opacity: 0, duration: 0.4, ease: "power2.out" }, 0);
    else tl.to(".k-arrive", { opacity: 0, y: "-=12", duration: 0.3, ease: MOTION.snap }, 0);

    // 2. Wipe the yellow background layer up via clipPath
    if (bgLayerRef.current && !viaDoors) {
      tl.to(
        bgLayerRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
        },
        0.08,
      );
    }

    // 3. FLIP morph: move & scale the AERA logo directly onto the Hero target
    if (target && source) {
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const dx =
        targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
      const dy =
        targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
      const scale = targetRect.width / sourceRect.width;

      tl.to(
        logo,
        {
          x: dx,
          y: dy,
          scale,
          duration: viaDoors ? 1.1 : 1.25,
          ease: "power3.inOut",
          transformOrigin: "50% 50%",
        },
        viaDoors ? 0 : 0.08,
      );

      // ink → paper as the yellow layer lifts
      if (!viaDoors) tl.to(letters, { color: "#f4f3ee", duration: 0.95, ease: "power2.inOut" }, 0.2);
    }
  }

  /* ---------- reveal: bulkhead doors close, lock, pressurise, release ----------
     Heavy on purpose: hydraulic travel with a damper, an impact rebound,
     a ratcheting lock dial and bolts, then a hiss, a stiff crack open and
     a two-stage push apart. About 3.8s from the click. */
  useEffect(() => {
    if (phase !== "revealing") return;

    const logo = logoRef.current;
    const doors = doorsRef.current;
    if (!logo || !doors) {
      enter(true);
      return;
    }
    const letters = Array.from(logo.querySelectorAll<HTMLElement>(".aera-letter"));
    const arriveText = overlayRef.current?.querySelector<HTMLElement>(".k-arrive-text") ?? null;
    const sfx = (fn: () => void) => () => {
      try {
        fn();
      } catch {}
    };

    const showLogo = () => {
      gsap.set([".k-chamber", ".k-hline", ".k-vline"], { opacity: 0 });
      logo.style.display = "flex";
    };

    if (prefersReducedMotion()) {
      showLogo();
      enter(true);
      return;
    }

    gsap.set(".k-door-l", { xPercent: -101 });
    gsap.set(".k-door-r", { xPercent: 101 });
    doors.style.visibility = "visible";

    const tl = gsap.timeline();
    revealTlRef.current = tl;

    // power is diverted: the chamber dims in steps as the rams engage
    tl.to(".k-chamber", { opacity: 0.35, duration: 0.2, ease: "steps(3)" }, 0);

    // 1. hydraulic close: slow to start, cushioned by the damper
    tl.call(sfx(() => hudAudio.hydraulic(0.95)), [], 0.05);
    tl.to(".k-door-l", { xPercent: 0, duration: 0.95, ease: MOTION.hydraulic }, 0.1);
    tl.to(".k-door-r", { xPercent: 0, duration: 0.95, ease: MOTION.hydraulic }, 0.1);
    // chevrons run toward the seam while the doors travel
    tl.to(
      ".k-chev",
      { keyframes: { opacity: [0.25, 1, 0.25] }, duration: 0.32, ease: "none", stagger: 0.08, repeat: 2 },
      0.1,
    );

    // 2. impact: rebound off the stop, inner plates carry on a beat
    const hit = 1.05;
    tl.call(
      () => {
        // behind the sealed doors the poster is struck: they open onto the
        // live world, with AERA in paper white waiting at the centre
        showLogo();
        if (bgLayerRef.current) bgLayerRef.current.style.visibility = "hidden";
        gsap.set(letters, { yPercent: 40, opacity: 0, x: 0, color: "#f4f3ee" });
        sfx(() => hudAudio.thump())();
      },
      [],
      hit - 0.01,
    );
    tl.to(".k-door-l", { keyframes: { xPercent: [-1.4, 0] }, duration: 0.3, ease: "power2.out" }, hit);
    tl.to(".k-door-r", { keyframes: { xPercent: [1.4, 0] }, duration: 0.3, ease: "power2.out" }, hit);
    tl.to(".k-door-inner-l", { keyframes: { x: [9, -3, 0] }, duration: 0.34, ease: "none" }, hit);
    tl.to(".k-door-inner-r", { keyframes: { x: [-9, 3, 0] }, duration: 0.34, ease: "none" }, hit);
    tl.to(doors, { keyframes: { y: [5, -4, 2, 0] }, duration: 0.26, ease: "none" }, hit);

    // 3. lock: dial seats, traces power up toward it, dial ratchets, bolts fire
    tl.fromTo(".k-lock", { opacity: 1, scale: 0.7 }, { scale: 1, duration: 0.16, ease: "steps(3)" }, hit + 0.12);
    tl.to(".k-trace", { strokeDashoffset: 0, duration: 0.55, ease: "power2.in", stagger: 0.04 }, hit + 0.12);
    // pressure meter jitters while the chamber is held
    tl.to(
      ".k-eq",
      {
        scaleY: () => gsap.utils.random(0.15, 1),
        duration: 0.07,
        ease: "steps(1)",
        repeat: 22,
        repeatRefresh: true,
        stagger: 0.015,
      },
      hit + 0.12,
    );
    [0.45, 0.72, 0.99].forEach((at, i) => {
      tl.to(".k-dial", { rotation: (i + 1) * 30, svgOrigin: "130 130", duration: 0.13, ease: MOTION.servo }, hit + at);
      tl.call(sfx(() => hudAudio.ratchet()), [], hit + at);
      tl.to(`.k-pip-${i}`, { scale: 1, duration: 0.1, ease: "steps(2)" }, hit + at);
      tl.to([".k-door-l", ".k-door-r"], { keyframes: { x: [2, -1, 0] }, duration: 0.1, ease: "none" }, hit + at + 0.02);
    });
    tl.to(".k-bolt", { scaleX: 1, duration: 0.16, ease: "power4.in", stagger: 0.05 }, hit + 0.6);
    tl.call(sfx(() => hudAudio.thump(0.1)), [], hit + 0.76);
    tl.to(".k-seal-fill", { scaleX: 1, duration: 0.36, ease: "steps(6)" }, hit + 1.1);

    // 4. release: dial spins back, bolts retract, pressure vents
    const rel = hit + 1.6;
    tl.to(".k-dial", { rotation: -30, svgOrigin: "130 130", duration: 0.3, ease: MOTION.servo }, rel);
    tl.to(".k-bolt", { scaleX: 0, duration: 0.14, ease: "power3.in", stagger: 0.04 }, rel + 0.08);
    tl.call(sfx(() => hudAudio.hiss(1.0)), [], rel + 0.1);
    tl.to(".k-pip", { scale: 0, duration: 0.1, ease: "steps(2)", stagger: 0.05 }, rel + 0.05);
    tl.to(".k-eq", { scaleY: 0.1, duration: 0.3, ease: MOTION.snap, stagger: 0.02 }, rel + 0.1);
    tl.to(".k-seal-fill", { scaleX: 0, duration: 0.3, ease: "steps(6)" }, rel + 0.1);
    tl.to(".k-lock", { scale: 0.7, opacity: 0, duration: 0.16, ease: "steps(3)" }, rel + 0.35);

    // 5. crack open against resistance: stick, slip, stick
    const crack = rel + 0.45;
    // the camera starts its climb as the seal breaks, so the world is
    // already moving when the first light comes through the seam
    tl.call(() => arrive(2.6, MOTION.servo), [], crack - 0.05);
    tl.to(".k-door-l", { keyframes: { xPercent: [-1.2, -1, -2.8, -2.6, -4.5] }, duration: 0.55, ease: "none" }, crack);
    tl.to(".k-door-r", { keyframes: { xPercent: [1.2, 1, 2.8, 2.6, 4.5] }, duration: 0.55, ease: "none" }, crack);

    // 6. the rams push the doors apart; AERA docks as the light comes in
    const open = crack + 0.7;
    tl.call(sfx(() => hudAudio.hydraulic(0.8)), [], open - 0.05);
    tl.to(".k-door-l", { xPercent: -101, duration: 0.85, ease: MOTION.hydraulicOpen }, open);
    tl.to(".k-door-r", { xPercent: 101, duration: 0.85, ease: MOTION.hydraulicOpen }, open);

    // 7. arrival: the line decodes over the world, lifts, and the AERA sign
    // docks beneath it, like a floor indicator naming the destination
    tl.set(".k-arrive", { opacity: 1, y: 0 }, open + 0.45);
    tl.call(sfx(() => hudAudio.blip()), [], open + 0.45);
    if (arriveText) tl.add(decodeTween(arriveText, { duration: 0.55, text: ARRIVAL_LINE }), open + 0.45);
    tl.to(".k-arrive-rule", { scaleX: 1, duration: 0.45, ease: MOTION.snap }, open + 0.55);
    tl.to(
      ".k-arrive",
      {
        y: () => {
          const wrap = logo.querySelector<HTMLElement>(".aera-letters-wrapper");
          const msg = overlayRef.current?.querySelector<HTMLElement>(".k-arrive");
          if (!wrap || !msg) return -120;
          return -(wrap.offsetHeight / 2 + msg.offsetHeight / 2 - 4);
        },
        duration: 0.45,
        ease: MOTION.servo,
      },
      open + 1.5,
    );
    tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.45, ease: MOTION.servo, stagger: 0.06 }, open + 1.55);
    tl.call(sfx(() => hudAudio.confirm()), [], open + 1.6);
    tl.call(() => enter(true, true), [], open + 2.45);

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

    buildTlRef.current?.kill();
    revealTlRef.current?.kill();
    revealTlRef.current = null;

    try {
      hudAudio.boot();
      hudAudio.setMuted(false);
    } catch {}

    arrive(0.9, MOTION.snap);

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
        scaleX: 0,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
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
    <div ref={overlayRef} className="fixed inset-0 z-[100] pointer-events-none">
      {/* Yellow poster layer (click anywhere to proceed) */}
      <div
        ref={bgLayerRef}
        onClick={phase === "waiting" ? proceed : undefined}
        className={`absolute inset-0 overflow-hidden select-none font-mono pointer-events-auto ${
          phase === "waiting" ? "cursor-pointer" : ""
        }`}
        style={{ clipPath: "inset(0% 0% 0% 0%)", background: POSTER, color: INK }}
      >
        {/* risograph grain */}
        <div
          className="pointer-events-none absolute -inset-20 z-10 opacity-[0.06] mix-blend-multiply select-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='posterNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23posterNoise)'/%3E%3C/svg%3E")`,
            animation: "grain-shift 0.22s steps(6) infinite",
          }}
          aria-hidden="true"
        />

        <div className="boot-chrome pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          {/* measuring lines */}
          <div className="k-hline absolute left-0 right-0 top-1/2 h-px opacity-0" style={{ background: INK }} />
          <div className="k-vline absolute top-0 bottom-0 left-1/2 w-px opacity-0" style={{ background: INK }} />

          {/* frame brackets */}
          <div className="k-corner absolute left-4 top-4 h-6 w-6 border-l-[3px] border-t-[3px] opacity-0" style={{ borderColor: INK }} />
          <div className="k-corner absolute right-4 top-4 h-6 w-6 border-r-[3px] border-t-[3px] opacity-0" style={{ borderColor: INK }} />
          <div className="k-corner absolute left-4 bottom-4 h-6 w-6 border-l-[3px] border-b-[3px] opacity-0" style={{ borderColor: INK }} />
          <div className="k-corner absolute right-4 bottom-4 h-6 w-6 border-r-[3px] border-b-[3px] opacity-0" style={{ borderColor: INK }} />

          {/* top rail */}
          <div className="absolute left-6 top-8 md:left-12 md:top-12 w-[min(22rem,70vw)]">
            <div className="k-rail h-[2px] origin-left opacity-0" style={{ background: INK }} />
            <p className="k-rail-text t-micro mt-2 font-bold opacity-0">GITHUB.COM/AERA0908 // SOFTWARE &amp; SYSTEMS</p>
          </div>

          {/* power gauge (desktop) */}
          <div className="k-gauge absolute left-12 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-1 opacity-0 md:flex">
            <span className="t-micro mb-1 font-bold">PWR</span>
            {Array.from({ length: GAUGE_SEGMENTS }).map((_, i) => (
              <span key={i} className="k-seg block h-3 w-4 opacity-[0.15]" style={{ background: INK }} />
            ))}
          </div>

          {/* hazard strip (desktop) */}
          <div
            className="k-hazard absolute right-12 top-1/2 hidden h-44 w-3 -translate-y-1/2 opacity-0 md:block"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${INK} 0 6px, transparent 6px 12px)`,
            }}
          />

          {/* build stages */}
          <div className="k-stages absolute bottom-10 left-6 flex gap-4 opacity-0 md:bottom-12 md:left-12">
            {STAGES.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5 t-micro font-bold">
                <span className="relative block h-2.5 w-2.5 border-2" style={{ borderColor: INK }}>
                  <span
                    className={`k-stage-fill-${i} absolute inset-0`}
                    style={{ background: INK, transform: "scale(0)" }}
                  />
                </span>
                {s}
              </span>
            ))}
          </div>

          {/* status plate */}
          <div
            className="k-status absolute bottom-10 right-6 w-40 border-2 px-3 py-2 opacity-0 md:bottom-12 md:right-12 md:w-48"
            style={{ borderColor: INK }}
          >
            <div className="h-1 w-full" style={{ background: `${INK}33` }}>
              <div ref={progressBarRef} className="h-full" style={{ width: "0%", background: INK }} />
            </div>
            <span className="t-micro mt-1.5 flex justify-between font-bold">
              <span>{phase === "loading" ? "ASSEMBLING" : "READY"}</span>
              <span>
                <span ref={pctRef}>0</span>%
              </span>
            </span>
          </div>
        </div>

        {/* Japanese vertical accent, translates on proceed */}
        <div className="pointer-events-none absolute right-6 top-6 z-30 hidden items-start gap-3 sm:flex md:right-12 md:top-10">
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] [writing-mode:vertical-rl]">
            <JapaneseDecoder isEnglish={phase === "revealing" || phase === "ready"} />
          </div>
          <div
            className={`w-2.5 transition-all duration-500 ease-out ${
              phase === "revealing" || phase === "ready" ? "h-28" : "h-20"
            }`}
            style={{ background: INK }}
          />
        </div>

        {/* the chamber */}
        <div className="k-chamber pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative aspect-square w-[min(78vw,56vh,520px)]">
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <circle
                className="k-ring"
                cx={C}
                cy={C}
                r={RING_R}
                fill="none"
                stroke={INK}
                strokeWidth={2}
                strokeDasharray={RING_LEN}
                strokeDashoffset={RING_LEN}
                transform={`rotate(-90 ${C} ${C})`}
              />
              <g className="k-ticks opacity-0">
                {TICKS.map((t, i) => (
                  <line
                    key={i}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={INK}
                    strokeWidth={t.major ? 3 : 1.5}
                  />
                ))}
              </g>
              <path className="k-arc-a opacity-0" d={arcPath(186, -40, 40)} fill="none" stroke={INK} strokeWidth={9} />
              <path className="k-arc-b opacity-0" d={arcPath(186, 140, 220)} fill="none" stroke={INK} strokeWidth={9} />
              {CLAMPS.map((c, i) => (
                <rect key={i} className="k-clamp opacity-0" x={c.x} y={c.y} width={c.w} height={c.h} fill={INK} />
              ))}
              <polygon
                className="k-diamond opacity-0"
                points="200,150 250,200 200,250 150,200"
                fill="none"
                stroke={INK}
                strokeWidth={3}
              />
              <polygon className="k-core opacity-0" points="200,180 220,200 200,220 180,200" fill={INK} />
            </svg>

            {/* gate prompt plate, docked under the chamber */}
            {phase === "waiting" && (
              <div
                ref={promptRef}
                className="pointer-events-auto absolute left-1/2 top-[calc(100%+1.25rem)] z-30 -translate-x-1/2"
                style={{ opacity: 0 }}
              >
                <ProceedPrompt onProceed={proceed} />
              </div>
            )}
          </div>
        </div>

        {/* Skip intro: upper centre on mobile, bottom centre on desktop */}
        {(phase === "loading" || phase === "waiting") && (
          <div className="absolute left-1/2 top-[5.25rem] z-30 -translate-x-1/2 pointer-events-auto md:top-auto md:bottom-8">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                skipIntro();
              }}
              aria-label="Skip intro and go straight to the site"
              className="flex min-h-[38px] cursor-pointer items-center justify-center whitespace-nowrap rounded-xs border-2 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] transition-colors hover:bg-[#0d0d10] hover:text-[#fcee0a] focus-visible:outline-2 focus-visible:outline-[#0d0d10] active:translate-y-[2px] md:min-h-[40px] md:text-xs"
              style={{ borderColor: INK, background: POSTER, color: INK }}
            >
              SKIP INTRO →
            </button>
          </div>
        )}
      </div>

      {/* arrival line: shown when the doors open, then lifts above AERA */}
      <div
        className="k-arrive pointer-events-none absolute inset-x-0 top-1/2 z-[115] flex -translate-y-1/2 flex-col items-center gap-3"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <p className="k-arrive-text font-mono text-xs font-black tracking-[0.5em] md:text-sm" style={{ color: "#f4f3ee" }}>
          {ARRIVAL_LINE}
        </p>
        <span className="k-arrive-rule block h-[2px] w-40 md:w-72" style={{ background: POSTER, transform: "scaleX(0)" }} />
      </div>

      {/* AERA logo (outside the clipped layer so the wipe never cuts it) */}
      <div ref={logoRef} className="pointer-events-none absolute inset-0 z-[110] hidden items-center justify-center">
        <div className="aera-letters-wrapper relative z-[2] flex gap-[0.02em] overflow-hidden px-8 py-4 font-display text-[16vw] font-black uppercase leading-none tracking-[-0.08em] select-none md:text-[12vw]" style={{ color: INK }}>
          <span className="aera-letter inline-block">A</span>
          <span className="aera-letter inline-block">E</span>
          <span className="aera-letter inline-block">R</span>
          <span className="aera-letter inline-block">A</span>
        </div>
      </div>

      {/* bulkhead doors: parked off-screen until the reveal */}
      <div
        ref={doorsRef}
        className="pointer-events-none absolute inset-0 z-[120] overflow-hidden"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        <div className="k-door-l absolute inset-y-0 left-0 w-1/2 overflow-hidden" style={{ background: INK }}>
          <DoorFace side="l" />
        </div>
        <div className="k-door-r absolute inset-y-0 right-0 w-1/2 overflow-hidden" style={{ background: INK }}>
          <DoorFace side="r" />
        </div>

        {/* locking bolts: shoot from the port door across the seam */}
        {[-1, 1].map((dir) => (
          <div
            key={dir}
            className="k-bolt absolute left-1/2 -ml-[90px] h-4 w-[180px] border-2"
            style={{
              top: `calc(50% + ${dir * BOLT_OFFSET}px - 8px)`,
              borderColor: INK,
              backgroundImage: `repeating-linear-gradient(90deg, ${POSTER} 0 14px, ${INK} 14px 18px)`,
              transform: "scaleX(0)",
              transformOrigin: "0% 50%",
            }}
          />
        ))}

        {/* lock dial: appears once the halves of the housing meet */}
        <div
          className="k-lock absolute left-1/2 top-1/2 h-[200px] w-[200px] -ml-[100px] -mt-[100px] md:h-[240px] md:w-[240px] md:-ml-[120px] md:-mt-[120px]"
          style={{ opacity: 0 }}
        >
          <svg viewBox="0 0 260 260" className="h-full w-full overflow-visible">
            <polygon points="130,22 122,8 138,8" fill={POSTER} />
            <g className="k-dial">
              <circle cx={130} cy={130} r={86} fill={INK} stroke={POSTER} strokeWidth={5} />
              {Array.from({ length: 8 }, (_, i) => (
                <rect
                  key={i}
                  x={125}
                  y={36}
                  width={10}
                  height={20}
                  fill={POSTER}
                  transform={`rotate(${i * 45} 130 130)`}
                />
              ))}
              <circle cx={130} cy={130} r={58} fill="none" stroke={POSTER} strokeWidth={1.5} strokeDasharray="4 6" />
              <rect x={127} y={84} width={6} height={92} fill={POSTER} />
              <rect x={84} y={127} width={92} height={6} fill={POSTER} />
              <circle cx={130} cy={130} r={16} fill={INK} stroke={POSTER} strokeWidth={3} />
            </g>
          </svg>
          {/* status pips: one fills per ratchet click */}
          <div className="absolute left-1/2 top-full mt-12 flex -translate-x-1/2 gap-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="relative block h-3.5 w-3.5 border-2" style={{ borderColor: POSTER }}>
                <span
                  className={`k-pip k-pip-${i} absolute inset-[2px]`}
                  style={{ background: POSTER, transform: "scale(0)" }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One bulkhead door. The SVG is drawn for the port side with the seam at
 * x=600; the starboard door mirrors it. Labels stay outside the mirror so
 * they read the right way round.
 */
function DoorFace({ side }: { side: "l" | "r" }) {
  const port = side === "l";
  return (
    <div className={`k-door-inner-${side} absolute inset-0`}>
      <svg
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-0 h-full w-full"
        style={port ? undefined : { transform: "scaleX(-1)" }}
      >
        {/* recessed panels with clipped corners */}
        <path d="M 40 60 H 520 L 560 100 V 400 H 40 Z" fill="none" stroke={POSTER} strokeOpacity={0.18} strokeWidth={2} />
        <path d="M 40 600 H 560 V 900 L 520 940 H 40 Z" fill="none" stroke={POSTER} strokeOpacity={0.18} strokeWidth={2} />
        <line x1={0} y1={455} x2={480} y2={455} stroke={POSTER} strokeOpacity={0.3} strokeWidth={2} />
        <line x1={0} y1={545} x2={480} y2={545} stroke={POSTER} strokeOpacity={0.3} strokeWidth={2} />
        {RIVETS.map((x) => (
          <g key={x} fill={POSTER} fillOpacity={0.4}>
            <circle cx={x} cy={26} r={3.5} />
            <circle cx={x} cy={974} r={3.5} />
          </g>
        ))}
        {/* dormant traces, then the live copies that power up on lock */}
        {TRACES.map((d) => (
          <path key={d} d={d} fill="none" stroke={POSTER} strokeOpacity={0.14} strokeWidth={2} />
        ))}
        {TRACES.map((d) => (
          <path
            key={`live-${d}`}
            className="k-trace"
            d={d}
            fill="none"
            stroke={POSTER}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        ))}
        {TRACES.map((d) => {
          const [x, y] = d.slice(2).split(" ").map(Number);
          return <circle key={`via-${d}`} cx={x} cy={y} r={6} fill={INK} stroke={POSTER} strokeOpacity={0.6} strokeWidth={2} />;
        })}
        {/* half of the lock housing: the two halves meet into one ring */}
        <path d="M 600 382 A 118 118 0 0 0 600 618" fill={INK} stroke={POSTER} strokeWidth={4} />
        <path d="M 600 408 A 92 92 0 0 0 600 592" fill="none" stroke={POSTER} strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="3 6" />
      </svg>

      {/* seam edge: a thin solid line, so the doors read as meeting */}
      <div className={`absolute inset-y-0 w-[2px] ${port ? "right-0" : "left-0"}`} style={{ background: POSTER }} />
      {/* bolt sockets on the seam */}
      {[-1, 1].map((dir) => (
        <div
          key={dir}
          className={`absolute h-5 w-12 border-2 ${port ? "right-3" : "left-3"}`}
          style={{ top: `calc(50% + ${dir * BOLT_OFFSET}px - 10px)`, borderColor: `${POSTER}80` }}
        />
      ))}
      {/* chevrons pointing at the seam + pressure meter, near where the eye is */}
      <div
        className={`absolute top-[14%] flex flex-col gap-3 ${
          port ? "right-8 items-end md:right-16" : "left-8 items-start md:left-16"
        }`}
      >
        <div className={`flex gap-1.5 ${port ? "" : "flex-row-reverse"}`}>
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} viewBox="0 0 10 16" className="k-chev h-4 w-2.5 md:h-5 md:w-3" style={{ opacity: 0.25 }}>
              <polyline
                points={port ? "1,1 8,8 1,15" : "9,1 2,8 9,15"}
                fill="none"
                stroke={POSTER}
                strokeWidth={2.5}
              />
            </svg>
          ))}
        </div>
        <div className={`flex h-8 items-end gap-1 md:h-10 ${port ? "" : "flex-row-reverse"}`}>
          {EQ_REST.map((h, i) => (
            <span
              key={i}
              className="k-eq block h-full w-1.5 md:w-2"
              style={{ background: POSTER, transform: `scaleY(${h})`, transformOrigin: "50% 100%" }}
            />
          ))}
        </div>
      </div>

      {/* pressure-seal gauge with tick marks */}
      <div
        className={`absolute bottom-[14%] flex flex-col gap-1 ${
          port ? "right-8 items-end md:right-16" : "left-8 items-start md:left-16"
        }`}
      >
        <span className="relative block h-2.5 w-24 border-2 md:w-44" style={{ borderColor: POSTER }}>
          <span
            className="k-seal-fill absolute inset-0"
            style={{ background: POSTER, transform: "scaleX(0)", transformOrigin: port ? "100% 50%" : "0% 50%" }}
          />
        </span>
        <span className="flex w-24 justify-between md:w-44">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="block h-1.5 w-[2px]" style={{ background: POSTER }} />
          ))}
        </span>
      </div>
    </div>
  );
}

/** Gate prompt: an ink plate that snaps open and decodes its label */
function ProceedPrompt({ onProceed }: { onProceed: () => void }) {
  const [isMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );
  const label = isMobile ? "TAP TO PROCEED" : "CLICK ANYWHERE TO PROCEED";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onProceed();
      }}
      aria-label="Proceed to portfolio"
      className="group flex flex-col items-center gap-2 text-center cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d0d10]"
    >
      <span
        className="k-plate card-notch block origin-center whitespace-nowrap px-5 py-2.5 font-mono text-xs font-black uppercase tracking-[0.16em] transition-transform duration-150 group-active:translate-y-[2px] md:px-7 md:py-3 md:text-sm"
        style={{ background: INK, color: POSTER, ["--notch" as string]: "12px" }}
      >
        <span className="sr-only">{label}</span>
        <span className="k-plate-text" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="k-plate-sub px-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-0"
        style={{ color: `${INK}bf`, background: POSTER }}>
        [ SYSTEM READY // ANY KEY ALSO WORKS ]
      </span>
    </button>
  );
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
