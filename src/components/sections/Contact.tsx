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

      {/* silhouette portrait — right side, fades into the bg on the left */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:h-[45%] max-md:w-full select-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/contacts_silhouette.png"
          alt=""
          className="h-full w-full object-cover object-[center_20%] max-md:object-center opacity-40"
        />
        {/* left fade */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-world-2 to-transparent max-md:hidden" />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-world-2 to-transparent" />
      </div>
      <p className="contact-reveal t-label mb-6 text-periwinkle/60">
        ● 004 — UPLINK
      </p>
      <h2 className="contact-reveal t-hero mb-10 text-paper">
        LET&apos;S
        <br />
        BUILD<span className="text-iris-bright">.</span>
      </h2>

      <div className="contact-reveal flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-start gap-4 max-md:w-full">
          <a
            href="mailto:08airajosh@gmail.com"
            className="card-notch bg-signal px-8 py-4 font-bold tracking-tight text-ink uppercase transition-transform hover:scale-[1.03] max-md:w-full max-md:px-4 max-md:text-center max-md:text-xs"
            onMouseEnter={fx.blip}
            onClick={fx.confirm}
          >
            OPEN UPLINK → 08AIRAJOSH@GMAIL.COM
          </a>

          {/* Inline Resume & CV buttons under the Open Uplink button */}
          <div className="flex flex-col items-start gap-1.5 font-mono text-[9px] select-none mt-2 pl-1">
            <span className="text-[8px] text-periwinkle/30">SYS_UPLINK // DOWNLOAD</span>
            <div className="flex gap-2 bg-world border border-periwinkle/20 p-2 rounded shadow-2xl">
              <button
                onClick={() => {
                  fx.click();
                  window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "resume" } }));
                }}
                className="px-2.5 py-1.5 border border-iris/30 text-iris hover:bg-iris hover:text-world transition-all duration-300 tracking-wider cursor-pointer"
                onMouseEnter={fx.blip}
              >
                RESUME
              </button>
              <button
                onClick={() => {
                  fx.click();
                  window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "cv" } }));
                }}
                className="px-2.5 py-1.5 border border-iris/30 text-iris hover:bg-iris hover:text-world transition-all duration-300 tracking-wider cursor-pointer"
                onMouseEnter={fx.blip}
              >
                CV
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 max-md:mt-4">
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
