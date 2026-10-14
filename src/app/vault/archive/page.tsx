"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { navReturn } from "@/lib/nav-return";
import { gsap, MOTION, prefersReducedMotion } from "@/lib/gsap";
import { decodeTween } from "@/lib/decode";
import { getCaseStudy } from "@/lib/case-studies";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { CyberLines } from "@/components/ui/CyberLines";

type Kind = "HW" | "SW" | "WEB" | "CLIENT";

type ArchiveItem = {
  index: string;
  slug: string;
  name: string;
  category: string;
  blurb: string;
  kinds: Kind[];
  img?: string;
  nda?: boolean;
  links?: { label: string; href: string }[];
  badge?: string;
};

const SYSTEMS: ArchiveItem[] = [
  {
    index: "S-01",
    slug: "down",
    name: "DOWN?",
    badge: "LATEST RELEASE",
    category: "NEXT.JS / REALTIME / GEO",
    kinds: ["WEB"],
    blurb:
      "Group meetup & hangout decider web app: 30-second barkada consensus, zero-install instant rooms, real-time Firebase & SSE sync, Framer Motion Tinder-style card deck, Leaflet & Overpass POI radar.",
    img: "/projects/down-banner.png",
    links: [
      { label: "DOWN-APP.PARTY", href: "https://www.down-app.party" },
      { label: "GITHUB", href: "https://github.com/Aera0908/down-app" },
    ],
  },
  {
    index: "S-02",
    slug: "ghostcue",
    name: "GHOSTCUE",
    badge: "RELEASED",
    category: "AI / DESKTOP HUD / TAURI",
    kinds: ["SW"],
    blurb:
      "Uncapturable desktop HUD & AI interview copilot: real-time dual-audio WASAPI loopback, local Whisper GGML STT, screen OCR, multi-model LLM routing (Gemini, Claude, GPT-4o, Ollama), anti-capture stealth.",
    img: "/projects/ghostcue-banner.png",
    links: [{ label: "GITHUB", href: "https://github.com/Aera0908/GhostCue" }],
  },
  {
    index: "S-03",
    slug: "fehuvia",
    name: "FEHUVIA",
    category: "WEB3 / AI / FULL-STACK",
    kinds: ["WEB"],
    blurb:
      "Open-finance B2B treasury workstation on Morph L2: T+0 settlements under 2 seconds, zero-custody MetaMask signing, GPT-4o RAG co-pilot with OCR invoicing.",
    img: "/projects/fehuvia.webp",
    links: [
      { label: "FEHUVIA.APP", href: "https://www.fehuvia.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/Project_Fehuvia" },
    ],
  },
  {
    index: "S-04",
    slug: "aerovit",
    name: "AEROVIT",
    badge: "BEST THESIS",
    category: "IOT / AI / MOBILE",
    kinds: ["HW", "SW"],
    blurb:
      "Hybrid fitness ecosystem: custom ESP32-S3 smartwatch, BlazePose form coaching, a 20-floor dungeon RPG, and AERO ERC-20 rewards on Sepolia.",
    img: "/projects/aerovit.webp",
    links: [{ label: "AEROVIT.DEV", href: "https://aerovit.dev" }],
  },
  {
    index: "S-05",
    slug: "stickout",
    name: "STICKOUT",
    category: "EDA / VLSI / WEB",
    kinds: ["WEB", "SW"],
    blurb:
      "Interactive VLSI stick-diagram editor: infinite 2D canvas, same-layer auto-bridging crossovers, LaTeX subscript labels, .stk project files.",
    img: "/projects/stickout.webp",
    links: [
      { label: "STICKOUT.VERCEL.APP", href: "https://stickout.vercel.app" },
      { label: "GITHUB", href: "https://github.com/Aera0908/stickOut" },
    ],
  },
  {
    index: "S-06",
    slug: "emg-controller",
    name: "EMG CONTROLLER",
    category: "EMBEDDED / HARDWARE",
    kinds: ["HW"],
    blurb:
      "Real-time electromyography on the ESP32-S3: 500 Hz DSP pipeline, adaptive calibration, Python visualization GUI, muscle-driven game control.",
    img: "/projects/emg.webp",
    links: [{ label: "GITHUB", href: "https://github.com/Aera0908/emg-game-controller" }],
  },
  {
    index: "S-07",
    slug: "safehouse",
    name: "THE SAFEHOUSE",
    category: "3D WEB / SHOWCASE",
    kinds: ["WEB"],
    blurb:
      "Narrative 3D scroll-journey pitch site: procedural R3F forest and campfire world with GSAP + Lenis choreography and reduced-motion fallbacks.",
    img: "/projects/safehouse.webp",
    links: [
      { label: "LIVE SITE", href: "https://safehouse-inky.vercel.app/" },
      { label: "GITHUB", href: "https://github.com/Aera0908/safe-house" },
    ],
  },
  {
    index: "S-08",
    slug: "plantio",
    name: "PLANT.IO",
    category: "MOBILE / IOT - FREELANCE",
    kinds: ["HW", "CLIENT"],
    blurb:
      "8-bit retro IoT nursery dashboard: live soil and climate telemetry from ESP32 beds, remote actuators, and an animated plant-mood avatar.",
    img: "/projects/plantio.webp",
    nda: true,
  },
  {
    index: "S-09",
    slug: "manhwa-reader",
    name: "MANHWA READER",
    category: "WEB / FRONTEND",
    kinds: ["WEB"],
    blurb:
      "MangaDex-powered reading SPA: discovery feeds, title search, detail pages, and a full chapter reader with persistent themes.",
    img: "/projects/manhwa.webp",
  },
  {
    index: "S-10",
    slug: "student-consultation",
    name: "STUDENT CONSULTATION SYSTEM",
    category: "WEB / FULL-STACK - FREELANCE",
    kinds: ["WEB", "CLIENT"],
    blurb:
      "Student–professor consultation platform: role-based dashboards, realtime messaging, scheduling calendar, JWT auth, Sharp image pipeline.",
    nda: true,
  },
  {
    index: "S-11",
    slug: "walang-basagan",
    name: "WALANG BASAGAN NG THRIFT",
    category: "WEB / E-COMMERCE - FREELANCE",
    kinds: ["WEB", "CLIENT"],
    blurb:
      "Y2K-themed thrift storefront: full shopping flow, three-tier role model, admin back office, and a threaded customer-support inbox.",
    nda: true,
  },
  {
    index: "S-12",
    slug: "familiar",
    name: "FAMILIAR",
    badge: "IN DEVELOPMENT",
    category: "MOBILE / AI / CV",
    kinds: ["SW"],
    blurb:
      "Gamified study companion: on-device ML Kit distraction detection, a Flame-rendered creature that grows as you focus, ember-seed hatches, wax-seal achievements. Offline-first Isar + Firebase.",
    img: "/projects/familiar-classified.svg",
  },
];

