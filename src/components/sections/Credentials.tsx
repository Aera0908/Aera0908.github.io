"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, MOTION, prefersReducedMotion } from "@/lib/gsap";
import { CyberLines } from "@/components/ui/CyberLines";
import { DecodeText } from "@/components/ui/DecodeText";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

// Standalone cast type — do NOT `extends Window` (the lenis package globally
// augments Window.lenis with a different shape, which conflicts at build time).
type LenisWindow = {
  lenis?: {
    stop: () => void;
    start: () => void;
  };
  aera_credentials_loaded?: boolean;
};

interface Certificate {
  name: string;
  issuer: string;
  detail: string;
  url: string;
  downloadName: string;
  featured: boolean;
}

const CERTIFICATES: Certificate[] = [
  {
    name: "AI FLUENCY: FRAMEWORK & FOUNDATIONS",
    issuer: "ANTHROPIC",
    detail: "Framing and evaluating foundations for building AI agents and workflows.",
    url: "/CERTIFICATE-PREVIEWS/AI%20-%20Fluency%20Framework%20&%20Foundations%20by%20Anthropic.pdf",
    downloadName: "YNTE-Anthropic-AI-Fluency.pdf",
    featured: true,
  },
  {
    name: "INTRODUCTION TO MODEL CONTEXT PROTOCOL",
    issuer: "ANTHROPIC",
    detail: "MCP foundations, building custom MCP servers, and data integration.",
    url: "/CERTIFICATE-PREVIEWS/Introduction%20to%20Model%20Context%20Protocol%20by%20Anthropic.pdf",
    downloadName: "YNTE-Anthropic-Intro-to-MCP.pdf",
    featured: true,
  },
  {
    name: "MODEL CONTEXT PROTOCOL: ADVANCED TOPICS",
    issuer: "ANTHROPIC",
    detail: "Advanced transports, security schemas, and enterprise MCP deployment.",
    url: "/CERTIFICATE-PREVIEWS/Model%20Context%20Protocol%20Advanced%20Topics%20by%20Anthropic.pdf",
    downloadName: "YNTE-Anthropic-MCP-Advanced-Topics.pdf",
    featured: true,
  },
  {
    name: "THE AI ENGINEER PATH",
    issuer: "SCRIMBA",
    detail: "AI integration, model engineering, and agent systems development.",
    url: "/CERTIFICATE-PREVIEWS/The%20AI%20Engineer%20Path.pdf",
    downloadName: "YNTE-Scrimba-AI-Engineer-Path.pdf",
    featured: true,
  },
  {
    name: "ON-THE-JOB TRAINING",
    issuer: "XINYX DESIGN ENGINEERING, INC.",
    detail: "Digital logic design and peripheral verification: SystemVerilog RTL on AMBA APB3.",
    url: "/CERTIFICATE-PREVIEWS/YNTE-XINYX-OJT-CERTIFICATE.pdf",
    downloadName: "YNTE-XINYX-OJT-CERTIFICATE.pdf",
    featured: true,
  },
  {
    name: "DIGITAL & ANALOG IC LAYOUT",
    issuer: "XINYX LABS",
    detail: "Block-level, digital full-custom, and analog layout using industry-standard EDA tools (396 tool hours).",
    url: "/CERTIFICATE-PREVIEWS/YNTE-XINYX%20IC%20LAYOUT%20CERTIFICATE.pdf",
    downloadName: "YNTE-XINYX-IC-LAYOUT-CERTIFICATE.pdf",
    featured: true,
  },
  {
    name: "BLOCKCHAIN4YOUTH",
    issuer: "BITGET",
    detail: "Certification in blockchain technology, smart contract development, and Web3 fundamentals.",
    url: "/CERTIFICATE-PREVIEWS/B4Y-Certificate-Aira-Josh-C.-Ynte.jpg",
    downloadName: "B4Y-Certificate-Aira-Josh-C.-Ynte.jpg",
    featured: false,
  },
  {
    name: "LEARN REACT",
    issuer: "SCRIMBA",
    detail: "Comprehensive React.js course completion and frontend routing.",
    url: "/CERTIFICATE-PREVIEWS/Learn%20React%20Certificate.pdf",
    downloadName: "YNTE-Scrimba-Learn-React.pdf",
    featured: false,
  },
  {
    name: "LEARN TAILWIND CSS",
    issuer: "SCRIMBA",
    detail: "Modern utility-first CSS framework mastery and responsive layout design.",
    url: "/CERTIFICATE-PREVIEWS/Learn%20Tailwind%20CSS.pdf",
    downloadName: "YNTE-Scrimba-Learn-Tailwind-CSS.pdf",
    featured: false,
  },
  {
    name: "BASIC WEB DEVELOPMENT WORKSHOP",
    issuer: "ZUITT",
    detail: "Basic Web Development Workshop.",
    url: "/CERTIFICATE-PREVIEWS/Aira%20Josh%20C.%20Ynte%20Basic%20Web%20Development%20Workshop%20(June%2015)%20-%20Certificate%20of%20Participation%20(1).pdf",
    downloadName: "YNTE-Zuitt-Basic-Web-Dev-Workshop.pdf",
    featured: false,
  },
  {
    name: "TINA DESIGN SUITE WORKSHOP",
    issuer: "HYTEC POWER",
    detail: "Workshop on the TINA circuit simulation and PCB design suite.",
    url: "/CERTIFICATE-PREVIEWS/YNTE-DESIGNSOFT-TINA.pdf",
    downloadName: "YNTE-DESIGNSOFT-TINA.pdf",
    featured: false,
  },
  {
    name: "UNDERSTANDING EDR",
    issuer: "CYBERSECURITY TRAINING",
    detail: "Endpoint Detection & Response (EDR) fundamentals and threat intelligence.",
    url: "/CERTIFICATE-PREVIEWS/YNTE%20-%20Understanding%20EDR%20Protecting%20Endpoints%20Against%20Modern%20Threats.pdf",
    downloadName: "YNTE-Understanding-EDR.pdf",
    featured: false,
  },
];

