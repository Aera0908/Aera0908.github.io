"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { CyberLines } from "@/components/ui/CyberLines";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

interface LenisWindow extends Window {
  lenis?: {
    stop: () => void;
    start: () => void;
  };
  aera_credentials_loaded?: boolean;
}

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
    detail: "Digital logic design and peripheral verification — SystemVerilog RTL on AMBA APB3.",
    url: "/CERTIFICATE-PREVIEWS/YNTE-XINYX-OJT-CERTIFICATE.pdf",
    downloadName: "YNTE-XINYX-OJT-CERTIFICATE.pdf",
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
  "SystemVerilog RTL & Digital Logic (AMBA)",
  "Embedded MCU Firmware & Peripherals (RTOS)",
  "PCB Layout & Hardware-in-the-Loop Prototyping",
  "Full-Stack Web Architectures (React, Next.js)",
  "Smart Contracts & Web3 (Solidity, Morph L2)",
];

const SOFT_SKILLS = [
  "Hardware-Software Integration Mindset",
  "Cross-Functional Team Collaboration",
  "Rapid Self-Directed Technical Upskilling",
];

// Sequential typing component for hacker prompts.
// onComplete lives in a ref and a done-guard blocks re-runs: the parent
// re-renders on every cmdXDone flip, and a fresh onComplete identity used
// to restart the interval — the "types, then retypes" bug.
function TypingText({
  text,
  active,
  onComplete,
}: {
  text: string;
  active: boolean;
  onComplete: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active || isDone) return;
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        idx++;
        setDisplayed(text.slice(0, idx));
      } else {
        clearInterval(timer);
        setIsDone(true);
        onCompleteRef.current();
      }
    }, 18);
    return () => clearInterval(timer);
  }, [text, active, isDone]);

  return (
    <span>
      {displayed}
      {active && !isDone && (
        <span className="animate-pulse text-iris-bright">▊</span>
      )}
    </span>
  );
}

