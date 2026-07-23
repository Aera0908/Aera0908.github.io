"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navReturn } from "@/lib/nav-return";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { CyberLines } from "@/components/ui/CyberLines";

type ArchiveItem = {
  index: string;
  slug: string;
  name: string;
  category: string;
  blurb: string;
  img?: string;
  nda?: boolean;
  links?: { label: string; href: string }[];
  badge?: string;
};

const SYSTEMS: ArchiveItem[] = [
  {
    index: "S-01",
    slug: "fehuvia",
    name: "FEHUVIA",
    category: "WEB3 / AI / FULL-STACK",
    blurb:
      "Open-finance B2B treasury workstation on Morph L2 — T+0 settlements under 2 seconds, zero-custody MetaMask signing, GPT-4o RAG co-pilot with OCR invoicing.",
    img: "/projects/fehuvia.png",
    links: [
      { label: "FEHUVIA.APP", href: "https://www.fehuvia.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/Project_Fehuvia" },
    ],
  },
  {
    index: "S-02",
    slug: "aerovit",
    name: "AEROVIT",
    badge: "Awarded Best Thesis",
    category: "IOT / AI / MOBILE",
    blurb:
      "Hybrid fitness ecosystem — custom ESP32-S3 smartwatch, BlazePose form coaching, a 20-floor dungeon RPG, and AERO ERC-20 rewards on Sepolia.",
    img: "/projects/aerovit.png",
    links: [{ label: "AEROVIT.DEV", href: "https://aerovit.dev" }],
  },
  {
    index: "S-03",
    slug: "stickout",
    name: "STICKOUT",
    category: "EDA / VLSI / WEB",
    blurb:
      "Interactive VLSI stick-diagram editor — infinite 2D canvas, same-layer auto-bridging crossovers, LaTeX subscript labels, .stk project files.",
    img: "/projects/stickout.png",
    links: [
      { label: "STICKOUT.VERCEL.APP", href: "https://stickout.vercel.app" },
      { label: "GITHUB", href: "https://github.com/Aera0908/stickOut" },
    ],
  },
  {
    index: "S-04",
    slug: "emg-controller",
    name: "EMG CONTROLLER",
    category: "EMBEDDED / HARDWARE",
    blurb:
      "Real-time electromyography on the ESP32-S3 — 500 Hz DSP pipeline, adaptive calibration, Python visualization GUI, muscle-driven game control.",
    img: "/projects/emg.png",
    links: [
      { label: "GITHUB", href: "https://github.com/Aera0908/emg-game-controller" },
    ],
  },
  {
    index: "S-05",
    slug: "safehouse",
    name: "THE SAFEHOUSE",
    category: "3D WEB / SHOWCASE",
    blurb:
      "Narrative 3D scroll-journey pitch site — procedural R3F forest and campfire world with GSAP + Lenis choreography and reduced-motion fallbacks.",
    img: "/projects/safehouse.png",
    links: [
      { label: "LIVE SITE", href: "https://safehouse-inky.vercel.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/safe-house" },
    ],
  },
  {
    index: "S-06",
    slug: "plantio",
    name: "PLANT.IO",
    category: "MOBILE / IOT — FREELANCE",
    blurb:
      "8-bit retro IoT nursery dashboard — live soil and climate telemetry from ESP32 beds, remote actuators, and an animated plant-mood avatar.",
    img: "/projects/plantio.png",
    nda: true,
  },
  {
    index: "S-07",
    slug: "manhwa-reader",
    name: "MANHWA READER",
    category: "WEB / FRONTEND",
    blurb:
      "MangaDex-powered reading SPA — discovery feeds, title search, detail pages, and a full chapter reader with persistent themes.",
    img: "/projects/manhwa.png",
  },
  {
    index: "S-08",
    slug: "student-consultation",
    name: "STUDENT CONSULTATION SYSTEM",
    category: "WEB / FULL-STACK — FREELANCE",
    blurb:
      "Student–professor consultation platform — role-based dashboards, realtime messaging, scheduling calendar, JWT auth, Sharp image pipeline.",
    nda: true,
  },
  {
    index: "S-09",
    slug: "walang-basagan",
    name: "WALANG BASAGAN NG THRIFT",
    category: "WEB / E-COMMERCE — FREELANCE",
    blurb:
      "Y2K-themed thrift storefront — full shopping flow, three-tier role model, admin back office, and a threaded customer-support inbox.",
    nda: true,
  },
  {
    index: "S-10",
    slug: "familiar",
    name: "FAMILIAR",
    badge: "IN DEVELOPMENT",
    category: "MOBILE / AI / CV",
    blurb:
      "Gamified study companion — on-device ML Kit distraction detection, a Flame-rendered creature that grows as you focus, ember-seed hatches, wax-seal achievements. Offline-first Isar + Firebase.",
    img: "/projects/familiar-classified.svg",
  },
];

