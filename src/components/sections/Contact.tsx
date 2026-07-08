"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { CyberLines } from "@/components/ui/CyberLines";

/**
 * Uplink: the camera rises into the particle streams; one big CTA.
 */
export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const { fx } = useHudAudio();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative z-10 flex min-h-screen flex-col overflow-hidden bg-world-2 px-6 pt-[24vh] pb-10 md:px-16"
    >
      <CyberLines flip />
      <p className="contact-reveal t-label mb-6 text-periwinkle/60">
        ● 004 — UPLINK
      </p>
      <h2 className="contact-reveal t-hero mb-10 text-paper">
        LET&apos;S
        <br />
        BUILD<span className="text-iris-bright">.</span>
      </h2>

      <div className="contact-reveal flex flex-wrap items-center gap-8">
        <a
          href="mailto:08airajosh@gmail.com"
          className="card-notch bg-signal px-8 py-4 font-bold tracking-tight text-ink uppercase transition-transform hover:scale-[1.03]"
          onMouseEnter={fx.blip}
          onClick={fx.confirm}
        >
          OPEN UPLINK → 08AIRAJOSH@GMAIL.COM
        </a>
        <div className="flex gap-6">
          {[
            { label: "GITHUB", href: "https://github.com/Aera0908" },
            { label: "LINKEDIN", href: "https://linkedin.com/in/aira-josh-ynte" },
            { label: "X", href: "https://x.com/aera0908" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="nav-link t-label text-periwinkle"
              onMouseEnter={fx.blip}
              onClick={fx.click}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <footer className="contact-reveal mt-auto flex items-baseline justify-between border-t border-periwinkle/15 pt-4">
        <span className="t-micro text-periwinkle/50">
          © 2026 AIRA YNTE
        </span>
        <span className="t-micro text-periwinkle/50">END OF TRANSMISSION</span>
      </footer>
    </section>
  );
}