/** rAF count-up for the stats widget — runs once when activated */
function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  const ranRef = useRef(false);
  useEffect(() => {
    if (!active || ranRef.current) return;
    ranRef.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      // ease-out so the last keys land slower, like a settling meter
      setValue(Math.round(target * (1 - Math.pow(1 - p, 2))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

const MEM_BLOCKS = 12;
const MEM_TARGET = 81;

/** animated system-specs rows: status flicker, key count-up, mem-alloc fill */
function SystemSpecs({ active, totalKeys }: { active: boolean; totalKeys: number }) {
  const keys = useCountUp(totalKeys, active, 800);
  const mem = useCountUp(MEM_TARGET, active, 1100);
  const filled = Math.round((mem / 100) * MEM_BLOCKS);

  return (
    <div className="border border-periwinkle/10 bg-world/30 p-3 rounded text-[9px] text-periwinkle/50 space-y-1 select-none">
      <div className="flex justify-between">
        <span>DATABASE STATUS:</span>
        {active ? (
          <span className="text-iris-bright">RECONCILED // READY</span>
        ) : (
          <span className="animate-pulse text-periwinkle/40">SYNCING ▊</span>
        )}
      </div>
      <div className="flex justify-between">
        <span>TOTAL LOGS INGESTED:</span>
        <span>{keys} KEYS</span>
      </div>
      <div className="flex justify-between">
        <span>CIPHER ALGORITHM:</span>
        <span className={active ? "" : "opacity-40"}>ECDSA-SHA256</span>
      </div>
      <div className="pt-1.5 border-t border-periwinkle/5">
        <div className="flex items-center justify-between mb-0.5">
          <span>
            MEM_ALLOC: [{"█".repeat(filled)}
            {"░".repeat(MEM_BLOCKS - filled)}] {mem}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function Credentials() {
  const rootRef = useRef<HTMLElement>(null);
  const { fx } = useHudAudio();
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Terminal state machine: hidden -> loading -> typing -> ready
  const [terminalState, setTerminalState] = useState<"hidden" | "loading" | "typing" | "ready">("hidden");
  const [cmd1Done, setCmd1Done] = useState(false);
  const [cmd2Done, setCmd2Done] = useState(false);
  const [cmd3Done, setCmd3Done] = useState(false);

  // Freeze background page scroll when modal is active
  useEffect(() => {
    if (previewCert) {
      document.documentElement.classList.add("overflow-hidden");
      document.body.classList.add("overflow-hidden");
      (window as unknown as LenisWindow).lenis?.stop();
    } else {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
      (window as unknown as LenisWindow).lenis?.start();
    }
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
      (window as unknown as LenisWindow).lenis?.start();
    };
  }, [previewCert]);

  // BIOS loader delay
  useEffect(() => {
    if (terminalState === "loading") {
      const t = setTimeout(() => {
        setTerminalState("typing");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [terminalState]);

  // Complete typing phase
  useEffect(() => {
    if (cmd3Done) {
      const t = setTimeout(() => {
        setTerminalState("ready");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [cmd3Done]);

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
          }
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

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

  return (
    <section
      id="credentials"
      ref={rootRef}
      className="relative z-10 overflow-hidden border-t border-periwinkle/10 bg-world h-screen w-screen flex flex-col justify-center px-6 pt-20 pb-4 md:px-16"
    >
      <CyberLines flip />

      <h2 className="cred-reveal t-h2 mb-2 text-paper">
        CREDENTIALS<span className="text-iris-bright">.</span>
      </h2>
      <p className="cred-reveal t-label mb-4 text-periwinkle/60">
        ● 003 — CERTIFICATIONS & CAPABILITY MATRIX
      </p>

      {/* Terminal Dashboard Container */}
      <div className="cred-reveal w-full border border-periwinkle/15 bg-world-2/80 rounded-lg overflow-hidden flex flex-col font-mono min-h-[460px] relative">
        
        {/* Terminal Header Bar */}
        <div className="bg-world border-b border-periwinkle/15 px-4 py-2 flex items-center justify-between text-xs text-iris-bright select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
            <span>AERA_SYS // MODULE: CREDENTIALS_DB_v2.0</span>
          </div>
          <div className="text-periwinkle/40 hidden sm:block">
            SYS_SEC: ACTIVE // PORT_443
          </div>
        </div>

        {/* Dynamic BIOS loading screen */}
        {terminalState === "loading" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-iris-bright text-xs font-mono space-y-4 min-h-[380px] select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-signal animate-ping" />
              <span>DECRYPTING SECURE CREDENTIALS DATASET...</span>
            </div>
            <div className="w-64 h-2 border border-iris/30 rounded overflow-hidden p-0.5 bg-world-2">
              <div className="h-full bg-signal animate-[loader-fill_1.2s_ease-in-out_forwards]" />
            </div>
            <div className="text-[9px] text-periwinkle/40 tracking-wider">ALGORITHM: ECDSA-SHA256 // SECURE_KEY: LOADED</div>
          </div>
        ) : (
          /* Terminal Body */
          <div className={`grid gap-4 p-4 lg:grid-cols-12 flex-1 transition-opacity duration-300 ${terminalState === "hidden" ? "opacity-0" : "opacity-100"}`}>
            
            {/* Left Panel: Capabilities (Diagnostic logs) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="border border-periwinkle/10 bg-world/50 p-4 rounded flex-1 flex flex-col justify-between min-h-[220px]">
                <p className="text-[10px] text-iris-bright mb-3 font-bold select-none">
                  $ {terminalState === "ready" ? "query --capabilities --matrix" : (
                    <TypingText text="query --capabilities --matrix" active={terminalState === "typing"} onComplete={() => setCmd1Done(true)} />
                  )}
                </p>
                
                <div className={`mb-4 flex-1 flex flex-col justify-between transition-all duration-500 ${terminalState === "ready" || cmd1Done ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div>
                    <span className="text-periwinkle/40 text-[8px] block mb-1.5">{"// HARDWARE & SYSTEMS CORE"}</span>
                    <ul className="flex flex-col gap-1 border-l border-iris/25 pl-3">
                      {HARD_SKILLS.map((s, idx) => (
                        <li key={s} className="text-[11px] leading-relaxed text-periwinkle/80">
                          <span className="text-iris font-bold">[OK_{String(idx + 1).padStart(2, "0")}]</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <span className="text-periwinkle/40 text-[8px] block mb-1.5">{"// COLLABORATION & INTEGRATION MODE"}</span>
                    <ul className="flex flex-col gap-1 border-l border-periwinkle/20 pl-3">
                      {SOFT_SKILLS.map((s, idx) => (
                        <li key={s} className="text-[11px] leading-relaxed text-periwinkle/60">
                          <span className="text-periwinkle/40 font-bold">[MOD_{String(idx + 1).padStart(2, "0")}]</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* System Specs Widget — animates once the terminal is ready */}
              <SystemSpecs
                active={terminalState === "ready" || cmd3Done}
                totalKeys={CERTIFICATES.length}
              />
            </div>

            {/* Right Panel: Certifications Folder Files */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex-1 flex flex-col">
                <p className="text-[10px] text-iris-bright font-bold select-none mb-2">
                  $ {terminalState === "ready" ? "get --certifications --featured" : (
                    <TypingText text="get --certifications --featured" active={terminalState === "typing" && cmd1Done} onComplete={() => setCmd2Done(true)} />
                  )}
                </p>

                <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 flex-1 transition-opacity duration-500 ${terminalState === "ready" || cmd2Done ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  {featured.map((c) => (
                    <div
                      key={c.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        fx.click();
                        setPreviewCert(c);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          fx.click();
                          setPreviewCert(c);
                        }
                      }}
                      className="clip-step-tr text-left cursor-pointer relative border border-periwinkle/15 bg-world/40 hover:border-iris-bright/60 transition-colors p-4 flex flex-col justify-between focus-visible:outline-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[9px] text-iris-bright font-bold">FILE: {c.issuer}_SYS.DB</span>
                          <span className="text-[8px] px-1 bg-iris/10 border border-iris/20 text-iris leading-none">VERIFIED</span>
                        </div>
                        <h3 className="font-display text-xs font-black uppercase tracking-tight text-paper mb-1">
                          {c.name}
                        </h3>
                        <p className="text-[10px] leading-relaxed text-periwinkle/70 mb-3 font-sans">
                          {c.detail}
                        </p>
                      </div>

                      {/* Terminal Action Buttons */}
                      <div className="flex gap-2.5 mt-auto pt-2 border-t border-periwinkle/5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fx.click();
                            setPreviewCert(c);
                          }}
                          className="px-2 py-1 border border-iris/30 text-iris hover:bg-iris hover:text-world text-[8px] font-mono transition-colors cursor-pointer"
                        >
                          [ PREVIEW ]
                        </button>
                        <a
                          href={c.url}
                          download={c.downloadName}
                          onClick={(e) => {
                            e.stopPropagation();
                            fx.click();
                          }}
                          className="px-2 py-1 border border-periwinkle/30 text-periwinkle/70 hover:border-paper hover:text-paper text-[8px] font-mono transition-colors"
                          onMouseEnter={fx.blip}
                        >
                          [ DOWNLOAD ]
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional logs rendered as an ASCII Table */}
              <div>
                <p className="text-[10px] text-iris-bright mb-2 font-bold select-none">
                  $ {terminalState === "ready" ? "list --certifications --additional" : (
                    <TypingText text="list --certifications --additional" active={terminalState === "typing" && cmd2Done} onComplete={() => setCmd3Done(true)} />
                  )}
                </p>

                <div className={`overflow-x-auto border border-periwinkle/10 bg-world/20 rounded transition-opacity duration-500 ${terminalState === "ready" || cmd3Done ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <table className="w-full text-left text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-periwinkle/10 bg-world-2/80 text-periwinkle/40">
                        <th className="px-4 py-1.5 font-mono font-bold">LOG_ID</th>
                        <th className="px-4 py-1.5 font-mono font-bold">TRAINING LOG / DETAILS</th>
                        <th className="px-4 py-1.5 font-mono font-bold">ISSUER</th>
                        <th className="px-4 py-1.5 font-mono font-bold text-right">UPLINKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additional.map((c, idx) => (
                        <tr
                          key={c.name}
                          className="border-b border-periwinkle/5 hover:bg-world-2/40 transition-colors"
                        >
                          <td className="px-4 py-1.5 font-bold text-iris/80">
                            TR-{String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-1.5 text-periwinkle/80 max-w-xs truncate">
                            {c.name}
                          </td>
                          <td className="px-4 py-1.5 text-periwinkle/50">
                            {c.issuer}
                          </td>
                          <td className="px-4 py-1.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                fx.click();
                                setPreviewCert(c);
                              }}
                              className="text-iris hover:underline cursor-pointer bg-transparent border-0 p-0"
                            >
                              [PRV]
                            </button>
                            <a
                              href={c.url}
                              download={c.downloadName}
                              className="text-periwinkle/50 hover:text-paper"
                              onMouseEnter={fx.blip}
                              onClick={fx.click}
                            >
                              [DL]
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Certificate Decryption View Modal */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewCert.name} preview`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#050507]/90 backdrop-blur-md"
            onClick={() => {
              fx.click();
              setPreviewCert(null);
            }}
          />
          {/* Refined Dark Theme Modal Container */}
          <div className="relative w-full max-w-4xl h-[85vh] border border-periwinkle/20 bg-world/95 rounded-lg flex flex-col overflow-hidden font-mono shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl z-10 animate-zoom-in">
            
            {/* Tactical Crosshair / Corner Details */}
            <div className="absolute top-1 left-1 text-[8px] text-periwinkle/20 pointer-events-none select-none">┌ SEC_PREVIEW ┐</div>
            <div className="absolute bottom-1 left-1 text-[8px] text-periwinkle/20 pointer-events-none select-none">└ MODULE_AERA ┘</div>

            {/* Modal Header */}
            <div className="bg-world-2/40 text-paper px-6 py-4 flex items-center justify-between text-xs font-bold border-b border-periwinkle/15 select-none z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-iris-bright animate-ping" />
                <span className="truncate tracking-widest text-periwinkle">DECRYPTING: {previewCert.downloadName}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewCert.url}
                  download={previewCert.downloadName}
                  className="group relative card-notch overflow-hidden border border-periwinkle/30 px-3.5 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
                  onMouseEnter={fx.blip}
                  onClick={fx.click}
                >
                  {/* Sliding yellow background */}
                  <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                  <span className="relative z-10 text-periwinkle group-hover:text-ink transition-colors duration-300">
                    ◍ DOWNLOAD PDF
                  </span>
                </a>
                <button
                  onClick={() => {
                    fx.click();
                    setPreviewCert(null);
                  }}
                  className="group relative card-notch overflow-hidden border border-periwinkle/30 px-3 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:border-iris-bright cursor-pointer"
                  aria-label="Close preview"
                >
                  {/* Sliding yellow background */}
                  <span className="absolute inset-0 bg-iris-bright translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                  <span className="relative z-10 text-periwinkle group-hover:text-ink transition-colors duration-300">
                    ◍ CLOSE
                  </span>
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

            {/* Modal Footer */}
            <div className="bg-world-2/40 text-periwinkle/40 px-6 py-2 text-[8px] flex justify-between border-t border-periwinkle/15 select-none">
              <span>CIPHER_DEC: COMPLETED // SUCCESS</span>
              <span>AERA SECURE WORKSTATION v2.0 // DECRYPT_ENGINE_ACTIVE</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
