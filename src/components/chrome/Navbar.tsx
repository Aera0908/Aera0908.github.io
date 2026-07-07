"use client";

import { useHudAudio } from "@/components/providers/HudAudioProvider";

const LINKS = [
  { href: "#experience", label: "Experience", index: "001" },
  { href: "#projects", label: "Projects", index: "002" },
  { href: "#contact", label: "Contact", index: "003" },
];

/**
 * Minimalist top navigation. Anchor links ride Lenis smooth scrolling
 * (`anchors: true` in SmoothScrollProvider).
 */
export function Navbar() {
  const { booted, muted, toggleMute, fx } = useHudAudio();

  return (
    <header className="fixed top-0 left-0 z-[70] w-full mix-blend-difference">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="t-label font-bold text-white"
          onMouseEnter={fx.blip}
          onClick={fx.click}
        >
          AJ<span className="text-iris-bright">.</span>DEV
        </a>

        <div className="flex items-center gap-6 md:gap-10">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link t-label text-white"
              onMouseEnter={fx.blip}
              onClick={fx.click}
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
