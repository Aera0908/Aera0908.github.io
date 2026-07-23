"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { navReturn } from "@/lib/nav-return";
import { CyberLines } from "@/components/ui/CyberLines";
import { VaultCard } from "@/components/ui/VaultCard";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { usePageTransition } from "@/components/providers/PageTransitionProvider";

/* top three flagships (fanned like collectible cards) — everything else
   lives in the ProjectGallery overlay; details live in /projects/[slug] */
const PROJECTS = [
  {
    index: "P-02",
    name: "AEROVIT",
    slug: "aerovit",
    img: "/projects/notable-project-thumbnails/aerovit.png",
    stack: "ESP32-S3 / FLUTTER / MEDIAPIPE",
    summary: "ESP32 fitness RPG & wearables",
    badge: "Awarded Best Thesis",
  },
  {
    index: "P-01",
    name: "FEHUVIA",
    slug: "fehuvia",
    img: "/projects/notable-project-thumbnails/fehuvia.png",
    stack: "SOLIDITY / MORPH L2 / GPT-4O",
    summary: "Morph L2 B2B Treasury co-pilot",
  },
  {
    index: "P-03",
    name: "STICKOUT",
    slug: "stickout",
    img: "/projects/notable-project-thumbnails/stickOut.png",
    stack: "REACT 19 / HTML5 CANVAS / VLSI",
    summary: "VLSI interactive Stick-Diagram editor",
  },
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
    const ctx = gsap.context(() => {
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

      gsap.from(".proj-card", {
        y: 70,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: rootRef.current, start: "top 95%" },
        onComplete: () => {
          gsap.set(".proj-card", { clearProps: "all" });
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="vault"
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-world px-6 min-h-screen md:h-screen w-screen flex flex-col justify-center pt-24 pb-10 md:pb-4 md:px-16"
    >
      <CyberLines />

      <h2 className="t-h2 mb-1 text-paper">
        THE VAULT<span className="text-iris-bright">.</span>
      </h2>
      <p className="t-label mb-6 text-periwinkle/60">● 002 — SELECTED BUILDS</p>

      {/* fanned collectible cards (desktop) */}
      <div className="group/vault relative mx-auto hidden h-[460px] max-w-4xl md:block">
        {/* hover:z-40 lifts the hovered folder above the center card and
            snaps back to the fan order on unhover. AEROVIT (the pilot
            project) holds the elevated center slot. */}
        <div className="proj-card absolute left-1/2 top-12 w-[250px] -translate-x-[132%] rotate-[-8deg] transition-all duration-500 ease-out group-hover/vault:-translate-x-[155%] group-hover/vault:rotate-[-14deg] hover:z-40">
          <VaultCard {...PROJECTS[1]} />
        </div>
        <div className="proj-card absolute left-1/2 top-0 z-10 w-[280px] -translate-x-1/2 transition-all duration-500 ease-out group-hover/vault:-translate-y-4 hover:z-40">
          <VaultCard {...PROJECTS[0]} />
        </div>
        <div className="proj-card absolute left-1/2 top-12 w-[250px] translate-x-[32%] rotate-[8deg] transition-all duration-500 ease-out group-hover/vault:translate-x-[55%] group-hover/vault:rotate-[14deg] hover:z-40">
          <VaultCard {...PROJECTS[2]} />
        </div>
      </div>

      {/* stacked on small screens */}
      <div className="mx-auto grid w-full max-w-sm gap-6 md:hidden">
        {PROJECTS.map((p) => (
          <div key={p.index} className="proj-card">
            <VaultCard {...p} />
          </div>
        ))}
      </div>

      {/* NEXT BUILD — FAMILIAR teaser signage: full-bleed scrolling marquee
          under the flagship fan. The fan stays flagship-only; the WIP flagship
          announces itself like construction-site signage. Click → case file. */}
      <button
        onClick={openNextBuild}
        onMouseEnter={fx.blip}
        className="proj-card marquee-strip group/next relative mt-4 -mx-6 block shrink-0 overflow-hidden border-y border-periwinkle/20 bg-world-2/60 py-2 transition-colors duration-300 hover:border-iris-bright/60 hover:bg-world-2 cursor-pointer focus-visible:outline-2 md:-mx-16"
        aria-label="FAMILIAR — next build, in development. Open case file"
      >
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex items-center"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="flex items-center gap-4 pr-4">
                  <span className="t-micro text-iris-bright">
                    ◍ INCOMING TRANSMISSION
                  </span>
                  <span className="t-micro text-periwinkle/60">
                    P-04 // CODENAME:
                  </span>
                  <span className="font-display text-base font-black uppercase leading-none tracking-tight text-paper transition-colors group-hover/next:text-iris-bright">
                    FAMILIAR
                  </span>
                  <span className="text-[8px] font-bold font-mono tracking-widest text-[#0c0d12] bg-[#e8d90c] px-1.5 py-0.5 uppercase leading-none rounded-sm">
                    IN DEVELOPMENT
                  </span>
                  <span className="t-micro text-periwinkle/60">
                    SOMETHING IS HATCHING IN THE VAULT
                  </span>
                  <span className="t-micro text-iris-bright/40">✦</span>
                  <span className="t-micro text-periwinkle/60">
                    IT WATCHES YOU STUDY
                  </span>
                  <span className="t-micro text-periwinkle/40">
                    DECRYPT CASE FILE →
                  </span>
                  <span className="t-micro text-iris-bright/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </button>

      {/* full archive uplink */}
      <div className="mt-4 flex shrink-0 justify-center">
        <Link
          href="/vault/archive"
          className="group relative card-notch overflow-hidden border border-periwinkle/30 px-8 py-4 font-mono text-xs tracking-[0.16em] text-periwinkle uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
          onMouseEnter={fx.blip}
          onClick={(e) => {
            e.preventDefault();
            fx.click();
            transitionTo("/vault/archive");
          }}
        >
          {/* Sliding yellow background */}
          <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
          <span className="relative z-10 group-hover:text-ink transition-colors duration-300">
            ◍ OPEN PROJECT ARCHIVE — SYSTEMS + ARTS
          </span>
        </Link>
      </div>
    </section>
  );
}
