"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap, MOTION } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { navReturn } from "@/lib/nav-return";
import { CyberLines } from "@/components/ui/CyberLines";
import { VaultCard } from "@/components/ui/VaultCard";
import { DecodeText } from "@/components/ui/DecodeText";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { usePageTransition } from "@/components/providers/PageTransitionProvider";

/* top five flagships (fanned like collectible cards) — everything else
   lives in the ProjectGallery overlay; details live in /vault/archive/[slug] */
const PROJECTS = [
  {
    index: "P-01",
    name: "DOWN?",
    slug: "down",
    img: "/projects/notable-project-thumbnails/down.webp",
    stack: "NEXT.JS / REALTIME / GEO",
    summary: "Group meetup & hangout decider",
    badge: "Latest Release",
  },
  {
    index: "P-02",
    name: "FEHUVIA",
    slug: "fehuvia",
    img: "/projects/notable-project-thumbnails/fehuvia.webp",
    stack: "SOLIDITY / MORPH L2 / GPT-4O",
    summary: "Morph L2 B2B Treasury co-pilot",
  },
  {
    index: "P-03",
    name: "AEROVIT",
    slug: "aerovit",
    img: "/projects/notable-project-thumbnails/aerovit.webp",
    stack: "ESP32-S3 / FLUTTER / MEDIAPIPE",
    summary: "ESP32 fitness RPG & wearables",
    badge: "Awarded Best Thesis",
  },
  {
    index: "P-04",
    name: "STICKOUT",
    slug: "stickout",
    img: "/projects/notable-project-thumbnails/stickOut.webp",
    stack: "REACT 19 / HTML5 CANVAS / VLSI",
    summary: "VLSI interactive Stick-Diagram editor",
  },
  {
    index: "P-05",
    name: "GHOSTCUE",
    slug: "ghostcue",
    img: "/projects/notable-project-thumbnails/ghostcue.webp",
    stack: "TAURI v2 / RUST / REACT 19",
    summary: "AI interview copilot & stealth HUD",
    badge: "Desktop HUD",
  },
];

/** resting + hover pose for each fanned folder, left to right */
const FAN = [
  "top-12 z-10 -translate-x-[215%] rotate-[-14deg] group-hover/vault:-translate-x-[237%] group-hover/vault:rotate-[-18deg]",
  "top-5 z-20 -translate-x-[133%] rotate-[-7deg] group-hover/vault:-translate-x-[145%] group-hover/vault:-translate-y-2 group-hover/vault:rotate-[-9deg]",
  "top-0 z-30 -translate-x-1/2 group-hover/vault:-translate-y-3",
  "top-5 z-40 translate-x-[33%] rotate-[7deg] group-hover/vault:translate-x-[45%] group-hover/vault:-translate-y-2 group-hover/vault:rotate-[9deg]",
  "top-12 z-[45] translate-x-[115%] rotate-[14deg] group-hover/vault:translate-x-[127%] group-hover/vault:rotate-[18deg]",
];

/**
 * The vault: dark cards floating over the panel-grid particle formation.
 * Each card hides its architecture behind the KPR click-and-hold.
 */
