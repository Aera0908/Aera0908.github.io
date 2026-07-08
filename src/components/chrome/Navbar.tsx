"use client";

import type { MouseEvent } from "react";
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
  const { booted, muted, toggleMute, fx } = useHudAudio();

  // hidden on the archive route and case files (they carry their own header)
  const hidden = pathname?.startsWith("/vault/archive");

  const onSection = (e: MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    const el = document.getElementById(id);
    if (!el) return; // not on the one-pager — let the browser navigate
    e.preventDefault();
    fx.click();
    history.pushState(null, "", href);
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(el, {});
    else el.scrollIntoView({ behavior: "auto" });
  };

  const onHome = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("top");
    if (!el) return;
    e.preventDefault();
    fx.click();
    history.pushState(null, "", "/");
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, {});
    else window.scrollTo(0, 0);
  };

  if (hidden) return null;

  return (
    <header className="fixed top-0 left-0 z-[70] w-full mix-blend-difference">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="/"
          className="flex items-center gap-3 text-white"
          onMouseEnter={fx.blip}
          onClick={onHome}
          aria-label="AERA.DEV — home"
        >
          <AJLogo className="h-6 w-auto" />
          <span className="t-label hidden font-bold sm:inline">
            AERA<span className="text-iris-bright">.</span>DEV
          </span>
        </a>

        <div className="flex items-center gap-6 md:gap-10">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link t-label text-white"
              onMouseEnter={fx.blip}
              onClick={(e) => onSection(e, link.id, link.href)}
            >
              <span className="mr-1.5 opacity-50">{link.index}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          ))}

          {booted && (
            <button
              className="nav-link t-label text-white"
              onMouseEnter={fx.blip}
              onClick={() => {
                fx.click();
                toggleMute();
              }}
            >
              SND {muted ? "OFF" : "ON"}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
