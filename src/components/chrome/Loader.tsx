"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { hudAudio } from "@/lib/audio";
import { decodeTween } from "@/lib/decode";
import * as THREE from "three";
import { CAMERA_PATH, EARTH_DIM, EARTH_PLANE, getLookTarget } from "@/lib/scene";

type Phase = "loading" | "waiting" | "revealing" | "ready" | "gone";

/** spec §7 — read live, so an OS-level change mid-session is honoured */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INK = "#0d0d10";
/** yellow is a highlight only: lamps, the prompt, hazard markings */
const POSTER = "#e6e200";
/** starlight */
const STAR = "#e9ebef";
/** open space outside the shaft */
const SPACE = "#06070a";

/* ---------- the descent ---------- */

/** shaft speed while descending (px/s); everything that streams past uses it */
const DESCENT_SPEED = 650;
/** the rail pattern repeats every RAIL_TILE px, the cross girders every BEAM_TILE px */
const RAIL_TILE = 600;
const BEAM_TILE = 1400;
/**
 * The cab is drawn on a 16:9 rig (SVG viewBox 1600x900) so the window, the
 * shaft behind it and the gate stay registered at any screen size. Wide
 * screens crop it like background-size: cover; tall phones crop to the
 * window and the ceiling and floor run on past the rig.
 */
const RIG_WIDTH = "max(100vw, min(177.78vh, 195vw))";
/**
 * The cab is a real CSS 3D box on a 1600x900 stage: the front wall with the
 * door at z=0, walls/ceiling/floor running CAB_DEPTH toward the camera, the
 * gate GATE_GAP behind the door. With this perspective the near wall edges
 * land exactly at the stage edges (scale P / (P - depth) = 3).
 */
const CAB_PERSPECTIVE = 900;
const CAB_DEPTH = 600;
const GATE_GAP = 60;
/**
 * Walls, ceiling and floor are cut into slices along their depth: a plane
 * that reaches past the camera is culled whole, so each slice is hidden
 * only once you have walked past it.
 */
const SLICE = 60;
const SLICES = CAB_DEPTH / SLICE;
/** the gate's lintel, as a share of the gate height; it parks this far below too */
const LINTEL = 0.26;
/** sparse static stars: x%, y%, size px */
const STARS = [
  [6, 12, 2], [14, 64, 1], [22, 38, 1.5], [31, 82, 1], [38, 8, 1], [44, 56, 2], [52, 91, 1.5],
  [58, 30, 1], [63, 72, 1], [71, 18, 1.5], [77, 47, 1], [84, 88, 2], [91, 26, 1], [96, 61, 1.5],
  [12, 94, 1], [48, 76, 1], [87, 6, 1], [27, 22, 1],
];

/* ---------- lock ---------- */

/** deadbolts sit this far above/below the seam centre (px) */
const BOLT_OFFSET = 104;
/** how far the main latch bar and the deadbolts slide across the seam (px) */
const LATCH_TRAVEL = 72;
const BOLT_TRAVEL = 56;
/** pinion turn for the full latch travel: travel / pitch radius (22px), counter-clockwise */
const GEAR_TURN = -(LATCH_TRAVEL / 22) * (180 / Math.PI);
/* ---------- door face geometry (SVG viewBox 0 0 600 1000, seam at x=600) ---------- */

/** conduits, all feeding the seal; `w` is the pipe's outer bore */
const CONDUITS = [
  { d: "M -20 448 H 548", w: 18, vert: false },
  { d: "M -20 500 H 548", w: 26, vert: false },
  { d: "M -20 552 H 548", w: 18, vert: false },
  { d: "M 150 -20 V 448", w: 14, vert: true },
  { d: "M 150 1020 V 552", w: 14, vert: true },
];
/** micrometeorite shielding: armour plates above and below the conduit tray */
const TILE_W = 165;
const TILE_H = 174;
const TILES = [40, 226, 600, 786].flatMap((y) => [20, 197, 374].map((x) => ({ x, y })));
/** straps holding the conduit bundle to the tray */
const STRAPS = [60, 240, 400];
/** hydraulic rams that drive each door: cylinder runs x 300→470, rod to the seal */
const RAMS = [180, 820];
/** the gasket channel starts here and runs to the seam */
const HAZARD_X = 548;
/** the line shown when the doors open, naming a decoy destination */
const ARRIVAL_LINE = "YOU HAVE ARRIVED AT:";
/** the decoy the sign shows first; same length as AERA so each letter decodes in place */
const DECOY = "MOON";
const AERA = "AERA";

/**
 * Intro: an endless elevator descent. The cab drops down an open shaft with
 * Earth receding overhead, rails and girders streaming past, for as long as
 * the visitor waits. On proceed the car brakes to a stop at an airtight
 * gate that rises into place from below; the gate docks, unlocks and opens
 * on the world, where the destination sign decodes from MOON into AERA and
 * flies into the hero.
 */
