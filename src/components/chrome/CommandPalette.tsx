"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { CASE_STUDIES } from "@/lib/case-studies";
import { navReturn } from "@/lib/nav-return";

interface CommandItem {
  id: string;
  category: "NAV" | "CASE FILE" | "DOC" | "ACTION";
  title: string;
  subtitle?: string;
  shortcut?: string;
  badge?: string;
  perform: (helpers: {
    router: ReturnType<typeof useRouter>;
    fx: ReturnType<typeof useHudAudio>["fx"];
    close: () => void;
    showToast: (msg: string) => void;
    toggleMute: () => void;
  }) => void;
}

function CommandPaletteModal({
  onClose,
  fx,
  toggleMute,
}: {
  onClose: () => void;
  fx: ReturnType<typeof useHudAudio>["fx"];
  toggleMute: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and focus input when palette opens
  useEffect(() => {
    lockScroll();
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      clearTimeout(t);
      unlockScroll();
    };
  }, []);

  // Escape key closes palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fx.click();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fx, onClose]);

  // Build command dictionary
  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Quick Navigation
      {
        id: "nav-home",
        category: "NAV",
        title: "Sector 000 // Home",
        subtitle: "Jump to Hero Section & Identity",
        shortcut: "G H",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          const el = document.getElementById("top");
          if (el) {
            history.pushState(null, "", "/");
            window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "hero-top" } }));
          } else {
            router.push("/");
          }
        },
      },
      {
        id: "nav-journey",
        category: "NAV",
        title: "Sector 001 // Journey & Experience",
        subtitle: "IC Layout, Fehuvia, AeroVit & Career Timeline",
        shortcut: "G J",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          const el = document.getElementById("journey");
          if (el) {
            history.pushState(null, "", "/journey");
            window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "journey" } }));
          } else {
            router.push("/journey");
          }
        },
      },
      {
        id: "nav-vault",
        category: "NAV",
        title: "Sector 002 // Engineering Vault",
        subtitle: "Flagship Projects & Interactive Case Studies",
        shortcut: "G V",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          const el = document.getElementById("vault");
          if (el) {
            history.pushState(null, "", "/vault");
            window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "vault" } }));
          } else {
            router.push("/vault");
          }
        },
      },
      {
        id: "nav-credentials",
        category: "NAV",
        title: "Sector 003 // Verified Credentials",
        subtitle: "Anthropic Certifications, Education & Skills Matrix",
        shortcut: "G C",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          const el = document.getElementById("credentials");
          if (el) {
            history.pushState(null, "", "/credentials");
            window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "credentials" } }));
          } else {
            router.push("/credentials");
          }
        },
      },
      {
        id: "nav-contact",
        category: "NAV",
        title: "Sector 004 // Uplink & Contact",
        subtitle: "Direct Communication Channels & Socials",
        shortcut: "G U",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          const el = document.getElementById("contact");
          if (el) {
            history.pushState(null, "", "/contact");
            window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "contact" } }));
          } else {
            router.push("/contact");
          }
        },
      },

      // Documents
      {
        id: "doc-resume",
        category: "DOC",
        title: "View Resume (PDF)",
        subtitle: "Interactive PDF viewer with direct download",
        badge: "PDF",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "resume" } }));
        },
      },
      {
        id: "doc-cv",
        category: "DOC",
        title: "View Curriculum Vitae (PDF)",
        subtitle: "Comprehensive academic & technical dossier",
        badge: "PDF",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "cv" } }));
        },
      },
      {
        id: "doc-archive-catalog",
        category: "DOC",
        title: "Browse Complete Project Archive",
        subtitle: "Catalog grid of all 10 software & hardware systems",
        perform: ({ router, close, fx }) => {
          fx.confirm();
          close();
          navReturn.set("/vault");
          router.push("/vault/archive");
        },
      },

      // Quick Actions
      {
        id: "act-copy-email",
        category: "ACTION",
        title: "Copy Email Address",
        subtitle: "08airajosh@gmail.com",
        shortcut: "↵",
        perform: ({ showToast, fx }) => {
          fx.confirm();
          navigator.clipboard.writeText("08airajosh@gmail.com");
          showToast("COPIED TO CLIPBOARD // 08airajosh@gmail.com");
        },
      },
      {
        id: "act-toggle-audio",
        category: "ACTION",
        title: "Toggle HUD Audio Sound FX",
        subtitle: "Mute or unmute synthesized WebAudio sound effects",
        perform: ({ toggleMute, showToast, fx }) => {
          fx.confirm();
          toggleMute();
          showToast("HUD AUDIO STATE TOGGLED");
        },
      },
      {
        id: "act-github",
        category: "ACTION",
        title: "Open GitHub Profile",
        subtitle: "github.com/Aera0908",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          window.open("https://github.com/Aera0908", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-linkedin",
        category: "ACTION",
        title: "Open LinkedIn Profile",
        subtitle: "linkedin.com/in/aira-josh-ynte",
        perform: ({ close, fx }) => {
          fx.confirm();
          close();
          window.open("https://www.linkedin.com/in/aira-josh-ynte", "_blank", "noopener,noreferrer");
        },
      },
    ];

    // Case studies injection
    CASE_STUDIES.forEach((cs) => {
      list.push({
        id: `case-${cs.slug}`,
        category: "CASE FILE",
        title: `${cs.name} — Case Dossier`,
        subtitle: `${cs.category} // ${cs.role}`,
        badge: cs.badge || cs.status,
        perform: ({ router, close, fx }) => {
          fx.confirm();
          close();
          navReturn.set("/vault");
          router.push(`/vault/archive/${cs.slug}`);
        },
      });
    });

    return list;
  }, [router]);

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(q) ||
        cmd.subtitle?.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
      );
    });
  }, [commands, query]);

  // Handle keyboard navigation in list
  const handleKeyDownInPalette = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      fx.blip();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      fx.blip();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetCmd = filteredCommands[selectedIndex];
      if (targetCmd) {
        targetCmd.perform({
          router,
          fx,
          close: onClose,
          showToast: (msg) => {
            setToast(msg);
            setTimeout(() => setToast(null), 2500);
          },
          toggleMute,
        });
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center pt-[8vh] md:pt-[15vh] px-3 sm:px-4 font-mono select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Cyberpunk Command Palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050507]/85 backdrop-blur-md"
        onClick={() => {
          fx.click();
          onClose();
        }}
      />

      {/* Command Palette Terminal Container */}
      <div className="relative w-full max-w-2xl bg-[#0c0d12] border-2 border-signal/40 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(252,238,10,0.15)] flex flex-col overflow-hidden rounded text-paper z-10">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#12131a] border-b border-signal/20 text-[9px] sm:text-[10px] tracking-widest text-signal font-bold uppercase">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-signal animate-ping shrink-0" />
            <span className="truncate">SYS_NAV // COMMAND TERMINAL</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-periwinkle/60 shrink-0">
            <span className="hidden sm:inline">[↑↓] NAVIGATE</span>
            <span className="hidden sm:inline">[↵] SELECT</span>
            <button
              onClick={() => {
                fx.click();
                onClose();
              }}
              className="text-signal hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded-xs"
              aria-label="Close command palette"
            >
              [ESC]
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0c0d12]">
          <span className="text-signal font-black text-lg mr-3">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInPalette}
            placeholder="Type a command, project name, or action..."
            className="w-full bg-transparent text-sm md:text-base text-paper placeholder:text-periwinkle/40 focus:outline-none font-mono font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[10px] text-periwinkle/50 hover:text-signal uppercase px-2 py-1"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Command Results List */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto divide-y divide-white/5 py-1 scrollbar-thin scrollbar-thumb-signal/20"
        >
          {filteredCommands.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-periwinkle/50 space-y-1">
              <p className="text-signal font-bold">NO MATCHING PROTOCOLS FOUND</p>
              <p>Try searching for &quot;resume&quot;, &quot;fehuvia&quot;, &quot;aerovit&quot;, or &quot;contact&quot;.</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  data-index={idx}
                  onClick={() => {
                    cmd.perform({
                      router,
                      fx,
                      close: onClose,
                      showToast: (msg) => {
                        setToast(msg);
                        setTimeout(() => setToast(null), 2500);
                      },
                      toggleMute,
                    });
                  }}
                  onMouseEnter={() => {
                    if (selectedIndex !== idx) {
                      fx.blip();
                      setSelectedIndex(idx);
                    }
                  }}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? "bg-signal text-[#0c0d12] font-bold"
                      : "text-periwinkle/85 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm tracking-wider uppercase shrink-0 ${
                        isSelected
                          ? "bg-[#0c0d12] text-signal"
                          : "bg-white/10 text-periwinkle"
                      }`}
                    >
                      {cmd.category}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs md:text-sm font-semibold truncate ${isSelected ? "text-[#0c0d12]" : "text-paper"}`}>
                        {cmd.title}
                      </span>
                      {cmd.subtitle && (
                        <span className={`text-[10px] truncate ${isSelected ? "text-[#0c0d12]/80" : "text-periwinkle/60"}`}>
                          {cmd.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 uppercase tracking-widest ${
                          isSelected ? "border border-[#0c0d12] text-[#0c0d12]" : "text-iris-bright border border-iris-bright/30"
                        }`}
                      >
                        {cmd.badge}
                      </span>
                    )}
                    {cmd.shortcut && (
                      <kbd
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isSelected ? "border-[#0c0d12] text-[#0c0d12]" : "border-white/20 text-periwinkle/50"
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer Info & Toast Notification */}
        <div className="px-4 py-2 bg-[#12131a] border-t border-signal/20 flex items-center justify-between text-[9px] text-periwinkle/60">
          <div className="flex items-center gap-3">
            <span>SECTOR: ACTIVE</span>
            <span>AERA.SYS // PROTOCOL ⌘K</span>
          </div>
          {toast && (
            <span className="text-signal font-bold animate-pulse">
              ● {toast}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { fx, toggleMute } = useHudAudio();

  // Global shortcut listener: Cmd+K or Ctrl+K or custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) fx.click();
          return !prev;
        });
      }
    };

    const handleCustomOpen = () => {
      fx.click();
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [fx]);

  if (!open) return null;

  return (
    <CommandPaletteModal
      onClose={() => setOpen(false)}
      fx={fx}
      toggleMute={toggleMute}
    />
  );
}