const HARD_SKILLS = [
  "Software Development & Clean Architecture",
  "System Design & Modular API Planning",
  "Hardware-Software Systems Integration",
  "Digital Logic Design & RTL Verification",
  "Embedded Firmware & Peripherals Development",
  "Decentralized Protocol & Smart Contract Design",
];

const SOFT_SKILLS = [
  "Cross-Functional Team Collaboration",
  "Technical Documentation & Spec Writing",
  "Client Communication & Iterative Feedback",
  "Rapid Self-Directed Technical Learning",
];

const STACK: { label: string; items: string[] }[] = [
  { label: "LANGUAGES", items: ["TypeScript", "JavaScript", "Python", "C/C++", "Solidity", "SystemVerilog", "SQL"] },
  { label: "FRAMEWORKS", items: ["React", "Next.js", "Express", "Tailwind CSS", "Flutter", "Hardhat"] },
  { label: "INFRA / TOOLS", items: ["PostgreSQL", "MongoDB", "Firebase", "Git", "Docker", "KiCad", "Figma"] },
];

type Tab = "certs" | "caps";
const TABS: { id: Tab; cmd: string; label: string }[] = [
  { id: "certs", cmd: "get --certifications", label: "CERTIFICATIONS" },
  { id: "caps", cmd: "query --capabilities", label: "CAPABILITIES" },
];