export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { fx } = useHudAudio();
  const { transitionTo } = usePageTransition();

  // NEXT BUILD teaser → case file. Mirrors VaultCard's unlock: tag the
  // one-pager vault as the return target so BACK doesn't replay the intro.
  const openNextBuild = () => {
    fx.confirm();
    navReturn.set("/vault");
    router.push("/vault/archive/familiar");
  };

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

        /**
         * Journey exit — as this solid section slides up over the viewport,
         * the moonbase parallax layers behind it drift upward at different
         * speeds and fade out (foreground moon moves faster than the facility
         * dome), so the world hands off to the editorial sections.
         */
        gsap.fromTo(hudState, {
          facilityY: 2.5,
          moonParallaxY: 1.5,
          facilityOpacity: 1.0,
          moonParallaxOpacity: 1.0,
        }, {
          facilityY: 7.5, // slow background lift
          moonParallaxY: 11.5, // faster foreground lift
          facilityOpacity: 0.0,
          moonParallaxOpacity: 0.0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /* The FAMILIAR button is the punchline to the flagship fan: it stays
           hidden until the folders have landed, then docks in on its own beat. */
        gsap.set(".next-build-teaser", { autoAlpha: 0, x: -12 });

        /* once: true — this is a one-shot entrance. Without it a deep link to
           /vault (or a return from a case file) replays the card tween on each of
           Home's three ScrollTrigger.refresh() passes. */
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 95%", once: true },
        });

        const cardsSelector = isDesktop ? ".group\\/vault .proj-card" : ".vault-mobile-grid .proj-card";
        reveal.from(cardsSelector, {
          y: isDesktop ? 70 : 35,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.05,
          onComplete: () => {
            gsap.set(cardsSelector, { clearProps: "all" });
          },
        });

        reveal.to(
          ".next-build-teaser",
          { autoAlpha: 1, x: 0, duration: 0.45, ease: MOTION.servo },
          "+=0.15",
        );
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="vault"
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-world px-4 sm:px-6 min-h-screen md:h-screen w-full max-w-full flex flex-col justify-center pt-20 pb-8 sm:pt-24 sm:pb-10 md:pb-4 md:px-16"
    >
      <CyberLines />

      <h2 className="t-h2 mb-1 text-paper">
        <DecodeText text="THE VAULT" />
        <span className="text-iris-bright">.</span>
      </h2>
      <p className="t-label mb-6 text-periwinkle/60">● 002 // SELECTED BUILDS</p>

      {/* fanned collectible cards (desktop, 5 folders in sequence P-01 -> P-05).
          Card centres sit at -380 / -190 / 0 / 190 / 380px from the middle;
          translate-x is in % of the 230px card, so (centre - 115) / 230. */}
      <div className="group/vault relative mx-auto hidden h-[480px] w-full max-w-5xl md:block">
        {FAN.map((f, i) => (
          <div
            key={PROJECTS[i].index}
            className={`proj-card absolute left-1/2 w-[230px] transition-transform duration-500 ease-out hover:z-50 ${f}`}
          >
            <VaultCard {...PROJECTS[i]} />
          </div>
        ))}
      </div>

      {/* 2-column grid on small screens; the odd fifth folder centres on its own row */}
      <div className="vault-mobile-grid mx-auto grid grid-cols-2 w-full max-w-md gap-3 sm:gap-4 md:hidden">
        {PROJECTS.map((p, i) => (
          <div
            key={p.index}
            className={`proj-card ${
              i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1
                ? "col-span-2 mx-auto w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)]"
                : ""
            }`}
          >
            <VaultCard {...p} />
          </div>
        ))}
      </div>

      {/* full archive uplink + the next build, side by side */}
      <div className="mt-4 flex shrink-0 flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/vault/archive"
          className="group relative overflow-hidden rounded-md border border-periwinkle/30 bg-world-2/95 px-6 py-3 md:px-8 md:py-3.5 font-mono text-xs tracking-[0.16em] text-periwinkle uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
          onMouseEnter={fx.blip}
          onClick={(e) => {
            e.preventDefault();
            fx.click();
            transitionTo("/vault/archive");
          }}
        >
          {/* Sliding yellow background */}
          <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
          <span className="relative z-10 flex items-center gap-2 group-hover:text-ink transition-colors duration-300">
            <span className="text-iris-bright group-hover:text-ink">◍</span>
            <span className="md:hidden">OPEN ARCHIVE</span>
            <span className="hidden md:inline">OPEN PROJECT ARCHIVE // SYSTEMS + ARTS</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </Link>

        {/* NEXT BUILD: a classified file you can open, not decoration */}
        <button
          type="button"
          onClick={openNextBuild}
          onMouseEnter={fx.blip}
          aria-label="Familiar, next build, in development. Open case file"
          className="next-build-teaser group/next relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-md border border-iris-bright/60 bg-world-2 py-2 pl-3 pr-2 text-left transition-colors duration-300 hover:border-iris-bright active:translate-y-[2px]"
        >
          <span
            className="absolute inset-0 z-0 -translate-x-[101%] bg-iris-bright transition-transform duration-300 ease-out group-hover/next:translate-x-0"
            aria-hidden="true"
          />
          {/* padlock: the file is still sealed */}
          <svg
            viewBox="0 0 16 18"
            className="relative z-10 h-4 w-3.5 shrink-0 text-iris-bright transition-colors duration-300 group-hover/next:text-ink"
            aria-hidden="true"
          >
            <rect x="1.5" y="8" width="13" height="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M4.5 8 V5 a3.5 3.5 0 0 1 7 0 V8" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="7" y="11" width="2" height="3" fill="currentColor" />
          </svg>
          <span className="relative z-10 flex flex-col gap-1 leading-none">
            <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-iris-bright transition-colors duration-300 group-hover/next:text-ink">
              P-06 // IN DEVELOPMENT
            </span>
            <span className="font-display text-sm font-black uppercase tracking-tight text-paper transition-colors duration-300 group-hover/next:text-ink">
              FAMILIAR
            </span>
          </span>
          <span className="relative z-10 ml-2 flex items-center gap-1.5 bg-iris-bright px-2.5 py-1.5 font-mono text-[10px] font-black tracking-[0.14em] text-ink transition-colors duration-300 group-hover/next:bg-ink group-hover/next:text-iris-bright">
            VIEW BRIEF
            <span className="transition-transform duration-300 group-hover/next:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
