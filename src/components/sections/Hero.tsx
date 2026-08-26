"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { expDampAlpha } from "@/lib/scene";
import { CyberLines } from "@/components/ui/CyberLines";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function Hero({ entered }: { entered: boolean }) {
  const { fx } = useHudAudio();
  /**
   * The pinned scroll timeline fires fx.click() from GSAP callbacks. Depending
   * on `fx` directly would rebuild that whole ScrollTrigger every time the mute
   * state flips (fx is re-memoised on booted/muted), so the effect reads the
   * latest handle through a ref instead.
   */
  const fxRef = useRef(fx);
  useEffect(() => {
    fxRef.current = fx;
  }, [fx]);
  const rootRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardPlaceholderRef = useRef<HTMLDivElement>(null);

  /* intro reveal — plays once the loader overlay slides up */
  useEffect(() => {
    if (!entered) return;
    
    const ctx = gsap.context(() => {
      // Stagger reveal name, subtitle, about text, and layout card
      gsap.timeline()
        .fromTo(
          [".hero-reveal:not(.hero-img-container)", cardRef.current],
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1.0,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.15,
          }
        );
    }, rootRef);
    
    return () => ctx.revert();
  }, [entered]);

  /* scrollytelling pin & morph animation of the same card node */
  useEffect(() => {
    if (!entered) return;

    const card = cardRef.current;
    const placeholder = cardPlaceholderRef.current;
    const root = rootRef.current;
    if (!card || !placeholder || !root) return;

    const getCardBounds = () => {
      const rect = placeholder.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      return {
        left: rect.left - rootRect.left,
        top: rect.top - rootRect.top,
        width: rect.width,
        height: rect.height,
      };
    };

    const getWrapCollapsedBounds = () => {
      return {
        left: 0,
        width: "100%",
        top: "15%",
        height: "70%",
      };
    };

    // Helper to position the absolute card exactly over its layout placeholder
    const matchPlaceholder = () => {
      const bounds = getCardBounds();
      if (bounds.width === 0 || bounds.height === 0) return;

      gsap.set(card, {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });

      const wrapEl = card.querySelector(".hero-card-img-wrap") as HTMLElement;
      if (wrapEl) {
        gsap.set(wrapEl, {
          left: 0,
          width: "100%",
          top: "15%",
          height: "70%",
        });
      }
    };

    // Initialize layout position immediately
    matchPlaceholder();

    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

        // Re-measure and position the card fresh for this breakpoint
        matchPlaceholder();

        const wrapExpanded = {
          left: isMobile ? "6vw" : "58vw",
          width: isMobile ? "88vw" : "35vw",
          top: isMobile ? "66%" : "0%",
          height: isMobile ? "28%" : "100%",
        };

        // Create scroll trigger timeline to pin Hero section and morph the card
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "hero-pin",
            trigger: root,
            start: "top top",
            end: "+=2800",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Step A: Reset any intro y-translation, fade out Hero text
        tl.to(card, { y: 0, duration: 0.1 }, 0)
          .to([".hero-logo-target", ".hero-reveal:not(.hero-img-container)"], {
            opacity: 0,
            y: -30,
            duration: 0.45,
            stagger: 0.05,
          }, 0);

        // Step B: Morph the exact same card container to cover the full viewport
        tl.fromTo(card, {
          left: () => getCardBounds().left,
          top: () => getCardBounds().top,
          width: () => getCardBounds().width,
          height: () => getCardBounds().height,
          borderRadius: "10px",
          padding: "1.25rem",
          "--notch": "22px",
        }, {
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          padding: 0,
          "--notch": "0px",
          duration: 1.0,
          ease: "power2.inOut",
          immediateRender: false,
        }, 0.1)
        .to(hudState, {
          earthY: 24.0,
          earthOpacity: 0.0,
          oldMoonY: -2.0,
          oldMoonOpacity: 0.0,
          duration: 1.0,
          ease: "power2.inOut",
        }, 0.1)
        .fromTo(".hero-card-meta", {
          opacity: 1,
        }, {
          opacity: 0,
          duration: 0.3,
          immediateRender: false,
        }, 0.1)
        .fromTo(".hero-card-img-wrap", {
          left: 0,
          width: () => getWrapCollapsedBounds().width,
          top: () => getWrapCollapsedBounds().top,
          height: () => getWrapCollapsedBounds().height,
        }, {
          left: wrapExpanded.left,
          width: wrapExpanded.width,
          top: wrapExpanded.top,
          height: wrapExpanded.height,
          duration: 1.0,
          ease: "power2.inOut",
          immediateRender: false,
        }, 0.1);

        // Step C: Reveal the one-screen intro collage
        tl.fromTo(".hero-intro", {
          opacity: 0,
          y: 24,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        }, 0.9);

        // Step D: Sequential photo reveals as you scroll
        tl.fromTo(".feed-fig-1",
          { opacity: 0, scale: 0.95, pointerEvents: "none" },
          { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, onStart: () => { fxRef.current.click(); } },
          1.3
        )
        .to(".feed-fig-1", { opacity: 0, scale: 1.05, pointerEvents: "none", duration: 0.4 }, 1.8);

        tl.fromTo(".feed-fig-2",
          { opacity: 0, scale: 0.95, pointerEvents: "none" },
          { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, onStart: () => { fxRef.current.click(); } },
          1.8
        )
        .to(".feed-fig-2", { opacity: 0, scale: 1.05, pointerEvents: "none", duration: 0.4 }, 2.3);

        tl.fromTo(".feed-fig-3",
          { opacity: 0, scale: 0.95, pointerEvents: "none" },
          { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, onStart: () => { fxRef.current.click(); } },
          2.3
        )
        .to(".feed-fig-3", { opacity: 0, scale: 1.05, pointerEvents: "none", duration: 0.4 }, 2.8);

        tl.fromTo(".feed-fig-4",
          { opacity: 0, scale: 0.95, pointerEvents: "none" },
          { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, onStart: () => { fxRef.current.click(); } },
          2.8
        )
        .to(".feed-fig-4", { opacity: 0, scale: 1.05, pointerEvents: "none", duration: 0.4 }, 3.3);

        // Step E: hold the collage static, then fade it before closing
        tl.to(".hero-intro", {
          opacity: 0,
          y: -20,
          duration: 0.45,
          ease: "power2.in",
        }, 3.6);

        // Step F: Shrink card back to placeholder bounds, slide up
        tl.fromTo(card, {
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          padding: 0,
          "--notch": "0px",
        }, {
          left: () => getCardBounds().left,
          top: () => getCardBounds().top - window.innerHeight,
          width: () => getCardBounds().width,
          height: () => getCardBounds().height,
          borderRadius: "10px",
          padding: "1.25rem",
          "--notch": "22px",
          duration: 1.1,
          ease: "power2.inOut",
          immediateRender: false,
        }, 4.0)
        .to(hudState, {
          earthY: 24.0,
          earthOpacity: 0.0,
          oldMoonY: -2.0,
          oldMoonOpacity: 0.0,
          duration: 1.1,
          ease: "power2.inOut",
        }, 4.0)
        .fromTo(".hero-card-meta", {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 0.35,
          immediateRender: false,
        }, 4.0)
        .fromTo(".hero-card-img-wrap", {
          left: wrapExpanded.left,
          width: wrapExpanded.width,
          top: wrapExpanded.top,
          height: wrapExpanded.height,
        }, {
          left: 0,
          width: () => getWrapCollapsedBounds().width,
          top: () => getWrapCollapsedBounds().top,
          height: () => getWrapCollapsedBounds().height,
          duration: 1.1,
          ease: "power2.inOut",
          immediateRender: false,
        }, 4.0);

        // Step G: Hold scroll lock briefly in its closed state before unpinning
        tl.to({}, { duration: 0.35 });
      }
    );

    const onResize = () => {
      matchPlaceholder();
    };

    window.addEventListener("resize", onResize);
    ScrollTrigger.addEventListener("refreshInit", onResize);

    const ro = new ResizeObserver(() => {
      onResize();
    });
    ro.observe(placeholder);
    ro.observe(root);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refreshInit", onResize);
      ro.disconnect();
      mm.revert();
    };
  }, [entered]);

  /* mouse parallax on the left column block — damped, ±10px */
  useEffect(() => {
    const el = wordsRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let last = performance.now();
    let px = 0;
    let py = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const a = expDampAlpha(4.5, dt);
      px += (hudState.pointer.x * 10 - px) * a;
      py += (-hudState.pointer.y * 6 - py) * a;
      el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative z-10 flex min-h-screen items-center px-6 py-12 md:py-20 md:px-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center w-full max-w-7xl mx-auto z-10">
        {/* Left Column: AERA Text Logo & About Me */}
        <div ref={wordsRef} className="flex flex-col items-start gap-6 will-change-transform relative z-10">
          <div className="hero-logo-target font-display font-black tracking-[-0.08em] text-paper uppercase select-none text-[12vw] md:text-[9vw] leading-none">
            <div className="flex gap-[0.02em]">
              <span>A</span>
              <span>E</span>
              <span>R</span>
              <span>A</span>
            </div>
          </div>
          
          {/* stacked display words, KPR-style — phrases over paragraphs */}
          <h1 className="hero-reveal opacity-0 translate-y-8 font-display font-black text-iris-bright text-[7vw] md:text-[3.6vw] leading-[0.95] tracking-tight uppercase">
            COMPUTER
            <br />
            ENGINEER<span className="text-paper">.</span>
          </h1>

          <p className="hero-reveal opacity-0 translate-y-8 t-label text-periwinkle/85">
            ● FULL-STACK · EMBEDDED · WEB3
          </p>

          <div className="hero-reveal opacity-0 translate-y-8 flex flex-wrap items-center gap-3 mt-2">
            <button
              onClick={() => {
                fx.click();
                window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "resume" } }));
              }}
              className="group relative card-notch overflow-hidden border border-transparent bg-white px-5 py-2.5 font-mono text-[9px] tracking-[0.12em] text-ink uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
              onMouseEnter={fx.blip}
            >
              {/* Sliding yellow background */}
              <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 transition-colors duration-300">
                ◍ VIEW RESUME
              </span>
            </button>
            <button
              onClick={() => {
                fx.click();
                window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "cv" } }));
              }}
              className="group relative card-notch overflow-hidden border border-transparent bg-white px-5 py-2.5 font-mono text-[9px] tracking-[0.12em] text-ink uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
              onMouseEnter={fx.blip}
            >
              {/* Sliding yellow background */}
              <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 transition-colors duration-300">
                ◍ VIEW CV
              </span>
            </button>
          </div>

          {/* Social Links Dock */}
          <div className="hero-reveal opacity-0 translate-y-8 flex items-center gap-2.5">
            {/* Email Button */}
            <a
              href="mailto:08airajosh@gmail.com"
              aria-label="Send Email to 08airajosh@gmail.com"
              title="Email: 08airajosh@gmail.com"
              className="card-notch flex h-10 w-10 md:h-11 md:w-11 items-center justify-center bg-signal text-ink transition-all duration-300 hover:scale-105 hover:bg-iris-bright hover:shadow-[0_0_20px_rgba(252,238,10,0.45)]"
              onMouseEnter={fx.blip}
              onClick={fx.confirm}
            >
              <svg
                className="h-4.5 w-4.5 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/Aera0908"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="GitHub Profile"
              title="GitHub: Aera0908"
              className="card-notch flex h-10 w-10 md:h-11 md:w-11 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_15px_rgba(252,238,10,0.25)]"
              onMouseEnter={fx.blip}
              onClick={fx.click}
            >
              <svg
                className="h-4.5 w-4.5 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            {/* LinkedIn Button */}
            <a
              href="https://linkedin.com/in/aira-josh-ynte"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="LinkedIn Profile"
              title="LinkedIn: aira-josh-ynte"
              className="card-notch flex h-10 w-10 md:h-11 md:w-11 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_15px_rgba(252,238,10,0.25)]"
              onMouseEnter={fx.blip}
              onClick={fx.click}
            >
              <svg
                className="h-4.5 w-4.5 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0-.02-3.3 1.65 1.65 0 0 0 .02 3.3M5.07 18.5h2.78v-8.37H5.07v8.37z" />
              </svg>
            </a>

            {/* X (Twitter) Button */}
            <a
              href="https://x.com/aera0908"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="X (Twitter) Profile"
              title="X: @aera0908"
              className="card-notch flex h-10 w-10 md:h-11 md:w-11 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_15px_rgba(252,238,10,0.25)]"
              onMouseEnter={fx.blip}
              onClick={fx.click}
            >
              <svg
                className="h-4 w-4 md:h-4.5 md:w-4.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column Spacer: Reserves card's slot in grid */}
        <div
          ref={cardPlaceholderRef}
          className="hero-img-container w-full max-w-[290px] sm:max-w-sm md:max-w-md aspect-[3/4] max-md:max-h-[42vh] justify-self-center md:justify-self-end relative pointer-events-none"
        />
      </div>

      {/* Pinned Card: Used for both layout and scrollytelling expansion */}
      <div
        ref={cardRef}
        className="card-notch absolute z-30 bg-paper text-ink p-5 flex flex-col justify-between overflow-hidden opacity-0 transform-gpu will-change-transform"
        style={{ pointerEvents: entered ? "auto" : "none" }}
      >
        <CyberLines tone="ink" />
        <div className="hero-card-meta flex justify-between t-micro text-ink-soft">
          <span>● SYSTEM {"//"} ACTIVE_PORTRAIT</span>
          <span>CPE &apos;26 {"//"} MNL·REMOTE</span>
        </div>

        <div className="flex-grow flex items-center justify-center relative w-full h-full">
          <div className="hero-intro pointer-events-none absolute inset-0 select-none text-ink opacity-0">
            <span className="t-micro absolute left-[6%] top-[9%] text-ink/65">
              ■ 001 // OPERATOR PROFILE
            </span>

            <h2 className="absolute left-[6%] top-[11%] w-[50%] max-md:w-[88%] font-display font-black uppercase leading-[0.95] tracking-tight text-[clamp(1.6rem,4vw,3.8rem)] max-md:text-[1.4rem]">
              BORN IN HARDWARE.
              <br />
              <span className="ml-[8%] max-md:ml-[4%] inline-block">FLUENT IN SOFTWARE.</span>
            </h2>

            {/* Figure 1: Blockchain4Youth */}
            <figure className="feed-fig-1 absolute left-[16%] top-[23%] [@media(max-height:620px)]:top-[19%] w-[68%] aspect-video max-md:aspect-auto md:left-[8%] md:top-[38%] md:w-[20%] md:aspect-[4/3] cursor-pointer opacity-0 pointer-events-none">
              {/* max-md:aspect-video — on mobile all four figures share one
                  slot, so a taller 4/3 box ran 54px into the paragraph below.
                  Uniform 16/9 keeps every figure the same height in that slot. */}
              <div className="card-notch aspect-[4/3] max-md:aspect-video max-md:max-h-[16vh] w-full overflow-hidden border border-ink/15 transition-all duration-500 hover:border-iris-bright/40 hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/events/base_ph_blockchain4youth.jpg"
                  alt="Base PH Blockchain4Youth - Presenting Aerovit"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60">
                ■ BLOCKCHAIN4YOUTH // UPHSL
              </figcaption>
            </figure>

            {/* Figure 2: DOST IMEC */}
            <figure className="feed-fig-2 absolute left-[16%] top-[23%] [@media(max-height:620px)]:top-[19%] w-[68%] aspect-video max-md:aspect-auto md:left-[28%] md:top-[46%] md:w-[22%] md:aspect-video cursor-pointer opacity-0 pointer-events-none">
              <div className="card-notch aspect-video w-full overflow-hidden border border-ink/15 transition-all duration-500 hover:border-iris-bright/40 hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/events/dost_imec_2026_aerovit.jpg"
                  alt="DOST IMEC 2026 - Aerovit Presentation"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60">
                ■ DOST IMEC 2026 // ACACIA HOTEL
              </figcaption>
            </figure>

            {/* Figure 3: Best Thesis & Poster */}
            <figure className="feed-fig-3 absolute left-[16%] top-[23%] [@media(max-height:620px)]:top-[19%] w-[68%] aspect-video max-md:aspect-auto md:left-[12%] md:top-[52%] md:w-[18%] md:aspect-[4/3] cursor-pointer opacity-0 pointer-events-none">
              {/* max-md:aspect-video — on mobile all four figures share one
                  slot, so a taller 4/3 box ran 54px into the paragraph below.
                  Uniform 16/9 keeps every figure the same height in that slot. */}
              <div className="card-notch aspect-[4/3] max-md:aspect-video max-md:max-h-[16vh] w-full overflow-hidden border border-ink/15 transition-all duration-500 hover:border-iris-bright/40 hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/events/best-thesis-best-poster.jpg"
                  alt="Best Thesis & Best Poster Award"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60">
                ■ BEST THESIS & POSTER // CDM
              </figcaption>
            </figure>

            {/* Figure 4: CDM Recognition Day */}
            <figure className="feed-fig-4 absolute left-[16%] top-[23%] [@media(max-height:620px)]:top-[19%] w-[68%] aspect-video max-md:aspect-auto md:left-[30%] md:top-[39%] md:w-[20%] md:aspect-video cursor-pointer opacity-0 pointer-events-none">
              <div className="card-notch aspect-video w-full overflow-hidden border border-ink/15 transition-all duration-500 hover:border-iris-bright/40 hover:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/projects/cdm-recognition-day-2026.jpg"
                  alt="CDM Recognition Day 2026"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60">
                ■ RECOGNITION DAY 2026 // CDM
              </figcaption>
            </figure>

            {/* Blurb + byline were each absolutely positioned by PERCENTAGE
                while the blurb's height is in PIXELS, so on a narrow phone it
                wrapped to a third line and ran 33px into the byline. On mobile
                they share one anchored flow block, which cannot overlap at any
                width. `md:contents` removes this wrapper from layout on desktop
                so the children keep resolving against .hero-intro exactly as
                before. */}
            <div className="max-md:absolute max-md:left-[6%] max-md:top-[51%] [@media(max-height:620px)]:top-[45%] max-md:flex max-md:w-[88%] max-md:flex-col max-md:gap-2.5 md:contents">
              <p className="md:absolute md:bottom-[10%] md:left-[6%] md:w-[22%] text-sm leading-relaxed text-ink/80">
                Computer engineer from Muntinlupa: building wearables, EDA tools, and settlement rails.
              </p>

              <span className="t-micro md:absolute md:bottom-[10%] md:left-[34%] text-ink/65">
                CPE &apos;26 · MNL · @AERA0908
              </span>
            </div>
          </div>

          <div className="group/portrait hero-card-img-wrap card-notch absolute left-0 right-0 top-[15%] bottom-[15%] w-full h-[70%] [--notch:38px] border border-ink/15 overflow-hidden bg-world-2 flex items-center justify-center transform-gpu will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portrait.webp"
              alt="AERA Portrait - Aira Josh Ynte"
              /* the one genuinely above-the-fold image — stays eager and is
                 hinted as the LCP candidate */
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_15%] scale-[1.5] transform-gpu will-change-transform transition-transform duration-700 ease-out group-hover/portrait:scale-[1.55]"
            />
            {/* full name lives inside the frame */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
              aria-hidden="true"
            />
            {/* frame line-work over the portrait */}
            <span
              className="pointer-events-none absolute left-4 top-4 h-10 w-px bg-paper/60"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute left-4 top-4 h-px w-10 bg-paper/60"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-5 right-5 h-2 w-2 border border-iris-bright/80"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
              <span className="t-micro text-paper/70">■ OPERATOR</span>
              <span className="font-display text-xl font-black uppercase tracking-tight text-paper md:text-2xl">
                AIRA JOSH YNTE
              </span>
            </div>
          </div>
        </div>

        <div className="hero-card-meta flex justify-between items-end t-micro text-ink-soft">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-ink">AERA.SYS</span>
            <span>B.S. COMPUTER ENGINEERING</span>
          </div>
          <span className="font-bold text-ink">@AERA0908</span>
        </div>
      </div>
    </section>
  );
}
