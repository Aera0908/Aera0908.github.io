"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hudState } from "@/lib/hud-state";
import { expDampAlpha } from "@/lib/scene";

export function Hero({ entered }: { entered: boolean }) {
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
    };

    // Initialize layout position
    matchPlaceholder();

    // Re-adjust card layout position on window resize
    window.addEventListener("resize", matchPlaceholder);

    const timer = setTimeout(() => {
      const scroller = document.querySelector(".hero-achievements-scroller");
      const scrollHeight = scroller?.scrollHeight || 400;
      const scrollDelta = Math.max(scrollHeight - window.innerHeight * 0.6, 200);

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

      const ctx = gsap.context(() => {
        // Create scroll trigger timeline to pin Hero section and morph the card
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=3200", // Pinned scroll length
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
        tl.to(card, {
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
          padding: 0,
          "--notch": "0px",
          duration: 1.0,
          ease: "power2.inOut",
        }, 0.1)
        .to(".hero-card-meta", {
          opacity: 0,
          duration: 0.3,
        }, 0.1)
        .to(".hero-card-img-wrap", {
          left: "58vw",
          width: "35vw",
          top: 0,
          height: "100%",
          duration: 1.0,
          ease: "power2.inOut",
        }, 0.1);

        // Step C: Reveal achievements panel on the left side
        tl.to(".hero-scroll-left", {
          opacity: 1,
          pointerEvents: "auto",
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        }, 0.9);

        // Step D: Scroll achievements text container vertically
        tl.to(".hero-achievements-scroller", {
          y: -scrollDelta,
          duration: 1.6,
          ease: "none",
        }, 1.4);

        // Step E: Fade out achievements panel before closing
        tl.to(".hero-scroll-left", {
          opacity: 0,
          pointerEvents: "none",
          y: -20,
          duration: 0.45,
          ease: "power2.in",
        }, 3.0);

        // Step F: Shrink card back to placeholder bounds & slide up out of viewport
        tl.to(card, {
          left: () => getCardBounds().left,
          top: () => getCardBounds().top - window.innerHeight,
          width: () => getCardBounds().width,
          height: () => getCardBounds().height,
          borderRadius: "10px",
          padding: "1.25rem",
          "--notch": "22px",
          duration: 1.1,
          ease: "power2.inOut",
        }, 3.4)
        .to(".hero-card-meta", {
          opacity: 1,
          duration: 0.35,
        }, 3.4)
        .to(".hero-card-img-wrap", {
          left: 0,
          width: "100%",
          top: "15%",
          height: "70%",
          duration: 1.1,
          ease: "power2.inOut",
        }, 3.4)


        // Step G: Hold scroll lock briefly in its closed state before unpinning
        tl.to({}, { duration: 0.35 });

      }, rootRef);

      return () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", matchPlaceholder);
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
          <div className="hero-logo-target font-display font-black tracking-[-0.06em] text-paper uppercase select-none text-[12vw] md:text-[9vw] leading-none">
            <div className="flex gap-[0.15em]">
              <span>A</span>
              <span>E</span>
              <span>R</span>
              <span>A</span>
            </div>
          </div>
          
          <div className="hero-reveal opacity-0 translate-y-8 flex flex-col gap-2">
            <h2 className="font-display font-black text-iris-bright text-[8vw] md:text-[4.5vw] leading-none tracking-tight uppercase">
              FIRSTNAME LASTNAME
            </h2>
            <p className="t-label text-periwinkle/85">
              ● CREATIVE FRONTEND & GRAPHICS ENGINEER
            </p>
          </div>

          <div className="hero-reveal opacity-0 translate-y-8 max-w-md text-sm leading-relaxed text-periwinkle/70 flex flex-col gap-4">
            <p>
              I build immersive 3D web experiences, combining cutting-edge WebGL graphics with clean React architectures. Specialize in custom GSAP timelines, responsive layouts, and interactive scrollytelling.
            </p>
            <p className="text-xs text-iris-bright font-mono">
              [STACK: REACT / GSAP / THREE.JS / TAILWIND]
            </p>
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
        className="card-notch absolute z-30 bg-paper text-ink p-5 flex flex-col justify-between overflow-hidden opacity-0"
        style={{ pointerEvents: entered ? "auto" : "none" }}
      >
        <div className="hero-card-meta flex justify-between t-micro text-ink-soft">
          <span>● SYSTEM // ACTIVE_PORTRAIT</span>
          <span>10K // KPR_MEMBER</span>
        </div>

        <div className="flex-grow flex items-center justify-center relative w-full h-full">
          <div className="hero-scroll-left absolute left-0 top-0 w-[55vw] h-full overflow-hidden flex flex-col justify-center px-6 md:px-16 py-10 opacity-0 pointer-events-none text-ink select-text">
            <div className="hero-achievements-scroller flex flex-col gap-10 py-6">
              <div className="flex flex-col gap-3 border-b border-ink/10 pb-5">
                <span className="font-mono text-xs text-ink/40">● PHASE 01 / CREATION</span>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-ink">
                  SYSTEM FOUNDATION
                </h3>
                <p className="text-sm leading-relaxed text-ink/75">
                  Initialized research into responsive visual layouts, bridging the space between physical typography and digital architectures.
                </p>
              </div>
              <div className="flex flex-col gap-3 border-b border-ink/10 pb-5">
                <span className="font-mono text-xs text-ink/40">● PHASE 02 / GRAPHICS LAB</span>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-ink">
                  CREATIVE SYNAPSE
                </h3>
                <p className="text-sm leading-relaxed text-ink/75">
                  Developed custom GPU shaders and layout engines, combining immersive WebGL textures with GSAP timeline scrollytelling.
                </p>
              </div>
              <div className="flex flex-col gap-3 border-b border-ink/10 pb-5">
                <span className="font-mono text-xs text-ink/40">● PHASE 03 / AERA DEPLOYMENT</span>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-ink">
                  AERA INTEGRATION
                </h3>
                <p className="text-sm leading-relaxed text-ink/75">
                  Synthesized development guidelines with flat KPR-inspired editorial designs, building high-fidelity portfolio templates.
                </p>
              </div>
            </div>
          </div>

          <div className="hero-card-img-wrap absolute left-0 right-0 top-[15%] bottom-[15%] w-full h-[70%] border border-ink/15 overflow-hidden bg-world-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kpr_portrait.png"
              alt="AERA Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="hero-card-meta flex justify-between items-end t-micro text-ink-soft">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-ink">AERA.SYS</span>
            <span>INITIAL_COLLECTION</span>
          </div>
          <span className="font-bold text-ink">AERA.DEV</span>
        </div>
      </div>
    </section>
  );
}