export function Credentials() {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { fx } = useHudAudio();
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [tab, setTab] = useState<Tab>("certs");
  const [showMore, setShowMore] = useState(false);

  // Terminal state machine: hidden -> loading -> ready
  const [terminalState, setTerminalState] = useState<"hidden" | "loading" | "ready">("hidden");

  // Freeze background page scroll when modal is active
  useEffect(() => {
    if (!previewCert) return;
    lockScroll();
    return () => unlockScroll();
  }, [previewCert]);

  // BIOS loader delay
  useEffect(() => {
    if (terminalState !== "loading") return;
    const t = setTimeout(() => setTerminalState("ready"), 900);
    return () => clearTimeout(t);
  }, [terminalState]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cred-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          onEnter: () => {
            if (!(window as unknown as LenisWindow).aera_credentials_loaded) {
              setTerminalState("loading");
              (window as unknown as LenisWindow).aera_credentials_loaded = true;
            } else {
              setTerminalState("ready");
            }
          },
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* the visible panel's entries rack in on ready and on every tab switch */
  useEffect(() => {
    const body = bodyRef.current;
    if (terminalState !== "ready" || !body || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      body.querySelectorAll(".cred-item"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: MOTION.servo, stagger: 0.04, clearProps: "transform,opacity" },
    );
    return () => {
      tween.kill();
    };
  }, [terminalState, tab]);

  /* expanding the extra certs racks in only the newly shown rows — the
     featured ones above are already on screen and must stay put */
  useEffect(() => {
    const body = bodyRef.current;
    if (!showMore || !body || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      body.querySelectorAll("#cred-more .cred-item"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: MOTION.servo, stagger: 0.04, clearProps: "transform,opacity" },
    );
    return () => {
      tween.kill();
    };
  }, [showMore]);

  // Escape key closes modal
  useEffect(() => {
    if (!previewCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fx.click();
        setPreviewCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewCert, fx]);

  const featured = CERTIFICATES.filter((c) => c.featured);
  const additional = CERTIFICATES.filter((c) => !c.featured);
  const openCert = (c: Certificate) => {
    fx.click();
    setPreviewCert(c);
  };

  // Top-anchored, not justify-center: expanding the extra certs grows the
  // terminal, and centring made the whole block (title included) shift up.
  // The md padding reproduces the old centred position of the collapsed
  // layout (content ≈ 527px tall inside an 80px/16px padded box).
  return (
    <section
      id="credentials"
      ref={rootRef}
      className="relative z-10 overflow-hidden border-t border-periwinkle/10 bg-world min-h-screen md:h-screen w-full max-w-full flex flex-col justify-start px-4 sm:px-6 pt-20 md:pt-[max(5rem,calc(50vh-231px))] pb-8 md:pb-4 md:px-16"
    >
      <CyberLines flip />

      <h2 className="cred-reveal t-h2 mb-2 text-paper">
        <DecodeText text="CREDENTIALS" start="top 65%" />
        <span className="text-iris-bright">.</span>
      </h2>
      <p className="cred-reveal t-label mb-4 text-periwinkle/60">
        ● 003 // CERTIFICATIONS & CAPABILITY MATRIX
      </p>

      {/* Terminal */}
      <div className="cred-reveal w-full border border-periwinkle/15 bg-world-2/80 rounded-lg overflow-hidden flex flex-col font-mono min-h-[420px] lg:max-h-[calc(100vh-13rem)] relative">
        {/* header: the tabs are the terminal's commands */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-periwinkle/15 bg-world px-4 py-2.5">
          <span className="flex items-center gap-2 text-xs text-iris-bright select-none">
            <span className="h-2.5 w-2.5 rounded-full bg-signal" />
            AERA_SYS // CREDENTIALS
          </span>
          <div role="tablist" aria-label="Credentials view" className="flex gap-2">
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`cred-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls="cred-panel"
                  onClick={() => {
                    if (on) return;
                    fx.click();
                    setTab(t.id);
                  }}
                  onMouseEnter={fx.blip}
                  className={`flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] transition-colors active:translate-y-[1px] ${
                    on
                      ? "border-iris-bright bg-iris-bright text-ink"
                      : "border-periwinkle/25 text-periwinkle/75 hover:border-periwinkle/60 hover:text-paper"
                  }`}
                >
                  <span className={`block h-2 w-2 border ${on ? "border-ink bg-ink" : "border-periwinkle/50"}`} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {terminalState === "loading" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-xs text-iris-bright select-none min-h-[340px]">
            <span>LOADING CREDENTIALS...</span>
            <div className="h-2 w-64 overflow-hidden rounded border border-iris/30 bg-world-2 p-0.5">
              <div className="h-full bg-signal animate-[loader-fill_0.9s_ease-in-out_forwards]" />
            </div>
          </div>
        ) : (
          <div
            ref={bodyRef}
            id="cred-panel"
            role="tabpanel"
            aria-labelledby={`cred-tab-${tab}`}
            className={`min-h-0 flex-1 overflow-y-auto p-5 md:p-6 transition-opacity duration-300 ${terminalState === "hidden" ? "opacity-0" : "opacity-100"}`}
          >
            <p className="mb-4 text-[10px] font-bold text-iris-bright select-none">
              $ {TABS.find((t) => t.id === tab)?.cmd}
            </p>

            {tab === "certs" ? (
              <>
                {/* featured: issuer + name only; the detail lives in the preview */}
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => openCert(c)}
                      onMouseEnter={fx.blip}
                      aria-label={`Preview ${c.name} certificate from ${c.issuer}`}
                      className="cred-item group/cert flex cursor-pointer items-start justify-between gap-3 border-t border-periwinkle/15 py-3.5 text-left transition-colors hover:border-iris-bright"
                    >
                      <span className="min-w-0">
                        <span className="mb-1 block text-[9px] font-bold tracking-[0.16em] text-iris-bright/80">{c.issuer}</span>
                        <span className="block font-display text-sm font-black uppercase leading-tight tracking-tight text-paper transition-colors group-hover/cert:text-iris-bright">
                          {c.name}
                        </span>
                      </span>
                      <span className="mt-4 shrink-0 text-xs text-periwinkle/40 transition-transform group-hover/cert:translate-x-1 group-hover/cert:text-iris-bright" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>

                {/* the rest stay folded until asked for */}
                <button
                  type="button"
                  onClick={() => {
                    fx.click();
                    setShowMore((v) => !v);
                  }}
                  onMouseEnter={fx.blip}
                  aria-expanded={showMore}
                  aria-controls="cred-more"
                  className="mt-4 cursor-pointer border border-periwinkle/25 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-periwinkle/80 transition-colors hover:border-iris-bright hover:text-iris-bright"
                >
                  {showMore ? "− HIDE ADDITIONAL" : `+ ${additional.length} MORE CERTIFICATIONS`}
                </button>
                {showMore && (
                  <ul id="cred-more" className="mt-3 grid gap-x-6 sm:grid-cols-2">
                    {additional.map((c) => (
                      <li key={c.name} className="cred-item">
                        <button
                          type="button"
                          onClick={() => openCert(c)}
                          onMouseEnter={fx.blip}
                          aria-label={`Preview ${c.name} certificate from ${c.issuer}`}
                          className="flex w-full cursor-pointer items-baseline justify-between gap-3 border-b border-periwinkle/10 py-2 text-left text-[11px] transition-colors hover:text-iris-bright"
                        >
                          <span className="truncate text-periwinkle/85">{c.name}</span>
                          <span className="shrink-0 text-[9px] tracking-widest text-periwinkle/45">{c.issuer}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-iris-bright/80">CORE</p>
                    <ul className="space-y-2">
                      {HARD_SKILLS.map((s) => (
                        <li key={s} className="cred-item text-[12px] leading-snug text-paper/90">{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-iris-bright/80">WAYS OF WORKING</p>
                    <ul className="space-y-2">
                      {SOFT_SKILLS.map((s) => (
                        <li key={s} className="cred-item text-[12px] leading-snug text-periwinkle/70">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  {STACK.map((g) => (
                    <div key={g.label} className="cred-item">
                      <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-iris-bright/80">{g.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.items.map((i) => (
                          <span key={i} className="border border-periwinkle/20 px-2 py-1 text-[10px] text-periwinkle/85">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Certificate Decryption View Modal.
          Portaled to <body>: this section is `relative z-10`, which opens a
          stacking context, so a `fixed z-50` child was capped at z-10 in root
          order and painted UNDER the fixed Navbar (z-70) and the sticky
          download bar (z-60) — both stayed clickable over the "modal". */}
      {previewCert &&
        createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewCert.name} preview`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#050507]/90"
            onClick={() => {
              fx.click();
              setPreviewCert(null);
            }}
          />
          {/* Refined Dark Theme Modal Container */}
          <div className="relative w-full max-w-4xl h-[85vh] border border-periwinkle/20 bg-world/95 rounded-lg flex flex-col overflow-hidden font-mono shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 animate-zoom-in">
            
            {/* Tactical Crosshair / Corner Details */}

            {/* Modal Header */}
            <div className="bg-world-2/40 text-paper px-6 py-4 flex items-center justify-between text-xs font-bold border-b border-periwinkle/15 select-none z-10">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-display text-sm font-black uppercase tracking-tight text-paper">{previewCert.name}</span>
                <span className="truncate text-[10px] font-normal tracking-wider text-periwinkle/60">
                  <span className="text-iris-bright">{previewCert.issuer}</span>{" // "}{previewCert.detail}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewCert.url}
                  download={previewCert.downloadName}
                  className="rounded-sm bg-iris-bright text-[#0c0d12] font-mono font-bold px-3.5 py-1.5 text-[9px] tracking-widest uppercase transition-all duration-200 hover:bg-white hover:scale-105 cursor-pointer"
                  onMouseEnter={fx.blip}
                  onClick={fx.click}
                >
                  DOWNLOAD PDF
                </a>
                <button
                  onClick={() => {
                    fx.click();
                    setPreviewCert(null);
                  }}
                  className="rounded-sm border border-periwinkle/30 bg-world-2/80 px-3 py-1.5 font-mono text-[9px] tracking-widest uppercase text-periwinkle transition-all duration-200 hover:border-white hover:text-white hover:bg-world-2 cursor-pointer"
                  aria-label="Close preview"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 bg-world flex items-center justify-center overflow-hidden p-6 relative">
              {previewCert.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewCert.url}
                  alt={`${previewCert.name} preview`}
                  className="max-w-full max-h-full object-contain border border-periwinkle/15 shadow-2xl rounded"
                />
              ) : (
                <iframe
                  src={`${previewCert.url}#toolbar=0&navpanes=0&view=FitH`}
                  title={`${previewCert.name} preview`}
                  className="w-full h-full border border-periwinkle/15 bg-world rounded shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