const ARTS_VIDEOS = [
  {
    index: "A-01",
    name: "FEHUVIA WORKSTATION SHOWCASE",
    youtubeId: "aDBoZOoOhd8",
    tools: "FIGMA // ILLUSTRATOR // AFTER EFFECTS // PREMIERE PRO",
    blurb:
      "High-fidelity workstation highlights video — interface functionalities, dual-state data flows, and AI OCR capabilities. Custom visual assets in Figma and Adobe Illustrator, motion graphics in After Effects, edited in Premiere Pro.",
  },
  {
    index: "A-02",
    name: "AEROVIT ECOSYSTEM WALKTHROUGH",
    youtubeId: "rqx192_81zA",
    tools: "ILLUSTRATOR // AFTER EFFECTS // PREMIERE PRO",
    blurb:
      "Curated walkthrough of the hybrid fitness ecosystem — ESP32-S3 smartwatch pairing, MediaPipe BlazePose form tracking, Flame 2D dungeon RPG, and AERO Web3 withdrawals. Vector assets in Illustrator, keyframed animations in After Effects, final edit in Premiere Pro.",
  },
];



export default function ProjectArchivePage() {
  const { fx } = useHudAudio();
  const router = useRouter();

  // Open a case file, tagging the archive listing as the return target so its
  // BACK comes back here (not the one-pager vault section).
  const openCase = (slug: string) => {
    fx.click();
    navReturn.set("/vault/archive");
    router.push(`/vault/archive/${slug}`);
  };

  // Reset scroll to top on mount
  useEffect(() => {
    // Arriving here (incl. native back from a case file opened from this
    // listing) is the return target itself — clear the marker so it can't
    // leak into a later navigation to the one-pager.
    navReturn.consume();
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  // Listen for Escape key to close the archive standalone page and return to /vault
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fx.click();
        router.push("/vault");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, fx]);

  return (
    <main className="relative min-h-screen bg-world flex flex-col text-periwinkle select-text">
      <CyberLines />

      {/* header */}
      <div className="flex items-center justify-between border-b border-periwinkle/15 px-6 pt-7 pb-2 md:px-16 z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl font-black uppercase tracking-tight text-paper md:text-2xl">
            PROJECT ARCHIVE<span className="text-iris-bright">.</span>
          </h1>
          <span className="t-micro hidden text-periwinkle/50 sm:inline">
            {SYSTEMS.length} SYSTEMS // {ARTS_VIDEOS.length} ART TRACKS
          </span>
        </div>
        <button
          onClick={() => { fx.click(); router.push("/vault"); }}
          onMouseEnter={fx.blip}
          className="nav-link t-label text-periwinkle cursor-pointer"
        >
          ← BACK
        </button>
      </div>

      {/* body */}
      <div className="flex-1 px-6 py-10 md:px-16 z-10">
        <p className="t-label mb-6 text-iris-bright">
          ● SYSTEMS — HARDWARE & SOFTWARE
        </p>
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((p) => (
            <div
              key={p.index}
              role="button"
              tabIndex={0}
              onClick={() => openCase(p.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCase(p.slug);
                }
              }}
              className="clip-tab-tl flex flex-col border border-periwinkle/15 bg-world-2/60 transition-all duration-300 hover:border-iris-bright/50 hover:bg-world-2 hover:-translate-y-1 group cursor-pointer focus-visible:outline-2"
            >
              {p.img ? (
                <div className="aspect-video w-full overflow-hidden border-b border-periwinkle/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={`${p.name} cover`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center border-b border-periwinkle/10 bg-world">
                  <span className="t-micro text-periwinkle/50">
                    NDA // NO PUBLIC VISUAL
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="index-marker">● {p.index}</span>
                  <span className="t-micro text-periwinkle/50">{p.category}</span>
                </div>
                <h3 className="mb-2 font-display text-lg font-black uppercase tracking-tight text-paper group-hover:text-iris-bright transition-colors flex items-center gap-2">
                  {p.name}
                  {p.badge && (
                    <span className="text-[8px] font-bold font-mono tracking-widest text-[#0c0d12] bg-[#e8d90c] px-1.5 py-0.5 uppercase leading-none rounded-sm">
                      {p.badge}
                    </span>
                  )}
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-periwinkle/75">
                  {p.blurb}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-periwinkle/5">
                  <span className="font-mono text-[9px] font-bold tracking-widest text-iris group-hover:text-iris-bright transition-colors uppercase">
                    CLICK TO OPEN CASE FILE
                  </span>
                  <div className="flex flex-wrap gap-3 z-10">
                    {p.nda && (
                      <span className="t-micro text-periwinkle/50 select-none">
                        ◆ CLIENT WORK
                      </span>
                    )}
                    {p.links?.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          fx.click();
                        }}
                        className="t-micro text-periwinkle/50 hover:text-paper hover:underline uppercase"
                        onMouseEnter={fx.blip}
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="t-label mb-6 text-iris-bright">
          ● ARTS — VIDEO / PUBMATS / VISUAL
        </p>
        <div className="grid gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-2">
          {ARTS_VIDEOS.map((a) => (
            <div
              key={a.index}
              className="group card-notch overflow-hidden border border-periwinkle/15 bg-world-2 transition-all duration-300 hover:border-iris-bright/50 hover:shadow-[0_0_20px_rgba(252,238,10,0.08)]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${a.youtubeId}`}
                  title={a.name}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="index-marker">● {a.index}</span>
                  <span className="font-display text-sm font-black uppercase tracking-tight text-paper">
                    {a.name}
                  </span>
                </div>
                <p className="t-micro mb-3 text-iris-bright/70">{a.tools}</p>
                <p className="text-xs leading-relaxed text-periwinkle/70">
                  {a.blurb}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