export function Loader({ onDone, onWaiting }: { onDone: () => void; onWaiting?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLImageElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const descentRef = useRef<gsap.core.Timeline | null>(null);
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

  /* the intro Earth is the hero's Earth: place it where the WebGL Earth plane
     projects from the rest camera pose. MoonScene holds the WebGL Earth at
     that same screen spot while the arrival camera settles, so it matches
     from the descent through the hero. */
  useLayoutEffect(() => {
    const img = earthRef.current;
    if (!img) return;
    const place = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      CAMERA_PATH.getPoint(0, cam.position);
      cam.lookAt(getLookTarget(0, new THREE.Vector3()));
      cam.updateMatrixWorld();
      // the plane lies parallel to the screen at the rest pose
      const plane = new THREE.Matrix4().compose(
        new THREE.Vector3(0, hudState.earthY, EARTH_PLANE.z),
        cam.quaternion,
        new THREE.Vector3(1, 1, 1),
      );
      const hw = EARTH_PLANE.width / 2;
      const hh = EARTH_PLANE.height / 2;
      const xs: number[] = [];
      const ys: number[] = [];
      for (const [x, y] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) {
        const v = new THREE.Vector3(x, y, 0).applyMatrix4(plane).project(cam);
        xs.push(((v.x + 1) / 2) * w);
        ys.push(((1 - v.y) / 2) * h);
      }
      img.style.left = `${Math.min(...xs)}px`;
      img.style.top = `${Math.min(...ys)}px`;
      img.style.width = `${Math.max(...xs) - Math.min(...xs)}px`;
      img.style.height = `${Math.max(...ys) - Math.min(...ys)}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  /* lock hardware is drawn in rig px (1600 wide); --rig-k keeps it in scale with the door art */
  useLayoutEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    const fit = () => rig.style.setProperty("--rig-k", String(rig.offsetWidth / 1600));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(rig);
    return () => ro.disconnect();
  }, []);

  /* ---------- the descent: loops until the visitor proceeds ----------
     Layout effect so the loop is running before first paint. The screen
     starts black in markup and fades up onto a car already in motion. */
  useLayoutEffect(() => {
    const root = overlayRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to(".k-lights", { opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.1 });
      gsap.delayedCall(1.2, () => {
        if (enteredRef.current) return;
        setPhase("waiting");
        onWaitingRef.current?.();
      });
      if (prefersReducedMotion()) return;

      // one timeline holds every looping layer, so braking is one timeScale ramp
      const d = gsap.timeline();
      d.to(".k-rails", { y: -RAIL_TILE, duration: RAIL_TILE / DESCENT_SPEED, ease: "none", repeat: -1 }, 0);
      d.to(".k-beams", { y: -BEAM_TILE, duration: BEAM_TILE / DESCENT_SPEED, ease: "none", repeat: -1 }, 0);
      // the cab rides the guide rails with a fine, constant rumble
      d.to(
        ".k-cab",
        { y: () => gsap.utils.random(-1.2, 1.2), duration: 0.06, ease: "steps(1)", repeat: -1, repeatRefresh: true },
        0,
      );
      descentRef.current = d;

    }, root);

    return () => {
      descentRef.current = null;
      ctx.revert();
    };
  }, []);

  /* ---------- prompt: the floating line rises in and its label decodes ---------- */
  useEffect(() => {
    if (phase !== "waiting") return;
    const prompt = promptRef.current;
    const plate = prompt?.querySelector<HTMLElement>(".k-plate");
    const label = prompt?.querySelector<HTMLElement>(".k-plate-text");
    if (!prompt || !plate) return;

    const tl = gsap.timeline();
    tl.set(prompt, { opacity: 1 });
    tl.fromTo(plate, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: MOTION.snap });
    if (label) tl.add(decodeTween(label, { duration: 0.45 }), 0.12);
    tl.fromTo(".k-plate-sub", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: MOTION.glitch }, 0.35);

    return () => {
      tl.kill();
    };
  }, [phase]);

  /**
   * Hand over to the site. `viaDoors`: the gate already removed the shaft
   * and started the camera, so only the logo flight remains.
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
    // backdrop wipes up (bg wipe below runs 0.08s → 1.28s)
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

    // 1. Fade out the shaft (or, via the doors, the arrival line)
    if (!viaDoors) tl.to(".k-sway", { opacity: 0, duration: 0.4, ease: "power2.out" }, 0);
    else {
      tl.to(".k-arrive", { opacity: 0, y: "-=12", duration: 0.3, ease: MOTION.snap }, 0);
      tl.to(".k-arrive-scrim", { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0);
    }

    // 2. Wipe the backdrop up via clipPath
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

      // ink → paper as the backdrop lifts
      if (!viaDoors) tl.to(letters, { color: "#f4f3ee", duration: 0.95, ease: "power2.inOut" }, 0.2);
    }
  }

  /* ---------- arrival: brake, dock, unlock, open ----------
     The descent decelerates linearly to a stop while the gate rises from
     below at the same speed, so it reads as fixed to the shaft. Braking
     sags the view; the dock lands with a thump and a bounce, the conduits
     power up, the latch ratchets back, the seal vents and the doors part. */
  useEffect(() => {
    if (phase !== "revealing") return;

    const logo = logoRef.current;
    const gate = gateRef.current;
    if (!logo || !gate) {
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

    if (prefersReducedMotion()) {
      logo.style.display = "flex";
      enter(true);
      return;
    }

    const tl = gsap.timeline();
    revealTlRef.current = tl;

    // 1. brake: the gate covers one screen height while the speed falls
    // linearly to zero, so that distance takes 2H / v
    const rise = gate.getBoundingClientRect().height * (1 + LINTEL);
    const brake = gsap.utils.clamp(1.4, 3.6, (2 * rise) / DESCENT_SPEED);
    const descent = descentRef.current;
    if (descent) tl.to(descent, { timeScale: 0, duration: brake, ease: "none" }, 0);
    tl.fromTo(gate, { y: 0, yPercent: (1 + LINTEL) * 100 }, { yPercent: 0, duration: brake, ease: "power1.out" }, 0);
    const status = overlayRef.current?.querySelector<HTMLElement>(".k-status") ?? null;
    if (status) tl.add(decodeTween(status, { duration: 0.4, text: "BRAKING" }), 0.05);
    tl.call(sfx(() => hudAudio.brake(brake)), [], 0.05);
    // deceleration presses you down: the view sags while the car slows
    tl.to(".k-sway", { y: 8, duration: brake * 0.6, ease: "power2.out" }, 0);

    // 2. dock: everything behind the gate is struck; it will open onto the
    // live world, with AERA in paper white waiting at the centre
    const dock = brake;
    tl.call(
      () => {
        descent?.kill();
        descentRef.current = null;
        gsap.set(".k-cab", { y: 0 });
        gsap.set(".k-scene", { visibility: "hidden" });
        if (bgLayerRef.current) bgLayerRef.current.style.visibility = "hidden";
        logo.style.display = "flex";
        letters.forEach((el, i) => (el.textContent = DECOY[i]));
        gsap.set(letters, { yPercent: 40, opacity: 0, x: 0, color: "#f4f3ee" });
        sfx(() => hudAudio.thump())();
      },
      [],
      dock - 0.01,
    );
    tl.to(".k-sway", { keyframes: { y: [8, -6, 2, 0] }, duration: 0.45, ease: "none" }, dock);
    tl.to([".k-door-inner-l", ".k-door-inner-r"], { keyframes: { y: [4, -2, 0] }, duration: 0.3, ease: "none" }, dock);
    tl.to(".k-trace", { strokeDashoffset: 0, duration: 0.5, ease: "power2.in", stagger: 0.04 }, dock + 0.08);
    tl.call(sfx(() => hudAudio.chime()), [], dock + 0.25);
    if (status) tl.add(decodeTween(status, { duration: 0.4, text: "DOCKED" }), dock + 0.25);

    // 3. unlock: deadbolts pull back, then the pinion walks the latch home
    // in three ratchet clicks
    const unlock = dock + 0.55;
    tl.to(".k-bolt", { x: 0, duration: 0.14, ease: "power3.in", stagger: 0.05 }, unlock);
    tl.call(sfx(() => hudAudio.thump(0.08)), [], unlock + 0.15);
    [0.3, 0.55, 0.8].forEach((at, i) => {
      tl.to(".k-latch", { x: (LATCH_TRAVEL * (2 - i)) / 3, duration: 0.13, ease: MOTION.servo }, unlock + at);
      tl.to(".k-gear", { rotation: (GEAR_TURN * (2 - i)) / 3, duration: 0.13, ease: MOTION.servo }, unlock + at);
      tl.call(sfx(() => hudAudio.ratchet()), [], unlock + at);
      tl.to([".k-door-l", ".k-door-r"], { keyframes: { x: [2, -1, 0] }, duration: 0.1, ease: "none" }, unlock + at + 0.02);
    });
    tl.call(sfx(() => hudAudio.hiss(1.0)), [], unlock + 1.0);

    // 4. crack open against resistance: stick, slip, stick
    const crack = unlock + 1.2;
    tl.to(".k-door-l", { keyframes: { xPercent: [-1.2, -1, -2.8, -2.6, -4.5] }, duration: 0.55, ease: "none" }, crack);
    tl.to(".k-door-r", { keyframes: { xPercent: [1.2, 1, 2.8, 2.6, 4.5] }, duration: 0.55, ease: "none" }, crack);

    // 5. the outer gate and the cab's own front door open together, the
    // gate a beat ahead. Nothing moves the view yet: you are still inside.
    const open = crack + 0.7;
    tl.call(sfx(() => hudAudio.door(0.85)), [], open - 0.05);
    tl.to(".k-door-l", { xPercent: -101, duration: 0.85, ease: MOTION.hydraulicOpen }, open);
    tl.to(".k-door-r", { xPercent: 101, duration: 0.85, ease: MOTION.hydraulicOpen }, open);
    const cabOpen = open + 0.15;
    tl.call(sfx(() => hudAudio.door(0.75)), [], cabOpen - 0.05);
    tl.to(".k-cab-door-l", { x: -420, duration: 0.75, ease: MOTION.hydraulicOpen }, cabOpen);
    tl.to(".k-cab-door-r", { x: 420, duration: 0.75, ease: MOTION.hydraulicOpen }, cabOpen);

    // 6. step out: with both doors open, the camera walks forward through
    // the box. Near wall edges sweep past fast, the doorway grows slower,
    // and a footstep bob rides on the camera, not on the cab.
    const walk = cabOpen + 0.85;
    // the world camera moves with you, from the arrival pose to rest
    tl.call(() => arrive(2.2, MOTION.servo), [], walk);
    // once you step out there is nothing left to skip; clear the corner for the site header
    tl.to(".k-skip", { opacity: 0, pointerEvents: "none", duration: 0.3, ease: "power2.out" }, walk);
    const slices = Array.from(overlayRef.current?.querySelectorAll<HTMLElement>("[data-near]") ?? []);
    tl.to(
      ".k-cam",
      {
        z: 760,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate() {
          const z = Number(gsap.getProperty(this.targets()[0], "z"));
          for (const el of slices) {
            el.style.visibility = Number(el.dataset.near) + z > CAB_PERSPECTIVE - 20 ? "hidden" : "";
          }
        },
      },
      walk,
    );
    tl.to(".k-cam", { keyframes: { y: [0, -7, 0, -7, 0, -4, 0] }, duration: 1.5, ease: "none" }, walk);
    tl.set([".k-cab", ".k-lintel"], { visibility: "hidden" }, walk + 1.5);

    // 7. arrival: the line decodes over the world, lifts, and the MOON sign
    // docks beneath it, like a floor indicator naming the destination
    const land = walk + 1.1;
    tl.to(".k-arrive-scrim", { opacity: 1, duration: 0.4, ease: "power2.out" }, land - 0.15);
    tl.set(".k-arrive", { opacity: 1, y: 0 }, land);
    tl.call(sfx(() => hudAudio.blip()), [], land);
    if (arriveText) tl.add(decodeTween(arriveText, { duration: 0.7, text: ARRIVAL_LINE }), land);
    tl.to(".k-arrive-rule", { scaleX: 1, duration: 0.45, ease: MOTION.snap }, land + 0.1);
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
      land + 1.05,
    );
    tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.45, ease: MOTION.servo, stagger: 0.06 }, land + 1.1);

    // 8. the sign corrects itself: MOON decodes into AERA, the line drops away
    const fix = land + 1.95;
    tl.call(sfx(() => hudAudio.blip()), [], fix);
    letters.forEach((el, i) => tl.add(decodeTween(el, { duration: 0.5, text: AERA[i] }), fix + i * 0.08));
    tl.to(".k-arrive", { opacity: 0, y: "-=12", duration: 0.3, ease: MOTION.snap }, fix + 0.55);
    tl.call(sfx(() => hudAudio.confirm()), [], fix + 0.8);
    tl.call(() => enter(true, true), [], fix + 1.3);

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

    descentRef.current?.kill();
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

  /** Click anywhere or press a key to stop at the gate */
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
        y: -6,
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

  const skipRef = useRef(skipIntro);
  useEffect(() => {
    skipRef.current = skipIntro;
  });

  /* Esc skips the intro at any point of the ride; any other key proceeds once the prompt is up */
  useEffect(() => {
    if (phase === "gone" || phase === "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") skipRef.current();
      else if (phase === "waiting") proceedRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "gone") return null;

  const waiting = phase === "waiting";

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* open space; also catches "click anywhere" */}
      <div
        ref={bgLayerRef}
        onClick={waiting ? proceed : undefined}
        className={`absolute inset-0 select-none pointer-events-auto ${waiting ? "cursor-pointer" : ""}`}
        style={{ clipPath: "inset(0% 0% 0% 0%)", background: SPACE }}
      />

      {/* a soft dark backing behind the arrival sign, so white text reads over the Earth's bright clouds */}
      <div
        className="k-arrive-scrim pointer-events-none absolute inset-0 z-[109]"
        style={{ opacity: 0, background: "radial-gradient(ellipse 46% 30% at 50% 50%, rgba(5,6,8,0.72), rgba(5,6,8,0.42) 55%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* arrival line: shown when the doors open, then lifts above AERA */}
      <div
        className="k-arrive pointer-events-none absolute inset-x-0 top-1/2 z-[115] flex -translate-y-1/2 flex-col items-center gap-3"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <p
          className="k-arrive-text font-mono text-xs font-black tracking-[0.5em] md:text-sm"
          style={{ color: "#f4f3ee", textShadow: FLOAT_SHADOW }}
        >
          {ARRIVAL_LINE}
        </p>
        <span className="k-arrive-rule block h-[2px] w-40 md:w-72" style={{ background: POSTER, transform: "scaleX(0)" }} />
      </div>

      {/* AERA logo (under the gate, so the doors open onto it) */}
      <div ref={logoRef} className="pointer-events-none absolute inset-0 z-[110] hidden items-center justify-center">
        <div
          className="aera-letters-wrapper relative z-[2] flex gap-[0.02em] overflow-hidden px-8 py-4 font-display text-[16vw] font-black uppercase leading-none tracking-[-0.08em] select-none md:text-[12vw]"
          style={{ color: INK, textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}
        >
          <span className="aera-letter inline-block">A</span>
          <span className="aera-letter inline-block">E</span>
          <span className="aera-letter inline-block">R</span>
          <span className="aera-letter inline-block">A</span>
        </div>
      </div>

      {/* everything that moves with the car: the view sags and bounces as one */}
      <div className="k-sway pointer-events-none absolute inset-0 z-[120]">
        {/* Earth, far enough away that the descent never moves it; placed in
            screen space to match the hero's WebGL Earth (see the layout effect) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={earthRef}
          src="/bg-assets/earth-no-bg.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="k-earth k-scene absolute left-0 top-0 max-w-none select-none"
          style={{ filter: `brightness(${EARTH_DIM})` }}
        />
        <div
          ref={rigRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: RIG_WIDTH, aspectRatio: "16 / 9" }}
        >
          {/* the shaft, seen through the window: stars and Earth far off,
              girders and guide rails streaming up past the car */}
          <div className="k-scene absolute inset-0" aria-hidden="true">
            {STARS.map(([x, y, s]) => (
              <span
                key={`${x}-${y}`}
                className="absolute rounded-full"
                style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, background: STAR, opacity: 0.7 }}
              />
            ))}
            {/* cross girders: full-width bands that sweep past the window */}
            <div
              className="k-beams absolute inset-x-0 top-0"
              style={{
                height: `calc(100% + ${BEAM_TILE}px)`,
                backgroundImage: girderSkin,
              }}
            />

            {/* guide rails just inside the window edges, the right one mirrored */}
            {["left-[30%]", "right-[30%] -scale-x-100"].map((pos) => (
              <div key={pos} className={`absolute inset-y-0 ${pos} w-[7%] overflow-hidden`}>
                <div className="k-rails absolute inset-x-0 top-0" style={{ height: `calc(100% + ${RAIL_TILE}px)`, ...railSkin }}>
                  {/* marker lamps on the beam face */}
                  <div
                    className="absolute inset-y-0 left-[74%] w-[6%]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(180deg, transparent 0 142px, ${POSTER} 142px 152px, transparent 152px ${RAIL_TILE}px)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* the cab: a 3D box on a 1600x900 stage scaled to the rig */}
          <div
            className="k-cab absolute left-0 top-0 h-[900px] w-[1600px] origin-top-left"
            aria-hidden="true"
            style={{ scale: "var(--rig-k, 1)", perspective: CAB_PERSPECTIVE, perspectiveOrigin: "800px 430px" }}
          >
            {/* the camera: everything in the box moves together when you walk */}
            <div className="k-cam absolute inset-0" style={{ transformStyle: "preserve-3d", ["--rig-k" as string]: 1 }}>
              {/* the airtight gate, just beyond the door: parked below until the car brakes */}
              <div
                className="absolute inset-0"
                style={{ transform: `translateZ(-${GATE_GAP}px) scale(${(CAB_PERSPECTIVE + GATE_GAP) / CAB_PERSPECTIVE})` }}
              >
                <div
                  ref={gateRef}
                  className="absolute inset-0"
                  style={{ transform: `translateY(${(1 + LINTEL) * 100}%)` }}
                >
                  {/* lintel: a heavy extruded header with a hazard band, leads the gate up into view */}
                  <div
                    className="k-lintel absolute inset-x-0 bottom-full"
                    style={{
                      height: `${LINTEL * 100}%`,
                      background: GUN,
                      boxShadow: `inset 0 4px 0 ${GUN_TOP}, inset 0 -34px 0 ${GUN_BOTTOM}`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-[10px] h-[24px]"
                      style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${INK} 0 12px, ${POSTER} 12px 24px)` }}
                    />
                    <div className="absolute left-[8%] right-[8%] top-[30%] h-[3px]" style={{ background: POSTER }} />
                  </div>
                  <div className="absolute inset-0 overflow-hidden">
                    {/* port door sits above starboard: its latch slides out over the seam */}
                    <div className="k-door-l absolute inset-y-0 left-0 z-[2] w-1/2" style={{ background: GUN_DEEP }}>
                      <DoorFace side="l" />
                    </div>
                    <div className="k-door-r absolute inset-y-0 right-0 z-[1] w-1/2 overflow-hidden" style={{ background: GUN_DEEP }}>
                      <DoorFace side="r" />
                    </div>
                  </div>
                </div>
              </div>

              <CabRoom />
              {/* the front wall: header and door leaves, at z=0 */}
              <CabFront />
            </div>
          </div>
        </div>
      </div>

      {/* gate prompt, above the cab floor */}
      {waiting && (
        <div
          ref={promptRef}
          className="pointer-events-auto absolute left-1/2 z-[125] -translate-x-1/2"
          style={{ bottom: "max(6vh, 28px)", opacity: 0 }}
        >
          <ProceedPrompt onProceed={proceed} />
        </div>
      )}

      {/* the screen fades up onto a car already moving */}
      <div className="k-lights pointer-events-none absolute inset-0 z-[126]" aria-hidden="true" style={{ background: "#000" }} />

      {/* Skip intro: available for the whole ride */}
      {(phase === "loading" || phase === "waiting" || phase === "revealing") && (
        <div className="k-skip absolute right-4 top-4 z-[130] pointer-events-auto md:right-8 md:top-8">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              skipIntro();
            }}
            aria-label="Skip intro and go straight to the site"
            className="flex min-h-[38px] cursor-pointer items-center gap-2.5 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#c9ccd2] transition-[color,transform] duration-150 ease-out hover:text-[#e6e200] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6e200] active:translate-y-px md:text-xs"
            style={{ textShadow: FLOAT_SHADOW }}
          >
            <span className="hidden rounded-[3px] border px-1.5 py-px text-[10px] tracking-[0.08em] md:inline" style={{ borderColor: "currentColor" }}>
              ESC
            </span>
            SKIP INTRO
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 2.5D industrial material ----------
   Dark gunmetal lit from the top-left. Raised parts show their thickness:
   a lit top face, a lit left face, a shaded right face and a deep bottom
   face, plus a soft drop shadow beneath. Recessed parts flip it. Accents
   are flat emissive yellow strips and small red indicators; nothing glows. */

const GUN = "#25272e";
const GUN_TOP = "#4a4e58";
const GUN_LEFT = "#363941";
const GUN_RIGHT = "#1b1c21";
const GUN_BOTTOM = "#111215";
const GUN_DEEP = "#0b0c0f";
const GUN_EDGE = "#6a6f7b";
const STEEL = "#8b909c";
const ALERT = "#ff2e55";

/** raised gunmetal block (HTML): bevel faces as hard inset bands, depth shadow below */
const block25 = (radius = 4) => ({
  background: GUN,
  borderRadius: radius,
  boxShadow: [
    `inset 0 3px 0 ${GUN_TOP}`,
    `inset 3px 0 0 ${GUN_LEFT}`,
    `inset -3px 0 0 ${GUN_RIGHT}`,
    `inset 0 -6px 0 ${GUN_BOTTOM}`,
    `0 12px 20px rgba(0,0,0,0.55)`,
  ].join(", "),
});
/** recessed channel (HTML): shade falls on the top-left inner faces */
const well25 = {
  background: GUN_DEEP,
  boxShadow: `inset 0 5px 0 #050506, inset 3px 0 0 #08080a, inset 0 -2px 0 ${GUN_LEFT}`,
};
/** a sliding bar: machined steel with a hard lit top, a shaded underside and a hazard nose */
const bar25 = {
  background: `repeating-linear-gradient(-45deg, ${INK} 0 5px, ${POSTER} 5px 10px) right / 20px 100% no-repeat, linear-gradient(180deg, #b9bdc7 0 3px, ${STEEL} 3px calc(100% - 5px), #4f535d calc(100% - 5px))`,
  borderRadius: 2,
  boxShadow: `0 6px 10px rgba(0,0,0,0.5)`,
};

/** guide rail strip: chord and lattice, ribs every tile, an extruded I-beam on the inner side */
const railSkin = {
  backgroundImage: [
    // rib plates: lit top face, front, deep underside, once per tile
    `repeating-linear-gradient(180deg, transparent 0 ${RAIL_TILE - 46}px, ${GUN_TOP} ${RAIL_TILE - 46}px ${RAIL_TILE - 40}px, ${GUN} ${RAIL_TILE - 40}px ${RAIL_TILE - 20}px, ${GUN_BOTTOM} ${RAIL_TILE - 20}px ${RAIL_TILE - 12}px, transparent ${RAIL_TILE - 12}px ${RAIL_TILE}px)`,
    // the I-beam: lit left face, front, shaded right face
    `linear-gradient(90deg, transparent 0 56%, ${GUN_TOP} 56% 61%, ${GUN} 61% 88%, ${GUN_RIGHT} 88% 96%, transparent 96%)`,
    // outer chord
    `linear-gradient(90deg, transparent 0 4%, ${GUN_TOP} 4% 6%, ${GUN} 6% 11%, ${GUN_RIGHT} 11% 13%, transparent 13%)`,
    // lattice between chord and beam (tile divides RAIL_TILE so the loop is seamless)
    `linear-gradient(45deg, transparent 0 45%, #3a3d46 45% 55%, transparent 55%)`,
    `linear-gradient(-45deg, transparent 0 46%, #24262c 46% 54%, transparent 54%)`,
  ].join(", "),
  backgroundSize: `100% ${RAIL_TILE}px, 100% 100%, 100% 100%, 60px 60px, 60px 60px`,
};

/** cross girder band: lit top face, front with an emissive strip, deep underside */
const girderSkin = `repeating-linear-gradient(180deg, transparent 0 ${BEAM_TILE - 56}px, ${GUN_TOP} ${BEAM_TILE - 56}px ${BEAM_TILE - 48}px, ${GUN} ${BEAM_TILE - 48}px ${BEAM_TILE - 34}px, ${POSTER} ${BEAM_TILE - 34}px ${BEAM_TILE - 32}px, ${GUN} ${BEAM_TILE - 32}px ${BEAM_TILE - 20}px, ${GUN_BOTTOM} ${BEAM_TILE - 20}px ${BEAM_TILE - 10}px, transparent ${BEAM_TILE - 10}px ${BEAM_TILE}px)`;

/**
 * An extruded plate in SVG: front face inset by the bevel, four bevel faces
 * around it. `flip` swaps the side faces for the mirrored starboard door so
 * the light stays top-left on screen.
 */
function Plate({ x, y, w, h, b = 8, flip = false }: { x: number; y: number; w: number; h: number; b?: number; flip?: boolean }) {
  const r = x + w;
  const btm = y + h;
  return (
    <g>
      <path d={`M ${x} ${y} H ${r} L ${r - b} ${y + b} H ${x + b} Z`} fill={GUN_TOP} />
      <path d={`M ${x} ${y} L ${x + b} ${y + b} V ${btm - b} L ${x} ${btm} Z`} fill={flip ? GUN_RIGHT : GUN_LEFT} />
      <path d={`M ${r} ${y} V ${btm} L ${r - b} ${btm - b} V ${y + b} Z`} fill={flip ? GUN_LEFT : GUN_RIGHT} />
      <path d={`M ${x} ${btm} H ${r} L ${r - b} ${btm - b} H ${x + b} Z`} fill={GUN_BOTTOM} />
      <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} fill={GUN} />
    </g>
  );
}

/** vent slots cut into a plate face */
function Vents({ x, y, n, len }: { x: number; y: number; n: number; len: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={x} y={y + i * 14} width={len} height={7} rx={2} fill={GUN_DEEP} />
          <rect x={x} y={y + i * 14 + 6} width={len} height={1.5} fill={GUN_LEFT} />
        </g>
      ))}
    </g>
  );
}

