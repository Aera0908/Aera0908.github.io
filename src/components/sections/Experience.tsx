"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* placeholder resume data — swap for real history */
const ENTRIES = [
  {
    index: "001",
    role: "Senior Full-Stack Engineer",
    org: "WEBCO SYSTEMS",
    period: "2023 — NOW",
    blurb:
      "Own the realtime telemetry platform end-to-end: React/Next.js frontends, Node.js event pipelines, and the WebSocket layer between them. Cut p95 dashboard latency by 60%.",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    index: "002",
    role: "Embedded Systems Engineer",
    org: "HARDTECH LABS",
    period: "2021 — 2023",
    blurb:
      "Shipped ESP32/STM32 firmware for a distributed sensor product line — RTOS task design, OTA updates, and a LoRa mesh that survived the field.",
    tags: ["C/C++", "ESP32", "FreeRTOS", "MQTT", "LoRa"],
  },
  {
    index: "003",
    role: "ML Engineer — Intern",
    org: "VISIONLAB",
    period: "2020 — 2021",
    blurb:
      "Built computer-vision training pipelines and pruned models until they ran on edge hardware without melting it.",
    tags: ["Python", "PyTorch", "OpenCV", "ONNX"],
  },
];

/**
 * Professional journey: white editorial cards scrolling over the 3D
 * world (the camera dives into the core behind them). Cards alternate
 * left/right and reveal on entry; faint mono coordinates drift at a
 * different scroll speed for depth.
 */
export function Experience() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".xp-card").forEach((card) => {
        gsap.from(card, {
          y: 90,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 80%" },
        });
      });
      // decorative parallax layers
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed ?? "1");
        gsap.to(el, {
          yPercent: (1 - speed) * 120,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      id="experience"
      ref={rootRef}
      className="relative z-10 px-6 py-[18vh] md:px-16"
    >
      {/* drifting mono coordinates — pure decoration */}
      <span
        data-speed="0.85"
        className="t-micro absolute top-[12%] right-[8%] text-periwinkle/40"
      >
        SECTOR 02 // JOURNEY
      </span>
      <span
        data-speed="1.15"
        className="t-micro absolute bottom-[10%] left-[6%] text-periwinkle/40"
      >
        LAT 14.5995 / LON 120.9842
      </span>

      <h2 className="t-h2 mb-4 text-paper">
        THE JOURNEY<span className="text-iris-bright">.</span>
      </h2>
      <p className="t-label mb-20 text-periwinkle/60">
        ● 001 — EXPERIENCE LOG
      </p>

      <div className="flex flex-col gap-[14vh]">
        {ENTRIES.map((e, i) => (
          <article
            key={e.index}
            className={`xp-card card-notch w-full max-w-2xl bg-paper p-8 text-ink md:p-12 ${
              i % 2 === 1 ? "md:ml-auto" : ""
            }`}
          >
            <div className="mb-6 flex items-baseline justify-between">
              <span className="index-marker">● {e.index}</span>
              <span className="t-micro text-ink-soft">{e.period}</span>
            </div>
            <h3 className="t-h2 mb-1 !text-[clamp(1.4rem,3vw,2.4rem)]">
              {e.role}
            </h3>
            <p className="t-label mb-6 text-iris">{e.org}</p>
            <p className="mb-8 max-w-prose leading-relaxed text-ink-soft">
              {e.blurb}
            </p>
            <ul className="flex flex-wrap gap-2">
              {e.tags.map((tag) => (
                <li
                  key={tag}
                  className="t-micro rounded-full border border-ink/20 px-3 py-1.5"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
