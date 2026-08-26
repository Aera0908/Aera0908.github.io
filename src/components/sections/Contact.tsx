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
          src="/contacts_silhouette.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[center_20%] max-md:object-center opacity-40"
        />
        {/* left fade */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-world-2 to-transparent max-md:hidden" />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-world-2 to-transparent" />
      </div>
      <p className="contact-reveal t-label mb-6 text-periwinkle/60">
        ● 004 // UPLINK
      </p>
      <h2 className="contact-reveal t-hero mb-10 text-paper">
        LET&apos;S
        <br />
        BUILD<span className="text-iris-bright">.</span>
      </h2>

      <div className="contact-reveal flex flex-col items-start gap-6">
        {/* Uplink Channels: Email + Socials */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Email Button */}
          <a
            href="mailto:08airajosh@gmail.com"
            aria-label="Send Email to 08airajosh@gmail.com"
            title="Email: 08airajosh@gmail.com"
            className="card-notch flex h-14 w-14 md:h-16 md:w-16 items-center justify-center bg-signal text-ink transition-all duration-300 hover:scale-105 hover:bg-iris-bright hover:shadow-[0_0_25px_rgba(252,238,10,0.45)]"
            onMouseEnter={fx.blip}
            onClick={fx.confirm}
          >
            <svg
              className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>

          {/* GitHub Button */}
          <a
            href="https://github.com/Aera0908"
            target="_blank"
            rel="noopener noreferrer me"
            aria-label="GitHub Profile"
            title="GitHub: Aera0908"
            className="card-notch flex h-14 w-14 md:h-16 md:w-16 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_20px_rgba(252,238,10,0.25)]"
            onMouseEnter={fx.blip}
            onClick={fx.click}
          >
            <svg
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* LinkedIn Button */}
          <a
            href="https://linkedin.com/in/aira-josh-ynte"
            target="_blank"
            rel="noopener noreferrer me"
            aria-label="LinkedIn Profile"
            title="LinkedIn: aira-josh-ynte"
            className="card-notch flex h-14 w-14 md:h-16 md:w-16 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_20px_rgba(252,238,10,0.25)]"
            onMouseEnter={fx.blip}
            onClick={fx.click}
          >
            <svg
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0-.02-3.3 1.65 1.65 0 0 0 .02 3.3M5.07 18.5h2.78v-8.37H5.07v8.37z" />
            </svg>
          </a>

          {/* X (formerly Twitter) Button */}
          <a
            href="https://x.com/aera0908"
            target="_blank"
            rel="noopener noreferrer me"
            aria-label="X (Twitter) Profile"
            title="X: @aera0908"
            className="card-notch flex h-14 w-14 md:h-16 md:w-16 items-center justify-center bg-world border border-periwinkle/25 text-periwinkle transition-all duration-300 hover:scale-105 hover:border-signal hover:text-signal hover:bg-world-2 hover:shadow-[0_0_20px_rgba(252,238,10,0.25)]"
            onMouseEnter={fx.blip}
            onClick={fx.click}
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* Inline Resume & CV buttons under the Uplink buttons */}
        <div className="flex flex-col items-start gap-1.5 font-mono text-[9px] select-none pl-1">
          <span className="text-[8px] text-periwinkle/55">SYS_UPLINK // DOWNLOAD</span>
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

      <footer className="contact-reveal mt-auto flex items-baseline justify-between border-t border-periwinkle/15 pt-4">
        <span className="t-micro text-periwinkle/50">
          © 2026 AIRA YNTE
        </span>
        <span className="t-micro text-periwinkle/50">END OF TRANSMISSION</span>
      </footer>
    </section>
  );
}
