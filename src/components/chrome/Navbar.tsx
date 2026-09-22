"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { AJLogo } from "@/components/chrome/AJLogo";

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
 */
export function Navbar() {
  // All hooks must run unconditionally — Navbar lives in the layout and
  // persists across client navigations, so an early return before a hook
  // would desync the hook order and crash React.
  const pathname = usePathname();
  const { booted, muted, boot, toggleMute, fx } = useHudAudio();

  // hidden on the archive route and case files (they carry their own header)
  const hidden = pathname?.startsWith("/vault/archive");

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
    <header className="fixed top-0 left-0 z-[70] w-full mix-blend-difference">
      <nav className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 text-white shrink-0"
          onMouseEnter={fx.blip}
          onClick={onHome}
          aria-label="AERA.DEV - home"
        >
          <AJLogo className="h-5 sm:h-6 w-auto" />
          <span className="t-label hidden sm:inline font-bold">
            AERA<span className="text-iris-bright">.</span>DEV
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className="nav-link font-mono text-[10px] sm:text-xs text-white"
              onMouseEnter={fx.blip}
              onClick={(e) => onSection(e, link.id, link.href)}
            >
              <span className="mr-0.5 sm:mr-1.5 opacity-60" aria-hidden="true">{link.index}</span>
              <span className="hidden sm:inline" aria-hidden="true">{link.label}</span>
            </Link>
          ))}

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
        </div>
      </nav>
    </header>
  );
}
