"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { AJLogo } from "@/components/chrome/AJLogo";
import { CyberLines } from "@/components/ui/CyberLines";

const LINKS = [
  { href: "/journey", id: "journey", label: "Journey", index: "001" },
  { href: "/vault", id: "vault", label: "Vault", index: "002" },
  { href: "/credentials", id: "credentials", label: "Credentials", index: "003" },
  { href: "/contact", id: "contact", label: "Contact", index: "004" },
];

/**
 * Minimalist top navigation. Section links are real paths (/contact …);
 * on the scrollytelling page we intercept and smooth-scroll, elsewhere the
 * browser navigates and the route lands pre-scrolled without the intro.
 *
 * On mobile (<768px), horizontal links collapse into a sleek cyberpunk
 * burger drawer.
 */
export function Navbar() {
  // All hooks must run unconditionally — Navbar lives in the layout and
  // persists across client navigations, so an early return before a hook
  // would desync the hook order and crash React.
  const pathname = usePathname();
  const { booted, muted, boot, toggleMute, fx } = useHudAudio();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hidden on the archive route and case files (they carry their own header)
  const hidden = pathname?.startsWith("/vault/archive");

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onSection = (e: MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    const el = document.getElementById(id);
    if (!el) return; // not on the one-pager — let the browser navigate
    e.preventDefault();
    fx.click();
    history.pushState(null, "", href);
    window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: id } }));
  };

  const onHome = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("top");
    if (!el) return;
    e.preventDefault();
    fx.click();
    history.pushState(null, "", "/");
    window.dispatchEvent(new CustomEvent("aera-snap-jump", { detail: { target: "hero-top" } }));
  };

  const openPalette = () => {
    fx.click();
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  if (hidden) return null;

  return (
    <header className="fixed top-0 left-0 z-[70] w-full">
      {/* Top Nav Bar */}
      <nav className="relative z-[72] flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 md:px-10 mix-blend-difference">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 text-white shrink-0"
          onMouseEnter={fx.blip}
          onClick={(e) => {
            setMenuOpen(false);
            onHome(e);
          }}
          aria-label="AERA.DEV - home"
        >
          <AJLogo className="h-5 sm:h-6 w-auto" />
          <span className="t-label hidden sm:inline font-bold">
            AERA<span className="text-iris-bright">.</span>DEV
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          {/* Desktop Links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 md:gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className="nav-link font-mono text-xs text-white"
                onMouseEnter={fx.blip}
                onClick={(e) => onSection(e, link.id, link.href)}
              >
                <span className="mr-1.5 opacity-60" aria-hidden="true">{link.index}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Quick Command Palette Trigger: Search icon on mobile, ⌘K on desktop */}
          <button
            onClick={openPalette}
            aria-label="Open Command Palette (Cmd + K / Tap to Search)"
            title="Open Command Palette"
            onMouseEnter={fx.blip}
            className="flex items-center justify-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded border border-white/25 hover:border-white text-[10px] font-mono tracking-widest text-white transition-all duration-200 cursor-pointer hover:bg-white/10"
          >
            <svg
              className="h-3 w-3 sm:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline font-bold">⌘K</span>
            <span className="hidden lg:inline text-[9px] opacity-70">SEARCH</span>
          </button>

          {/* Audio Equalizer & Mute HUD Toggle (Always visible) */}
          <button
            className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1 border border-white/25 hover:border-white text-white text-[10px] font-mono tracking-widest transition-all duration-200 cursor-pointer rounded hover:bg-white/10"
            onMouseEnter={fx.blip}
            onClick={() => {
              if (!booted) {
                boot();
              }
              toggleMute();
              fx.click();
            }}
            title={muted ? "HUD Audio: Muted (Click to enable)" : "HUD Audio: Active (Click to mute)"}
            aria-label={muted ? "Unmute HUD Audio" : "Mute HUD Audio"}
          >
            {/* Equalizer Visualizer Bars */}
            <div className="flex items-end gap-[2px] h-3 w-3.5 sm:h-3.5 sm:w-4" aria-hidden="true">
              <span
                className={`w-[2px] sm:w-[2.5px] bg-white rounded-t-sm transition-all duration-200 ${
                  muted ? "h-[2px] opacity-30" : "animate-eq-1"
                }`}
              />
              <span
                className={`w-[2px] sm:w-[2.5px] bg-white rounded-t-sm transition-all duration-200 ${
                  muted ? "h-[2px] opacity-30" : "animate-eq-2"
                }`}
              />
              <span
                className={`w-[2px] sm:w-[2.5px] bg-white rounded-t-sm transition-all duration-200 ${
                  muted ? "h-[2px] opacity-30" : "animate-eq-3"
                }`}
              />
              <span
                className={`w-[2px] sm:w-[2.5px] bg-white rounded-t-sm transition-all duration-200 ${
                  muted ? "h-[2px] opacity-30" : "animate-eq-4"
                }`}
              />
            </div>
            <span className="hidden sm:inline font-bold">{muted ? "MUTED" : "AUDIO"}</span>
          </button>

          {/* Burger Menu Button (mobile only) */}
          <button
            onClick={() => {
              fx.click();
              setMenuOpen((prev) => !prev);
            }}
            aria-label={menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center h-7 w-7 rounded border border-white/25 hover:border-white text-white transition-all duration-200 cursor-pointer hover:bg-white/10"
          >
            <div className="relative w-3.5 h-3 flex flex-col justify-between" aria-hidden="true">
              <span
                className={`block h-[1.5px] w-full bg-white transition-transform duration-300 origin-center ${
                  menuOpen ? "translate-y-[5.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-white transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-white transition-transform duration-300 origin-center ${
                  menuOpen ? "-translate-y-[5.25px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Cybernetic Mobile Navigation Drawer (isolated from mix-blend-difference for crisp dark contrast) */}
      <div
        className={`fixed inset-0 z-[71] md:hidden flex flex-col justify-between bg-[#0a0a0c]/98 backdrop-blur-2xl transition-all duration-300 ease-out pt-20 px-6 pb-8 ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <CyberLines tone="light" />

        {/* Top meta status */}
        <div className="relative z-10 flex items-center justify-between border-b border-periwinkle/15 pb-3 font-mono text-[9px] tracking-widest text-periwinkle/60 uppercase">
          <span>■ SYS {"//"} NAVIGATION_INDEX</span>
          <span className="flex items-center gap-1.5 text-signal font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
            ACTIVE
          </span>
        </div>

        {/* Links list */}
        <div className="relative z-10 flex flex-col gap-2.5 my-auto py-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                setMenuOpen(false);
                onSection(e, link.id, link.href);
              }}
              onMouseEnter={fx.blip}
              className="group relative flex items-center justify-between p-3.5 rounded border border-periwinkle/15 bg-world-2/60 hover:bg-world-2 hover:border-signal transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-signal/80 group-hover:text-signal font-bold">
                  {link.index}
                </span>
                <span className="font-display text-base font-black tracking-tight text-paper uppercase group-hover:text-signal transition-colors">
                  {link.label}
                </span>
              </div>
              <span className="font-mono text-xs text-periwinkle/40 group-hover:text-signal group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Drawer Footer Actions */}
        <div className="relative z-10 flex flex-col gap-2.5 pt-4 border-t border-periwinkle/15">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                fx.click();
                window.dispatchEvent(
                  new CustomEvent("open-resume-preview", { detail: { type: "resume" } })
                );
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded bg-signal text-ink font-mono text-[10px] font-black uppercase tracking-wider hover:bg-[#fff024] transition-colors cursor-pointer"
            >
              <span>●</span> VIEW RESUME
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                fx.click();
                window.dispatchEvent(
                  new CustomEvent("open-resume-preview", { detail: { type: "cv" } })
                );
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded border border-periwinkle/30 bg-world-2/80 text-periwinkle hover:text-paper hover:border-iris-bright font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>○</span> VIEW CV
            </button>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              openPalette();
            }}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded border border-periwinkle/20 text-periwinkle/80 hover:text-paper hover:border-periwinkle/50 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span>COMMAND SEARCH (⌘K)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