const ARTS_VIDEOS: { index: string; name: string; youtubeId: string; tools?: string; blurb: string }[] = [
  {
    index: "A-01",
    name: "DOWN? VIDEO EXPLAINER",
    youtubeId: "k4_VRURl6m4",
    tools: "REMOTION // CLAUDE // EPIDEMIC SOUND",
    blurb:
      "\"Barkada can't decide where to eat? Swipe together on Down?\" Explainer for the group hangout decider: one shared room, everyone swipes on nearby spots, and the group lands on a unanimous pick.",
  },
  {
    index: "A-02",
    name: "FEHUVIA WORKSTATION SHOWCASE",
    youtubeId: "aDBoZOoOhd8",
    tools: "FIGMA // ILLUSTRATOR // AFTER EFFECTS // PREMIERE PRO",
    blurb:
      "High-fidelity workstation highlights video: interface functionalities, dual-state data flows, and AI OCR capabilities. Custom visual assets in Figma and Adobe Illustrator, motion graphics in After Effects, edited in Premiere Pro.",
  },
  {
    index: "A-03",
    name: "AEROVIT ECOSYSTEM WALKTHROUGH",
    youtubeId: "rqx192_81zA",
    tools: "ILLUSTRATOR // AFTER EFFECTS // PREMIERE PRO",
    blurb:
      "Curated walkthrough of the hybrid fitness ecosystem: ESP32-S3 smartwatch pairing, MediaPipe BlazePose form tracking, Flame 2D dungeon RPG, and AERO Web3 withdrawals. Vector assets in Illustrator, keyframed animations in After Effects, final edit in Premiere Pro.",
  },
];

const FILTERS: { id: "ALL" | Kind; label: string }[] = [
  { id: "ALL", label: "ALL" },
  { id: "HW", label: "HARDWARE" },
  { id: "SW", label: "SOFTWARE" },
  { id: "WEB", label: "WEB" },
  { id: "CLIENT", label: "CLIENT" },
];

