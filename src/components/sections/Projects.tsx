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
    img: "/projects/notable-project-thumbnails/aerovit.webp",
    stack: "ESP32-S3 / FLUTTER / MEDIAPIPE",
    summary: "ESP32 fitness RPG & wearables",
    badge: "Awarded Best Thesis",
  },
  {
    index: "P-01",
    name: "FEHUVIA",
    slug: "fehuvia",
    img: "/projects/notable-project-thumbnails/fehuvia.webp",
    stack: "SOLIDITY / MORPH L2 / GPT-4O",
    summary: "Morph L2 B2B Treasury co-pilot",
  },
  {
    index: "P-03",
    name: "STICKOUT",
    slug: "stickout",
    img: "/projects/notable-project-thumbnails/stickOut.webp",
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

        /* The FAMILIAR teaser is the punchline to the flagship fan, so it must
           not ride the same stagger as the cards — it waits until all three have
           landed, then announces itself.
           The entry vector is layout-dependent: on desktop the tape is a slanted
           full-bleed ribbon, so it slides in ALONG its own 30-degree angle. On
           mobile it is an ordinary button sitting under the archive link, so that
           diagonal would fly it in from off-canvas — it just rises instead. */
        gsap.set(
          ".next-build-teaser",
          isDesktop
            ? { autoAlpha: 0, x: -350, y: -202 }
            : { autoAlpha: 0, x: 0, y: 24 },
        );

        /* once: true — this is a one-shot entrance. Without it a deep link to
           /vault (or a return from a case file) replays the card tween on each of
           Home's three ScrollTrigger.refresh() passes. */
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 95%", once: true },
        });

        reveal.from(".proj-card", {
          y: 70,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.06,
          onComplete: () => {
            gsap.set(".proj-card", { clearProps: "all" });
          },
        });

        /* Cued AFTER cards finish entry animation: slides in along its exact 30-degree slanted angle,
           settling with ease-in and bounce-out (back.out). */
        reveal.to(
          ".next-build-teaser",
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: "back.out(1.4)",
          },
          "+=0.4",
        );
      }
    );

    return () => mm.revert();
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
      <p className="t-label mb-6 text-periwinkle/60">● 002 // SELECTED BUILDS</p>

      {/* fanned collectible cards (desktop) */}
      <div className="group/vault relative mx-auto hidden h-[460px] max-w-4xl md:block">
        {/* hover:z-40 lifts the hovered folder above the center card and
            snaps back to the fan order on unhover. AEROVIT (the pilot
            project) holds the elevated center slot. */}
        <div className="proj-card absolute left-1/2 top-12 w-[250px] -translate-x-[132%] rotate-[-8deg] transition-transform duration-500 ease-out group-hover/vault:-translate-x-[155%] group-hover/vault:rotate-[-14deg] hover:z-40">
          <VaultCard {...PROJECTS[1]} />
        </div>
        <div className="proj-card absolute left-1/2 top-0 z-10 w-[280px] -translate-x-1/2 transition-transform duration-500 ease-out group-hover/vault:-translate-y-4 hover:z-40">
          <VaultCard {...PROJECTS[0]} />
        </div>
        <div className="proj-card absolute left-1/2 top-12 w-[250px] translate-x-[32%] rotate-[8deg] transition-transform duration-500 ease-out group-hover/vault:translate-x-[55%] group-hover/vault:rotate-[14deg] hover:z-40">
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

      {/* NEXT BUILD — FAMILIAR teaser ribbon tape: Extended length yellow caution tape
          slanted DOWNWARD across lower-left area, expanded 50% on both sides. Click → case file. */}
      {/* On mobile the slanted full-bleed ribbon cannot work — rotated and
          750px wide it lies across the stacked cards — so it becomes an
          ordinary in-flow button. `order-last` drops it BELOW the archive link
          (which is earlier in the DOM); on md it goes back to being absolutely
          positioned, where order is irrelevant. */}
      <div className="next-build-teaser pointer-events-none z-20 order-last mt-5 flex w-full justify-center md:absolute md:order-none md:mt-0 md:block md:w-auto md:bottom-90 md:-left-28">
        <button
          onClick={openNextBuild}
          onMouseEnter={fx.blip}
          className="group/next pointer-events-auto relative block shrink-0 cursor-pointer overflow-hidden rounded-sm border-y-2 border-black bg-[#e8d90c] text-left shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#fff024] focus-visible:outline-2 origin-top-left w-full max-w-sm min-w-0 rotate-0 px-4 py-2.5 md:w-auto md:max-w-none md:min-w-[1000px] md:rotate-[30deg] md:px-28 md:py-3"
          aria-label="FAMILIAR - next build, in development. Open case file"
        >
          {/* Caution hazard stripes accent borders */}
          <div className="animate-stripe-slow absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(45deg,#0c0d12,#0c0d12_10px,#e8d90c_10px,#e8d90c_20px)]" />
          <div className="animate-stripe-slow absolute inset-x-0 bottom-0 h-1 bg-[repeating-linear-gradient(45deg,#0c0d12,#0c0d12_10px,#e8d90c_10px,#e8d90c_20px)]" />

          <div className="animate-marquee-slow flex w-max items-center whitespace-nowrap">
            {[0, 1].map((half) => (
              <div
                key={half}
                aria-hidden={half === 1}
                className="flex items-center gap-6 pr-6 font-mono text-xs font-black uppercase tracking-wider text-[#0c0d12]"
              >
                <span className="opacity-40">●</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full bg-black animate-ping" />
                  P-04 // FAMILIAR
                </span>
                <span className="opacity-40">●</span>
                <span className="bg-black text-[#e8d90c] px-2.5 py-0.5 rounded-xs text-[10px] font-extrabold tracking-widest">
                  IN DEVELOPMENT
                </span>
                <span className="opacity-40">●</span>
                <span className="font-bold underline decoration-2 underline-offset-4 group-hover/next:translate-x-1 transition-transform inline-flex items-center gap-1">
                  DECRYPT CASE FILE →
                </span>
                <span className="opacity-40">●</span>
                <span className="opacity-70 text-[10px] font-extrabold tracking-widest">
                  RESTRICTED AREA
                </span>
              </div>
            ))}
          </div>
        </button>
      </div>

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
            ◍ OPEN PROJECT ARCHIVE // SYSTEMS + ARTS
          </span>
        </Link>
      </div>
    </section>
  );
}
