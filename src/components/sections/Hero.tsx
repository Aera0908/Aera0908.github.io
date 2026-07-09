"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { expDampAlpha } from "@/lib/scene";
import { CyberLines } from "@/components/ui/CyberLines";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function Hero({ entered }: { entered: boolean }) {
  const { fx } = useHudAudio();
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

    // Helper to position the absolute card exactly over its layout placeholder
    const matchPlaceholder = () => {
      const placeholderRect = placeholder.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      gsap.set(card, {
        left: placeholderRect.left - rootRect.left,
        top: placeholderRect.top - rootRect.top,
        width: placeholderRect.width,
        height: placeholderRect.height,
      });

      const wrapEl = card.querySelector(".hero-card-img-wrap") as HTMLElement;
      if (wrapEl) {
        const metaRows = card.querySelectorAll(".hero-card-meta");
        let metaHeight = 0;
        metaRows.forEach((row) => {
          metaHeight += row.getBoundingClientRect().height;
        });
        if (metaHeight === 0) {
          metaHeight = 36;
        }

        const w = placeholderRect.width - 40;
        const pHeight = placeholderRect.height - 40 - metaHeight;
        const t = pHeight * 0.15;
        const h = pHeight * 0.70;

        gsap.set(wrapEl, {
          left: 0,
          width: w,
          top: t,
          height: h,
        });
      }
    };

    // Initialize layout position
    matchPlaceholder();

    // Re-adjust card layout position on window resize
    window.addEventListener("resize", matchPlaceholder);

    let ctx: gsap.Context | undefined;

    const timer = setTimeout(() => {
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
        const rect = placeholder.getBoundingClientRect();
        const metaRows = card.querySelectorAll(".hero-card-meta");
        let metaHeight = 0;
        metaRows.forEach((row) => {
          metaHeight += row.getBoundingClientRect().height;
        });
        if (metaHeight === 0) {
          metaHeight = 36;
        }

        const pWidth = rect.width - 40;
        const pHeight = rect.height - 40 - metaHeight;
        return {
          left: 0,
          width: pWidth,
          top: pHeight * 0.15,
          height: pHeight * 0.70,
        };
      };

      ctx = gsap.context(() => {
        // Create scroll trigger timeline to pin Hero section and morph the card
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=2000", // Pinned scroll length (made shorter to bring Journey in faster)
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

        // Step B: Morph the exact same card container to cover the full
        // viewport. All repeated-target steps use explicit fromTo: with
        // lazy .to() starts, invalidateOnRefresh + entering the pin from
        // BELOW (deep link / back-nav) captured mid-scrub values and
        // corrupted the whole morph.
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
          // viewport units, NOT "100%": percentages resolve against the
          // section (min-h-screen + padding ≈ 146vh) and oversize the card
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
          earthY: 24.0, // Earth slides up slowly
          earthOpacity: 0.0, // Earth fades out
          oldMoonY: -2.0, // old Moon slides up slowly (removed fast speed to prevent cut-off)
          oldMoonOpacity: 0.0, // old Moon fades out completely during expansion
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
          left: "58vw",
          width: "35vw",
          top: 0,
          height: "100%",
          duration: 1.0,
          ease: "power2.inOut",
          immediateRender: false,
        }, 0.1);

        // Step C: Reveal the one-screen intro collage (no inner scrolling —
        // it simply holds while the viewer reads, then the card collapses)
        tl.fromTo(".hero-intro", {
          opacity: 0,
          y: 24,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        }, 0.9);

        // Step D: hold the collage static, then fade it before closing
        tl.to(".hero-intro", {
          opacity: 0,
          y: -20,
          duration: 0.45,
          ease: "power2.in",
        }, 3.0);

        // Step F: Shrink card back to placeholder bounds, slide up, & transition background parallax layers
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
        }, 3.4)
        .to(hudState, {
          earthY: 24.0, // Keep Earth out of view
          earthOpacity: 0.0, // Keep Earth faded out
          oldMoonY: -2.0, // Keep old Moon slowly translated
          oldMoonOpacity: 0.0, // Keep old Moon faded out
          duration: 1.1,
          ease: "power2.inOut",
        }, 3.4)
        .fromTo(".hero-card-meta", {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 0.35,
          immediateRender: false,
        }, 3.4)
        .fromTo(".hero-card-img-wrap", {
          left: "58vw",
          width: "35vw",
          top: 0,
          height: "100%",
        }, {
          left: 0,
          width: () => getWrapCollapsedBounds().width,
          top: () => getWrapCollapsedBounds().top,
          height: () => getWrapCollapsedBounds().height,
          duration: 1.1,
          ease: "power2.inOut",
          immediateRender: false,
        }, 3.4)


        // Step G: Hold scroll lock briefly in its closed state before unpinning
        tl.to({}, { duration: 0.35 });

      }, rootRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", matchPlaceholder);
      if (ctx) ctx.revert();
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
      className="relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center w-full max-w-7xl mx-auto z-10">
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

          <div className="hero-reveal opacity-0 translate-y-8 flex flex-wrap gap-3 mt-2">
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
        </div>

        {/* Right Column Spacer: Reserves card's slot in grid */}
        <div
          ref={cardPlaceholderRef}
          className="hero-img-container w-full max-w-md aspect-[3/4] justify-self-center md:justify-self-end relative pointer-events-none"
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
            <span className="t-micro absolute left-[6%] top-[9%] text-ink/50">
              ■ 001 — OPERATOR PROFILE
            </span>

            <h3 className="absolute left-[6%] top-[13%] w-[50%] font-display font-black uppercase leading-[0.95] tracking-tight text-[clamp(1.6rem,4vw,3.8rem)]">
              BORN IN HARDWARE.
              <br />
              <span className="ml-[8%] inline-block">FLUENT IN SOFTWARE.</span>
            </h3>

            <figure className="group/ev1 absolute left-[6%] top-[44%] w-[15%] cursor-pointer pointer-events-auto">
              <div className="card-notch aspect-[4/3] w-full overflow-hidden border border-ink/15 transition-all duration-500 group-hover/ev1:border-iris-bright/40 group-hover/ev1:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/events/base_ph_blockchain4youth.jpg"
                  alt="Base PH Blockchain4Youth — Presenting Aerovit"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/ev1:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60 transition-colors duration-300 group-hover/ev1:text-ink/90">
                ■ BLOCKCHAIN4YOUTH — UPHSL
              </figcaption>
            </figure>

            <figure className="group/ev2 absolute left-[34%] top-[52%] w-[19%] cursor-pointer pointer-events-auto">
              <div className="card-notch aspect-video w-full overflow-hidden border border-ink/15 transition-all duration-500 group-hover/ev2:border-iris-bright/40 group-hover/ev2:shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/events/dost_imec_2026_aerovit.jpg"
                  alt="DOST IMEC 2026 — Aerovit Presentation"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/ev2:scale-110"
                />
              </div>
              <figcaption className="t-micro mt-2 text-ink/60 transition-colors duration-300 group-hover/ev2:text-ink/90">
                ■ DOST IMEC 2026 — ACACIA HOTEL
              </figcaption>
            </figure>

            <p className="absolute bottom-[10%] left-[6%] w-[22%] text-sm leading-relaxed text-ink/80">
              Computer engineer from Muntinlupa — building wearables, EDA tools, and settlement rails.
            </p>

            <span className="t-micro absolute bottom-[10%] left-[34%] text-ink/50">
              CPE &apos;26 · MNL · @AERA0908
            </span>
          </div>

          <div className="group/portrait hero-card-img-wrap card-notch absolute left-0 right-0 top-[15%] bottom-[15%] w-full h-[70%] [--notch:38px] border border-ink/15 overflow-hidden bg-world-2 flex items-center justify-center transform-gpu will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portrait.png"
              alt="AERA Portrait — Aira Josh Ynte"
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