/** short status chip from the case study's full status line */
function shortStatus(status: string) {
  const s = status.toUpperCase();
  // DELIVERED first: it contains the letters L-I-V-E
  if (s.includes("DELIVERED")) return "DELIVERED";
  if (/LIVE/.test(s)) return "LIVE";
  if (s.includes("RELEASED")) return "RELEASED";
  if (s.includes("DEVELOPMENT") || s.includes("PROGRESS")) return "IN DEV";
  return "COMPLETE";
}

/** the latest year a project ran in, for the index column */
function yearOf(duration: string) {
  if (/PRESENT/i.test(duration)) return "NOW";
  const years = duration.match(/\d{4}/g);
  return years ? years[years.length - 1] : "ACAD";
}

const SHUTTER_STRIPS = 6;

export default function ProjectArchivePage() {
  const { fx } = useHudAudio();
  const router = useRouter();

  const [filter, setFilter] = useState<"ALL" | Kind>("ALL");
  const [activeSlug, setActiveSlug] = useState(SYSTEMS[0].slug);
  /** small screens: which row is expanded in place */
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [wide, setWide] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const hoverTweens = useRef(new Map<string, gsap.core.Tween>());

  const rows = useMemo(
    () => SYSTEMS.filter((p) => filter === "ALL" || p.kinds.includes(filter)),
    [filter],
  );
  const active = SYSTEMS.find((p) => p.slug === activeSlug) ?? SYSTEMS[0];
  const activeCase = getCaseStudy(active.slug);

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

  // the preview pane only exists on wide screens; below that rows expand
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Escape leaves the archive — but only when nothing is layered on top of it.
  // The resume preview and the gallery lightbox both bind Escape too, so
  // without this guard one keypress closed the modal AND navigated away.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      fx.click();
      router.push("/vault");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, fx]);

  /* rows rack in whenever the filter changes (and on first paint) */
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      list.querySelectorAll(".arc-row"),
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, duration: 0.32, ease: MOTION.servo, stagger: 0.035, clearProps: "transform,opacity" },
    );
    return () => {
      tween.kill();
    };
  }, [filter]);

  /* preview swap: shutter wipe, title decode, duotone resolving to colour */
  useEffect(() => {
    const pane = previewRef.current;
    if (!pane || !wide) return;
    const title = pane.querySelector<HTMLElement>(".arc-prev-title");
    if (prefersReducedMotion()) {
      gsap.set(pane.querySelectorAll(".arc-shutter"), { scaleX: 0 });
      gsap.set(pane.querySelector(".arc-duo"), { opacity: 0 });
      gsap.set(pane.querySelector(".arc-prev-img"), { filter: "grayscale(0) contrast(1)" });
      return;
    }
    const tl = gsap.timeline();
    tl.set(pane.querySelectorAll(".arc-shutter"), { scaleX: 1 });
    tl.set(pane.querySelector(".arc-duo"), { opacity: 1 });
    tl.set(pane.querySelector(".arc-prev-img"), { filter: "grayscale(1) contrast(1.25)" });
    tl.to(pane.querySelectorAll(".arc-shutter"), { scaleX: 0, duration: 0.34, ease: MOTION.snap, stagger: 0.035 }, 0.02);
    if (title) tl.add(decodeTween(title, { duration: 0.45, text: active.name }), 0.05);
    tl.fromTo(
      pane.querySelectorAll(".arc-prev-meta"),
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.3, ease: MOTION.servo, stagger: 0.04 },
      0.12,
    );
    tl.to(pane.querySelector(".arc-duo"), { opacity: 0, duration: 0.45, ease: "steps(5)" }, 0.55);
    tl.to(pane.querySelector(".arc-prev-img"), { filter: "grayscale(0) contrast(1)", duration: 0.45, ease: "steps(5)" }, 0.55);
    return () => {
      tl.kill();
      if (title) title.textContent = active.name;
    };
  }, [active.slug, active.name, wide]);

  const select = (slug: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
  };

  /** row name decodes on hover, once per entry */
  const decodeRow = (el: HTMLElement | null, slug: string, name: string) => {
    if (!el) return;
    hoverTweens.current.get(slug)?.kill();
    hoverTweens.current.set(slug, decodeTween(el, { duration: 0.35, text: name }));
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: SYSTEMS.length };
    for (const f of FILTERS) if (f.id !== "ALL") c[f.id] = SYSTEMS.filter((p) => p.kinds.includes(f.id as Kind)).length;
    return c;
  }, []);

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
      <div className="flex-1 px-6 py-8 md:px-16 z-10">
        {/* query bar: filter switches + result count */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="t-label mb-3 text-iris-bright">● SYSTEMS // HARDWARE &amp; SOFTWARE</p>
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      if (on) return;
                      fx.click();
                      setFilter(f.id);
                      setOpenSlug(null);
                      const first = SYSTEMS.find((p) => f.id === "ALL" || p.kinds.includes(f.id as Kind));
                      if (first) setActiveSlug(first.slug);
                    }}
                    onMouseEnter={fx.blip}
                    className={`flex cursor-pointer items-center gap-2 border px-3 py-2 font-mono text-[10px] font-bold tracking-[0.18em] transition-colors active:translate-y-[1px] ${
                      on
                        ? "border-iris-bright bg-iris-bright text-ink"
                        : "border-periwinkle/25 text-periwinkle/80 hover:border-periwinkle/60 hover:text-paper"
                    }`}
                  >
                    {/* switch lamp: filled when engaged */}
                    <span
                      className={`block h-2 w-2 border ${on ? "border-ink bg-ink" : "border-periwinkle/50"}`}
                      aria-hidden="true"
                    />
                    {f.label}
                    <span className={on ? "text-ink/60" : "text-periwinkle/40"}>{counts[f.id]}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <span className="t-micro text-periwinkle/50">
            SHOWING {rows.length} / {SYSTEMS.length}
          </span>
        </div>

        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          {/* index */}
          <div className="lg:col-span-7">
            <div className="hidden grid-cols-[4rem_1fr_9rem_6rem_3rem] gap-3 border-b border-periwinkle/15 pb-2 t-micro text-periwinkle/40 md:grid">
              <span>ID</span>
              <span>NAME</span>
              <span>DOMAIN</span>
              <span>STATUS</span>
              <span className="text-right">YEAR</span>
            </div>
            <div ref={listRef}>
              {rows.map((p) => {
                const cs = getCaseStudy(p.slug);
                const status = cs ? shortStatus(cs.status) : "COMPLETE";
                const year = cs ? yearOf(cs.duration) : "";
                const isActive = wide && p.slug === activeSlug;
                const isOpen = !wide && p.slug === openSlug;
                return (
                  <div key={p.slug} className="arc-row border-b border-periwinkle/10">
                    <button
                      type="button"
                      onClick={() => {
                        if (wide) openCase(p.slug);
                        else {
                          fx.click();
                          setOpenSlug(isOpen ? null : p.slug);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!wide) return;
                        fx.blip();
                        select(p.slug);
                        decodeRow(e.currentTarget.querySelector<HTMLElement>(".arc-name"), p.slug, p.name);
                      }}
                      onFocus={() => wide && select(p.slug)}
                      aria-expanded={wide ? undefined : isOpen}
                      aria-label={wide ? `Open ${p.name} case file` : `${p.name}, ${status}. Show details`}
                      className={`group/row grid w-full cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-3.5 text-left transition-colors md:grid-cols-[4rem_1fr_9rem_6rem_3rem] ${
                        isActive || isOpen ? "bg-world-2" : "hover:bg-world-2/60"
                      }`}
                    >
                      <span className={`pl-2 font-mono text-[11px] tracking-widest ${isActive || isOpen ? "text-iris-bright" : "text-periwinkle/50"}`}>
                        {isActive || isOpen ? "▸" : " "}
                        {p.index}
                      </span>
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={`arc-name truncate font-display text-sm font-black uppercase tracking-tight md:text-base ${
                            isActive || isOpen ? "text-iris-bright" : "text-paper"
                          }`}
                        >
                          {p.name}
                        </span>
                        {p.badge && (
                          <span className="hidden shrink-0 -rotate-2 border border-iris/60 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-widest text-iris sm:inline">
                            {p.badge}
                          </span>
                        )}
                      </span>
                      <span className="hidden truncate t-micro text-periwinkle/55 md:block">{p.category}</span>
                      <span
                        className={`font-mono text-[9px] font-bold tracking-widest ${
                          status === "LIVE" || status === "RELEASED" ? "text-iris-bright" : status === "IN DEV" ? "text-paper" : "text-periwinkle/55"
                        }`}
                      >
                        {status}
                      </span>
                      <span className="hidden pr-2 text-right font-mono text-[10px] text-periwinkle/50 md:block">{year}</span>
                    </button>

                    {/* small screens: details expand in place */}
                    {isOpen && (
                      <div className="pb-5 pl-2">
                        <PreviewMedia item={p} />
                        <p className="t-micro mt-3 text-periwinkle/55">{p.category}</p>
                        <p className="mt-2 text-xs leading-relaxed text-periwinkle/75">{p.blurb}</p>
                        <PreviewActions item={p} onOpen={() => openCase(p.slug)} onBlip={fx.blip} onClick={fx.click} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* sticky preview pane (wide screens) */}
          {wide && (
            <aside ref={previewRef} className="lg:col-span-5" aria-live="polite">
              <div className="sticky top-6 border border-periwinkle/15 bg-world-2/60">
                <div className="flex items-center justify-between border-b border-periwinkle/15 px-4 py-2 t-micro text-periwinkle/50">
                  <span>PREVIEW // {active.index}</span>
                  <span>{activeCase?.duration}</span>
                </div>
                <div className="relative">
                  <PreviewMedia item={active} duotone />
                  {/* shutter: strips wipe away on every swap */}
                  {Array.from({ length: SHUTTER_STRIPS }, (_, i) => (
                    <span
                      key={i}
                      className="arc-shutter pointer-events-none absolute inset-x-0 bg-world"
                      style={{
                        top: `${(i * 100) / SHUTTER_STRIPS}%`,
                        height: `${100 / SHUTTER_STRIPS + 0.5}%`,
                        transformOrigin: i % 2 ? "100% 50%" : "0% 50%",
                        transform: "scaleX(0)",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="p-5">
                  <div className="arc-prev-meta mb-1 flex items-baseline justify-between gap-3">
                    <span className="index-marker">● {active.index}</span>
                    <span className="t-micro text-periwinkle/50">{activeCase?.role}</span>
                  </div>
                  <h2 className="mb-2 flex items-center gap-3 font-display text-2xl font-black uppercase tracking-tight text-paper">
                    <span className="sr-only">{active.name}</span>
                    <span className="arc-prev-title" aria-hidden="true">
                      {active.name}
                    </span>
                    {active.badge && (
                      <span className="-rotate-3 border-2 border-iris-bright px-2 py-0.5 font-mono text-[9px] font-black tracking-widest text-iris-bright">
                        {active.badge}
                      </span>
                    )}
                  </h2>
                  <p className="arc-prev-meta t-micro mb-3 text-iris-bright/80">{active.category}</p>
                  <p className="arc-prev-meta mb-5 text-sm leading-relaxed text-periwinkle/80">{active.blurb}</p>
                  <div className="arc-prev-meta">
                    <PreviewActions
                      item={active}
                      onOpen={() => openCase(active.slug)}
                      onBlip={fx.blip}
                      onClick={fx.click}
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        <p className="t-label mb-6 text-iris-bright">
          ● ARTS // VIDEO / PUBMATS / VISUAL
        </p>
        <div className="grid gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTS_VIDEOS.map((a) => (
            <div
              key={a.index}
              className="group card-notch overflow-hidden border border-periwinkle/15 bg-world-2 transition-all duration-300 hover:border-iris-bright/50"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${a.youtubeId}`}
                  title={a.name}
                  loading="lazy"
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
                {a.tools && <p className="t-micro mb-3 text-iris-bright/70">{a.tools}</p>}
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

/** project image, or a classified plate for NDA work with no public visual */
function PreviewMedia({ item, duotone = false }: { item: ArchiveItem; duotone?: boolean }) {
  if (!item.img) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden border-b border-periwinkle/10 bg-world">
        <span className="font-display text-5xl font-black tracking-tight text-periwinkle/15">
          {item.index}
        </span>
        <span className="t-micro text-periwinkle/50">CLIENT WORK // NO PUBLIC VISUAL</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden border-b border-periwinkle/10 bg-world">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.img}
        alt={`${item.name} cover`}
        loading="lazy"
        className="arc-prev-img absolute inset-0 h-full w-full object-cover"
      />
      {/* duotone wash: multiplies the greyscale frame into ink + yellow */}
      {duotone && (
        <span className="arc-duo pointer-events-none absolute inset-0 bg-iris mix-blend-multiply" style={{ opacity: 0 }} aria-hidden="true" />
      )}
    </div>
  );
}

function PreviewActions({
  item,
  onOpen,
  onBlip,
  onClick,
}: {
  item: ArchiveItem;
  onOpen: () => void;
  onBlip: () => void;
  onClick: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={onBlip}
        className="cursor-pointer bg-iris-bright px-4 py-2 font-mono text-[10px] font-black tracking-[0.18em] text-ink transition-transform active:translate-y-[2px]"
      >
        OPEN CASE FILE →
      </button>
      {item.nda && <span className="t-micro text-periwinkle/50 select-none">◆ CLIENT WORK</span>}
      {item.links?.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          onMouseEnter={onBlip}
          className="t-micro text-periwinkle/60 uppercase hover:text-paper hover:underline"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