/**
 * One bulkhead door: extruded armour plates with vents and emissive strips,
 * conduits in a recessed tray, hydraulic rams, and a hazard band with a
 * vacuum gasket at the seam. The SVG is drawn for the port side; the
 * starboard door mirrors it. The port door carries the sliding lock; the
 * starboard door carries its keepers.
 */
function DoorFace({ side }: { side: "l" | "r" }) {
  const port = side === "l";
  const flip = !port;

  return (
    <div className={`k-door-inner-${side} absolute inset-0`}>
      <svg
        viewBox="0 0 600 1000"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-0 h-full w-full"
        style={port ? undefined : { transform: "scaleX(-1)" }}
      >
        <defs>
          <pattern id={`k-haz-${side}`} width={24} height={24} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={24} height={24} fill={POSTER} />
            <rect width={12} height={24} fill={INK} />
          </pattern>
          <filter id={`k-drop-${side}`} x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx={port ? 4 : -4} dy={10} stdDeviation={7} floodColor="#000" floodOpacity={0.6} />
          </filter>
        </defs>

        <rect x={-10} y={-10} width={620} height={1020} fill={GUN_DEEP} />

        {/* armour plates: extruded, some vented, some carrying an emissive strip */}
        {TILES.map(({ x, y }, i) => (
          <g key={`${x}-${y}`} filter={`url(#k-drop-${side})`}>
            <Plate x={x} y={y} w={TILE_W} h={TILE_H} b={9} flip={flip} />
            {i % 3 === 0 && <Vents x={x + 26} y={y + 40} n={5} len={TILE_W - 52} />}
            {i % 4 === 1 && <rect x={x + 22} y={y + 26} width={TILE_W - 44} height={3} fill={POSTER} />}
            {i % 5 === 2 && <rect x={x + TILE_W - 30} y={y + TILE_H - 30} width={8} height={8} fill={ALERT} />}
          </g>
        ))}

        {/* recessed conduit tray: deep floor, shaded top lip, lit bottom lip */}
        <rect x={0} y={418} width={HAZARD_X} height={164} fill="#08090b" />
        <rect x={0} y={418} width={HAZARD_X} height={10} fill="#040405" />
        <rect x={0} y={578} width={HAZARD_X} height={4} fill={GUN_LEFT} />

        {/* hazard band on a raised sill, then the vacuum gasket on the seam */}
        <rect x={HAZARD_X} y={-10} width={36} height={1020} fill={`url(#k-haz-${side})`} />
        <rect x={HAZARD_X} y={-10} width={4} height={1020} fill={flip ? GUN_RIGHT : GUN_LEFT} />
        <rect x={HAZARD_X + 36} y={-10} width={16} height={1020} fill={INK} />
        {Array.from({ length: 42 }, (_, i) => (
          <rect key={i} x={HAZARD_X + 38} y={i * 24} width={12} height={2} fill={GUN_LEFT} />
        ))}

        {/* conduits: dark cylinders with a lit crown and a shaded belly; the core powers up yellow */}
        {CONDUITS.map(({ d, w, vert }) => {
          const off = w / 4;
          const crown = vert ? `translate(${port ? -off : off} 0)` : `translate(0 ${-off})`;
          const belly = vert ? `translate(${port ? off : -off} 0)` : `translate(0 ${off})`;
          return (
            <g key={d} fill="none" filter={`url(#k-drop-${side})`}>
              <path d={d} stroke="#2e3139" strokeWidth={w} />
              <path d={d} transform={belly} stroke="#15161a" strokeWidth={w / 2} />
              <path d={d} transform={crown} stroke={GUN_EDGE} strokeWidth={2.5} />
              <path
                className="k-trace"
                d={d}
                stroke={POSTER}
                strokeWidth={w > 20 ? 3 : 2}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            </g>
          );
        })}
        {STRAPS.map((x) => (
          <g key={x} filter={`url(#k-drop-${side})`}>
            <Plate x={x - 9} y={424} w={18} h={152} b={4} flip={flip} />
          </g>
        ))}

        {/* hydraulic rams: ribbed cylinder, collars, machined rod into the sill */}
        {RAMS.map((y) => (
          <g key={y} filter={`url(#k-drop-${side})`}>
            <rect x={300} y={y - 20} width={170} height={40} fill="#2e3139" />
            <rect x={300} y={y - 20} width={170} height={7} fill={GUN_TOP} />
            <rect x={300} y={y + 10} width={170} height={10} fill="#15161a" />
            {[330, 360, 390, 420].map((rx) => (
              <rect key={rx} x={rx} y={y - 13} width={3} height={23} fill={GUN_DEEP} />
            ))}
            <rect x={300} y={y - 22} width={14} height={44} fill={GUN_LEFT} />
            <rect x={456} y={y - 22} width={14} height={44} fill={GUN_LEFT} />
            <rect x={470} y={y - 8} width={HAZARD_X - 470} height={16} fill={STEEL} />
            <rect x={470} y={y - 8} width={HAZARD_X - 470} height={4} fill="#c3c7cf" />
            <rect x={470} y={y + 4} width={HAZARD_X - 470} height={4} fill="#4f535d" />
          </g>
        ))}
      </svg>

      {port ? (
        /* zero-size anchor on the seam centre; the lock scales with the rig */
        <div className="absolute right-0 top-1/2 h-0 w-0 origin-top-right" style={{ scale: "var(--rig-k, 1)" }}>
          {/* main lock: a pinion drives a toothed latch bar out across the seam */}
          <div className="absolute -top-[56px] right-0 h-[112px] w-[168px]" style={block25()}>
            <div className="absolute left-3 top-3 h-[3px] w-10" style={{ background: POSTER }} />
            <div className="absolute right-4 top-3 h-2 w-2" style={{ background: ALERT }} />
            {/* bar channel */}
            <div className="absolute bottom-[14px] left-3 right-0 h-[36px]" style={well25} />
            {/* toothed latch bar: the rack runs along its top edge */}
            <div
              className="k-latch absolute bottom-[17px] right-[-1px] h-[30px] w-[146px]"
              style={{ ...bar25, transform: `translateX(${LATCH_TRAVEL}px)` }}
            >
              <div
                className="absolute inset-x-2 -top-[5px] h-[5px]"
                style={{ backgroundImage: `repeating-linear-gradient(90deg, #b9bdc7 0 5px, transparent 5px 9px)` }}
              />
            </div>
            {/* pinion, meshing with the rack */}
            <svg
              viewBox="0 0 52 52"
              className="k-gear absolute left-[34px] top-[6px] h-[52px] w-[52px]"
              style={{ transform: `rotate(${GEAR_TURN}deg)`, filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.6))" }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={23} y={1} width={6} height={9} fill={STEEL} transform={`rotate(${i * 30} 26 26)`} />
              ))}
              <circle cx={26} cy={26} r={19} fill="#5a5f6b" />
              <circle cx={26} cy={26} r={15} fill="#3a3d46" />
              {[0, 90, 180, 270].map((a) => (
                <circle key={a} cx={26} cy={15} r={3} fill={GUN_DEEP} transform={`rotate(${a} 26 26)`} />
              ))}
              <circle cx={26} cy={26} r={6} fill={STEEL} />
              <circle cx={26} cy={26} r={2.5} fill={POSTER} />
            </svg>
          </div>

          {/* deadbolts: blocks on the port door, bars slide into the starboard keepers */}
          {[-1, 1].map((dir) => (
            <div
              key={dir}
              className="absolute right-0 h-[40px] w-[96px]"
              style={{ top: dir * BOLT_OFFSET - 20, ...block25(3) }}
            >
              <div className="absolute left-2 right-0 top-[10px] h-[20px]" style={well25} />
              <div
                className="k-bolt absolute right-[-1px] top-[12px] h-[16px] w-[84px]"
                style={{ ...bar25, transform: `translateX(${BOLT_TRAVEL}px)` }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute left-0 top-1/2 h-0 w-0 origin-top-left" style={{ scale: "var(--rig-k, 1)" }}>
          {/* keepers: recessed slots the latch bar and deadbolts slide into */}
          <div className="absolute -top-[56px] left-0 h-[112px] w-[104px]" style={block25()}>
            <div className="absolute bottom-[14px] left-0 h-[36px] w-[84px]" style={well25} />
            <div className="absolute right-3 top-3 h-[3px] w-8" style={{ background: POSTER }} />
          </div>
          {[-1, 1].map((dir) => (
            <div
              key={dir}
              className="absolute left-0 h-[40px] w-[72px]"
              style={{ top: dir * BOLT_OFFSET - 20, ...block25(3) }}
            >
              <div className="absolute left-0 top-[10px] h-[20px] w-[62px]" style={well25} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** a dark drop shadow under floating HUD text, so it reads over any part of the cab */
const FLOAT_SHADOW = "0 2px 8px rgba(0,0,0,0.75), 0 1px 1px rgba(0,0,0,0.9)";

/** Gate prompt: a floating "press any key" line, like a game title screen; the whole screen is the button */
function ProceedPrompt({ onProceed }: { onProceed: () => void }) {
  const [isMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );
  const label = isMobile ? "TAP ANYWHERE" : "PRESS ANY KEY";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onProceed();
      }}
      aria-label="Stop at the gate and enter the portfolio"
      className="group flex cursor-pointer select-none flex-col items-center gap-2.5 text-center focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#e6e200]"
    >
      <span
        className="k-plate flex items-center gap-3 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-[0.42em] text-[#eceef1] transition-colors duration-200 ease-out group-hover:text-[#e6e200] md:text-base"
        style={{ textShadow: FLOAT_SHADOW }}
      >
        <span className="block h-1.5 w-1.5" style={{ background: POSTER }} aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <span className="k-plate-text" aria-hidden="true">
          {label}
        </span>
      </span>
      <span
        className="k-plate-sub font-mono text-[10px] font-bold uppercase tracking-[0.3em] opacity-0"
        style={{ color: "#a9aeb8", textShadow: FLOAT_SHADOW }}
      >
        {isMobile ? "TO STOP AT THE GATE" : "OR CLICK ANYWHERE"}
      </span>
    </button>
  );
}

/* ---------- cab interior (3D stage, 1600x900, door plane at z=0) ----------
   Cel-shaded line art: flat light-grey frame metal, charcoal pillars, white
   wall panels, thin dark linework and brass trim. */

const LINE = "#1f2423";
const FRAME_C = "#c5c9c8";
const FRAME_HI = "#dfe2e1";
const FRAME_LO = "#a3a8a7";
const PILLAR = "#2c3130";
const PILLAR_HI = "#3d4342";
const PILLAR_LO = "#1a1e1d";
const PANEL = "#e9ebea";
const PANEL_LO = "#cdd1d0";
const BRASS = "#b39d5c";
const SCREEN_BLUE = "#3f7fd8";

/** an inline SVG as a CSS background image */
const svgUrl = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`,
  )}")`;

/**
 * Side wall texture (600x740), local x 0 at the door: a grey jamb with bolt
 * holes and brass trim, a charcoal pillar with a recessed rounded window and
 * a stepped lower panel, then white wall panels toward the camera.
 */
const WALL_TEXTURE = svgUrl(
  CAB_DEPTH,
  740,
  `<rect width='${CAB_DEPTH}' height='740' fill='${PANEL}'/>
  <path d='M360 400 H600 V740 H360 Z' fill='${PANEL_LO}'/>
  <path d='M480 0 V740' stroke='${FRAME_LO}' stroke-width='2'/>
  <rect x='0' y='0' width='100' height='740' fill='${FRAME_C}'/>
  <rect x='0' y='0' width='8' height='740' fill='${FRAME_HI}'/>
  <rect x='90' y='0' width='4' height='740' fill='${BRASS}'/>
  ${[170, 240, 310, 560].map((y) => `<circle cx='48' cy='${y}' r='9' fill='${LINE}'/>`).join("")}
  <rect x='100' y='0' width='260' height='740' fill='${PILLAR}'/>
  <rect x='100' y='0' width='12' height='740' fill='${PILLAR_HI}'/>
  <rect x='348' y='0' width='12' height='740' fill='${PILLAR_LO}'/>
  <rect x='170' y='120' width='130' height='210' rx='22' fill='${FRAME_C}' stroke='${LINE}' stroke-width='3'/>
  <rect x='186' y='136' width='98' height='178' rx='14' fill='${PILLAR_LO}' stroke='${LINE}' stroke-width='2'/>
  <path d='M190 300 Q235 316 280 300' stroke='${PILLAR_HI}' stroke-width='3' fill='none'/>
  <rect x='100' y='380' width='260' height='34' fill='${PILLAR_LO}'/>
  <path d='M100 380 H360' stroke='${PILLAR_HI}' stroke-width='3'/>
  <path d='M130 440 H330 V680 L290 720 H130 Z' fill='#262b2a' stroke='${LINE}' stroke-width='2'/>
  <path d='M100 0 V740 M360 0 V740' stroke='${LINE}' stroke-width='3'/>
  <defs><linearGradient id='ao' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000' stop-opacity='0.35'/><stop offset='0.07' stop-color='#000' stop-opacity='0'/><stop offset='0.9' stop-color='#000' stop-opacity='0'/><stop offset='1' stop-color='#000' stop-opacity='0.4'/></linearGradient></defs>
  <rect width='${CAB_DEPTH}' height='740' fill='url(#ao)'/>`,
);
/** ceiling texture (800x600), local y 0 at the door: charcoal with structural bands */
const CEILING_TEXTURE = svgUrl(
  800,
  CAB_DEPTH,
  `<rect width='800' height='${CAB_DEPTH}' fill='${PILLAR}'/>
  <rect x='0' y='0' width='90' height='${CAB_DEPTH}' fill='${PILLAR_LO}'/>
  <rect x='710' y='0' width='90' height='${CAB_DEPTH}' fill='${PILLAR_LO}'/>
  ${[120, 300, 480].map((y) => `<rect x='90' y='${y}' width='620' height='22' fill='${PILLAR_HI}'/><path d='M90 ${y + 22} H710' stroke='${LINE}' stroke-width='3'/>`).join("")}
  <path d='M90 0 V${CAB_DEPTH} M710 0 V${CAB_DEPTH}' stroke='${LINE}' stroke-width='3'/>`,
);
/** floor texture (800x600), local y 0 at the door: a grey threshold with brass trim, dark deck plates */
const FLOOR_TEXTURE = svgUrl(
  800,
  CAB_DEPTH,
  `<rect width='800' height='${CAB_DEPTH}' fill='#262b2a'/>
  ${[130, 260, 390, 520].map((y) => `<path d='M0 ${y} H800' stroke='${LINE}' stroke-width='3'/>`).join("")}
  <path d='M400 26 V${CAB_DEPTH}' stroke='${LINE}' stroke-width='3'/>
  <rect x='0' y='0' width='800' height='26' fill='${FRAME_C}'/>
  <rect x='0' y='20' width='800' height='3' fill='${BRASS}'/>
  <path d='M0 26 H800' stroke='${LINE}' stroke-width='3'/>`,
);

/** upper window (big chamfer top-left), the lower slot under the crossbar, and the half each leaf carries */
const WINDOW_L = "M 580 150 H 800 V 590 H 490 V 240 Z";
const WINDOW_R = "M 800 150 H 1095 L 1110 165 V 590 H 800 Z";
const SLOT_L = "M 490 705 H 800 V 800 H 490 Z";
const SLOT_R = "M 800 705 H 1110 V 800 H 800 Z";
/** brass trim just outside the window */
const WINDOW_TRIM = "M 574 136 H 1101 L 1124 159 V 600 H 476 V 234 Z";
/** the cab's front: a fixed header over two door leaves that split at x=800 */
const LEAF_L = "M 400 112 H 800 V 800 H 400 Z";
const LEAF_R = "M 800 112 H 1200 V 800 H 800 Z";

/* ---------- depth on the front wall ----------
   The front wall is drawn flat at z=0, so anything with thickness is
   projected by hand from the same eye as the CSS 3D box: perspective
   CAB_PERSPECTIVE, vanishing point (800, 430). A point at depth z (toward
   the camera > 0) lands at VP + (p - VP) * P / (P - z). */

const VP = { x: 800, y: 430 };
const at = (x: number, y: number, z: number) => {
  const k = CAB_PERSPECTIVE / (CAB_PERSPECTIVE - z);
  return `${(VP.x + (x - VP.x) * k).toFixed(1)} ${(VP.y + (y - VP.y) * k).toFixed(1)}`;
};
/** scale a front-face group drawn at z=0 coordinates out to depth z */
const atDepth = (z: number) => {
  const k = CAB_PERSPECTIVE / (CAB_PERSPECTIVE - z);
  return `translate(${VP.x} ${VP.y}) scale(${k.toFixed(4)}) translate(${-VP.x} ${-VP.y})`;
};
/** a face between edge a→b at depth z0 and the same edge at depth z1 */
const faceQuad = ([ax, ay]: number[], [bx, by]: number[], z0: number, z1: number) =>
  `M ${at(ax, ay, z0)} L ${at(bx, by, z0)} L ${at(bx, by, z1)} L ${at(ax, ay, z1)} Z`;

/** how deep the window and slot reveals run into the frame */
const REVEAL = -55;
/** how far the crossbar and the header stand proud of the frame */
const BAR_PROUD = 60;
const HEADER_PROUD = 30;
/** reveal face shades: the top faces sit in shadow, the bottom faces catch the light */
const REVEAL_SHADE = { top: "#7b8180", chamfer: "#8c9291", left: "#a0a5a4", right: "#b2b7b6", bottom: "#d4d7d6" };

/** the glass panes per leaf: the window half and the slot half, as outlines at the frame face */
const GLASS: Record<"l" | "r", number[][][]> = {
  l: [
    [[580, 150], [800, 150], [800, 590], [490, 590], [490, 240]],
    [[490, 705], [800, 705], [800, 800], [490, 800]],
  ],
  r: [
    [[800, 150], [1095, 150], [1110, 165], [1110, 590], [800, 590]],
    [[800, 705], [1110, 705], [1110, 800], [800, 800]],
  ],
};

/** window and slot reveal edges per leaf, with the shade each face gets */
const REVEALS: Record<"l" | "r", { a: number[]; b: number[]; shade: string }[]> = {
  l: [
    { a: [580, 150], b: [800, 150], shade: REVEAL_SHADE.top },
    { a: [490, 240], b: [580, 150], shade: REVEAL_SHADE.chamfer },
    { a: [490, 590], b: [490, 240], shade: REVEAL_SHADE.left },
    { a: [800, 590], b: [490, 590], shade: REVEAL_SHADE.bottom },
    { a: [490, 705], b: [800, 705], shade: REVEAL_SHADE.top },
    { a: [490, 800], b: [490, 705], shade: REVEAL_SHADE.left },
  ],
  r: [
    { a: [800, 150], b: [1095, 150], shade: REVEAL_SHADE.top },
    { a: [1095, 150], b: [1110, 165], shade: REVEAL_SHADE.chamfer },
    { a: [1110, 165], b: [1110, 590], shade: REVEAL_SHADE.right },
    { a: [1110, 590], b: [800, 590], shade: REVEAL_SHADE.bottom },
    { a: [800, 705], b: [1110, 705], shade: REVEAL_SHADE.top },
    { a: [1110, 705], b: [1110, 800], shade: REVEAL_SHADE.right },
  ],
};

/** the pillar's inner face (260 x 740), seen from the room: a recessed rounded window and a stepped panel */
const PILLAR_FACE = svgUrl(
  260,
  740,
  `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${PILLAR_HI}'/><stop offset='1' stop-color='${PILLAR}'/></linearGradient></defs>
  <rect width='260' height='740' fill='url(#g)'/>
  <rect x='0' y='0' width='260' height='6' fill='${PILLAR_HI}'/>
  <rect x='65' y='120' width='130' height='210' rx='22' fill='${FRAME_C}' stroke='${LINE}' stroke-width='3'/>
  <rect x='65' y='120' width='130' height='10' rx='5' fill='${FRAME_HI}'/>
  <rect x='81' y='136' width='98' height='178' rx='14' fill='#101312' stroke='${LINE}' stroke-width='2'/>
  <rect x='81' y='136' width='98' height='26' rx='10' fill='#0a0c0b'/>
  <path d='M87 300 Q130 314 173 300' stroke='${PILLAR_HI}' stroke-width='3' fill='none'/>
  <rect x='0' y='380' width='260' height='34' fill='${PILLAR_LO}'/>
  <rect x='0' y='380' width='260' height='4' fill='${PILLAR_HI}'/>
  <path d='M30 440 H230 V680 L190 720 H30 Z' fill='#262b2a' stroke='${LINE}' stroke-width='2'/>
  <path d='M30 440 H230' stroke='#0f1211' stroke-width='6'/>
  <path d='M0 0 V740 M260 0 V740' stroke='${LINE}' stroke-width='3'/>`,
);
/** pillar boxes stand proud of each wall over this depth range */
const PILLAR_BOX = { z0: 100, z1: 360, proud: 70 };
/** ceiling beams hang this low over these depth ranges */
const BEAMS = [
  { z0: 150, z1: 190 },
  { z0: 420, z1: 460 },
];
const BEAM_DROP = 40;

/** Walls, ceiling and floor as sliced planes running from the door plane toward the camera */
function CabRoom() {
  const slices = Array.from({ length: SLICES }, (_, i) => i);
  return (
    <>
      {[400, 1200].map((left) =>
        slices.map((i) => (
          <div
            key={`w${left}-${i}`}
            data-near={(i + 1) * SLICE}
            className="absolute"
            style={{
              left,
              top: 60,
              width: SLICE + 1, // 1px overlap hides the seam between slices
              height: 740,
              transformOrigin: "0 50%",
              transform: `rotateY(-90deg) translateX(${i * SLICE}px)`,
              backgroundImage: WALL_TEXTURE,
              backgroundSize: `${CAB_DEPTH}px 740px`,
              backgroundPosition: `${-i * SLICE}px 0`,
              // the left wall faces away from the light
              filter: left === 400 ? "brightness(0.86)" : undefined,
            }}
          >
            {/* call panel beside the door, on the right wall */}
            {left === 1200 && i === 0 && (
              <div
                className="absolute left-[8px] top-[300px] h-[118px] w-[44px] rounded-[6px]"
                style={{
                  background: FRAME_C,
                  border: `2px solid ${LINE}`,
                  boxShadow: `inset 0 3px 0 ${FRAME_HI}, inset 0 -4px 0 ${FRAME_LO}, 4px 6px 8px rgba(0,0,0,0.35)`,
                }}
              >
                <div className="absolute left-[10px] top-[10px] h-[16px] w-[20px] rounded-[3px]" style={{ background: PILLAR_LO }} />
                <div
                  className="absolute left-[6px] top-[40px] h-[46px] w-[28px] rounded-[3px]"
                  style={{ background: SCREEN_BLUE, border: `2px solid ${LINE}`, boxShadow: `inset 0 6px 0 rgba(255,255,255,0.25)` }}
                />
              </div>
            )}
          </div>
        )),
      )}

      {/* pillar boxes standing proud of each wall: an inner face and the end facing you */}
      {[
        { wall: 400, inner: 400 + PILLAR_BOX.proud, shade: "brightness(0.86)" },
        { wall: 1200, inner: 1200 - PILLAR_BOX.proud, shade: undefined },
      ].map(({ wall, inner, shade }) => (
        // a fragment, not a wrapper: a plain div would flatten the 3D faces onto the door plane
        <Fragment key={wall}>
          <div
            data-near={PILLAR_BOX.z1}
            className="absolute"
            style={{
              left: inner,
              top: 60,
              width: PILLAR_BOX.z1 - PILLAR_BOX.z0,
              height: 740,
              transformOrigin: "0 0",
              transform: `rotateY(-90deg) translateX(${PILLAR_BOX.z0}px)`,
              backgroundImage: PILLAR_FACE,
              filter: shade,
            }}
          />
          <div
            data-near={PILLAR_BOX.z1}
            className="absolute"
            style={{
              left: Math.min(wall, inner),
              top: 60,
              width: PILLAR_BOX.proud,
              height: 740,
              transform: `translateZ(${PILLAR_BOX.z1}px)`,
              background: `linear-gradient(180deg, ${PILLAR_HI}, ${PILLAR})`,
              borderLeft: `3px solid ${LINE}`,
              borderRight: `3px solid ${LINE}`,
            }}
          />
        </Fragment>
      ))}

      {/* ceiling beams: the face toward you and the underside */}
      {BEAMS.map(({ z0, z1 }) => (
        <Fragment key={z0}>
          <div
            data-near={z1}
            className="absolute"
            style={{
              left: 400,
              top: 60,
              width: 800,
              height: BEAM_DROP,
              transform: `translateZ(${z1}px)`,
              background: `linear-gradient(180deg, ${PILLAR}, ${PILLAR_HI})`,
              borderBottom: `3px solid ${LINE}`,
            }}
          />
          <div
            data-near={z1}
            className="absolute"
            style={{
              left: 400,
              top: 60 + BEAM_DROP,
              width: 800,
              height: z1 - z0,
              transformOrigin: "0 0",
              transform: `rotateX(90deg) translateY(${z0}px)`,
              background: PILLAR_LO,
            }}
          />
        </Fragment>
      ))}

      {[
        { top: 60, texture: CEILING_TEXTURE, key: "c" },
        { top: 800, texture: FLOOR_TEXTURE, key: "f" },
      ].map(({ top, texture, key }) =>
        slices.map((i) => (
          <div
            key={`${key}-${i}`}
            data-near={(i + 1) * SLICE}
            className="absolute"
            style={{
              left: 400,
              top,
              width: 800,
              height: SLICE + 1,
              transformOrigin: "50% 0",
              transform: `rotateX(90deg) translateY(${i * SLICE}px)`,
              backgroundImage: texture,
              backgroundSize: `800px ${CAB_DEPTH}px`,
              backgroundPosition: `0 ${-i * SLICE}px`,
            }}
          />
        )),
      )}
    </>
  );
}

/** a bolt hole: dark bore, shadowed upper lip, lit lower rim */
function Bolt({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill={FRAME_LO} />
      <circle cx={x} cy={y} r={r} fill={LINE} />
      <path d={`M ${x - r + 1} ${y + 2} A ${r - 1} ${r - 1} 0 0 0 ${x + r - 1} ${y + 2}`} fill="none" stroke={FRAME_HI} strokeWidth={2} />
    </g>
  );
}

/**
 * One leaf of the cab's front door: half the grey frame with deep window
 * and slot reveals, brass trim, bolt holes, gussets and half of a crossbar
 * that stands proud of the frame. Both leaves slide into the side walls
 * once the outer gate is open.
 */
function CabLeaf({ side }: { side: "l" | "r" }) {
  const port = side === "l";
  const win = port ? WINDOW_L : WINDOW_R;
  const x0 = port ? 400 : 800;
  const sx = (x: number) => (port ? x : 1600 - x);
  /* crossbar half: back face at z=0, front face BAR_PROUD toward you */
  const barX0 = port ? 505 : 800;
  const barX1 = port ? 800 : 1095;
  const barEnd = port ? barX0 : barX1;
  return (
    <g className={`k-cab-door-${side}`}>
      <clipPath id={`k-leaf-clip-${side}`}>
        <rect x={x0} y={112} width={400} height={688} />
      </clipPath>
      {/* frame plate: lit at the top, falling off toward the floor */}
      <path d={`${port ? LEAF_L : LEAF_R} ${win} ${port ? SLOT_L : SLOT_R}`} fillRule="evenodd" fill="url(#k-plate)" />
      <rect x={x0} y={112} width={400} height={8} fill={FRAME_HI} />

      {/* reveals: the frame's thickness inside the window and the slot */}
      {REVEALS[side].map(({ a, b, shade }) => (
        <path key={`${a}-${b}`} d={faceQuad(a, b, 0, REVEAL)} fill={shade} stroke={shade} strokeWidth={1} />
      ))}
      {REVEALS[side].map(({ a, b }) => (
        <path key={`e${a}-${b}`} d={`M ${at(a[0], a[1], REVEAL)} L ${at(b[0], b[1], REVEAL)}`} stroke={LINE} strokeWidth={2.5} />
      ))}
      {/* glass at the back of each reveal: both openings are sealed panes */}
      {GLASS[side].map((pts, i) => {
        const d = `M ${pts.map(([x, y]) => at(x, y, REVEAL)).join(" L ")} Z`;
        return (
          <g key={i}>
            <clipPath id={`k-glass-${side}-${i}`}>
              <path d={d} />
            </clipPath>
            <path d={d} fill="rgba(170,196,206,0.10)" />
            <g clipPath={`url(#k-glass-${side}-${i})`}>
              <path d="M 380 900 L 900 -60 L 980 -60 L 460 900 Z M 520 900 L 1040 -60 L 1062 -60 L 542 900 Z" fill="rgba(255,255,255,0.07)" />
            </g>
          </g>
        );
      })}

      <g clipPath={`url(#k-leaf-clip-${side})`}>
        {/* outlines: the plate's outer edge, the window and the slot mouths */}
        <path d="M 400 112 H 1200 V 800 H 400 Z" fill="none" stroke={LINE} strokeWidth={2.5} />
        <path d={win} fill="none" stroke={LINE} strokeWidth={2.5} />
        <path d="M 490 800 V 705 H 1110 V 800" fill="none" stroke={LINE} strokeWidth={2.5} />
        {/* brass trim */}
        <path d={WINDOW_TRIM} fill="none" stroke={BRASS} strokeWidth={3} />
        {/* the crossbar's cast shadow on the frame below it */}
        <rect x={500} y={690} width={600} height={22} rx={10} fill="#000" opacity={0.28} filter="url(#k-soft)" />
      </g>

      {/* crossbar: the top face and the end face show its thickness */}
      <path d={faceQuad([barX0, 612], [barX1, 612], 0, BAR_PROUD)} fill={PILLAR_HI} stroke={LINE} strokeWidth={2} />
      <path d={faceQuad([barEnd, 612], [barEnd, 688], 0, BAR_PROUD)} fill={PILLAR_LO} stroke={LINE} strokeWidth={2} />
      <g transform={atDepth(BAR_PROUD)}>
        <rect x={barX0} y={612} width={barX1 - barX0} height={76} fill={PILLAR} stroke={LINE} strokeWidth={2.5} />
        <rect x={barX0 + (port ? 12 : 0)} y={616} width={barX1 - barX0 - 12} height={8} fill={PILLAR_HI} />
        <rect x={barX0 + (port ? 12 : 0)} y={672} width={barX1 - barX0 - 12} height={5} fill={PILLAR_HI} />
      </g>

      {/* gussets in the window's lower corner and the slot's upper corner */}
      <path
        d={`M ${sx(490)} 545 L ${sx(490)} 590 L ${sx(536)} 590 Z M ${sx(490)} 705 L ${sx(530)} 705 L ${sx(490)} 742 Z`}
        fill={FRAME_HI}
        stroke={LINE}
        strokeWidth={2}
      />
      {/* bolt holes down the jamb, and a ringed bolt beside the crossbar */}
      {[250, 320, 390].map((y) => (
        <Bolt key={y} x={sx(445)} y={y} />
      ))}
      <circle cx={sx(452)} cy={650} r={15} fill={FRAME_HI} stroke={LINE} strokeWidth={2.5} />
      <Bolt x={sx(452)} y={650} r={6} />
      {/* the leaves' meeting edge, the full height of the door: frame, glass and crossbar */}
      <path d={port ? "M 799 112 V 800" : "M 801 112 V 800"} stroke={port ? LINE : FRAME_HI} strokeWidth={2} />
    </g>
  );
}

/** The front wall at z=0: the two door leaves under a header that stands proud with a status slot */
function CabFront() {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <clipPath id="k-pocket">
          <rect x={400} y={60} width={800} height={760} />
        </clipPath>
        <linearGradient id="k-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FRAME_HI} />
          <stop offset="0.35" stopColor={FRAME_C} />
          <stop offset="1" stopColor="#b3b8b7" />
        </linearGradient>
        <filter id="k-soft" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>

      {/* the leaves slide into wall pockets: clipped to the doorway */}
      <g clipPath="url(#k-pocket)">
        <CabLeaf side="l" />
        <CabLeaf side="r" />
      </g>

      {/* header: its shadow on the door, the underside, then the face toward you */}
      <rect x={400} y={112} width={800} height={18} fill="#000" opacity={0.3} filter="url(#k-soft)" clipPath="url(#k-pocket)" />
      <path d={faceQuad([400, 112], [1200, 112], 0, HEADER_PROUD)} fill={PILLAR_LO} stroke={LINE} strokeWidth={2} />
      <g transform={atDepth(HEADER_PROUD)}>
        <rect x={400} y={60} width={800} height={52} fill={PILLAR} stroke={LINE} strokeWidth={2.5} />
        <rect x={400} y={60} width={800} height={6} fill={PILLAR_HI} />
        <rect x={400} y={104} width={800} height={3} fill={BRASS} />
        <rect x={620} y={66} width={360} height={36} rx={10} fill={PILLAR_LO} stroke={LINE} strokeWidth={2.5} />
        <rect x={652} y={72} width={296} height={24} rx={4} fill="#111413" />
        <rect x={652} y={72} width={296} height={6} rx={3} fill="#060807" />
        <text
          className="k-status font-mono"
          x={800}
          y={89}
          textAnchor="middle"
          fontSize={15}
          fontWeight={800}
          letterSpacing={4}
          fill={POSTER}
        >
          DESCENDING
        </text>
      </g>
    </svg>
  );
}
