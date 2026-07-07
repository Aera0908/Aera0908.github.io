"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HoldToReveal } from "@/components/ui/HoldToReveal";

/* placeholder projects — swap for real builds */
const PROJECTS = [
  {
    index: "P-01",
    name: "NEXUS DASHBOARD",
    stack: "React / Node.js / WebSocket",
    summary:
      "Realtime fleet telemetry: 40k events/sec fanned out to live operator dashboards.",
    architecture: [
      "Node.js ingest workers → Redis Streams → WebSocket fan-out",
      "React + canvas charting, virtualized to 10k rows",
      "Postgres for cold storage, 30-day rollups via cron workers",
    ],
  },
  {
    index: "P-02",
    name: "MESH SENTINEL",
    stack: "ESP32 / C++ / LoRa / MQTT",
    summary:
      "Self-healing sensor mesh for off-grid environmental monitoring — 3 years on solar.",
    architecture: [
      "ESP32 nodes, FreeRTOS tasks for sampling + radio duty cycling",
      "LoRa mesh with store-and-forward; MQTT bridge at the gateway",
      "OTA firmware channel with A/B partitions and rollback",
    ],
  },
  {
    index: "P-03",
    name: "EDGE VISION",
    stack: "Python / PyTorch / TensorRT",
    summary:
      "On-device defect detection at 60fps on a Jetson — no cloud round-trip.",
    architecture: [
      "PyTorch training pipeline, quantization-aware from day one",
      "TensorRT engine, INT8, 11ms end-to-end inference",
      "Zero-copy camera → GPU path with GStreamer",
    ],
  },
];

/**
 * The vault: dark cards floating over the panel-grid particle formation.
 * Each card hides its architecture behind the KPR click-and-hold.
 */
export function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".proj-card", {
        y: 70,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={rootRef}
      className="relative z-10 px-6 py-[18vh] md:px-16"
    >
      <h2 className="t-h2 mb-4 text-paper">
        THE VAULT<span className="text-iris-bright">.</span>
      </h2>
      <p className="t-label mb-2 text-periwinkle/60">● 002 — SELECTED BUILDS</p>
      <p className="t-micro mb-16 text-signal">
        CLICK + HOLD A CARD TO DECRYPT ITS ARCHITECTURE
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {PROJECTS.map((p) => (
          <div
            key={p.index}
            className="proj-card card-notch border border-periwinkle/15 bg-world-2/80 p-7 text-periwinkle backdrop-blur-sm"
          >
            <HoldToReveal
              summary={
                <>
                  <span className="index-marker">● {p.index}</span>
                  <h3 className="t-h2 mt-4 mb-2 !text-[clamp(1.2rem,2.2vw,1.8rem)] text-paper">
                    {p.name}
                  </h3>
                  <p className="t-micro mb-4 text-iris-bright">{p.stack}</p>
                  <p className="text-sm leading-relaxed text-periwinkle/80">
                    {p.summary}
                  </p>
                </>
              }
              detail={
                <ul className="flex flex-col gap-2">
                  {p.architecture.map((line) => (
                    <li
                      key={line}
                      className="t-micro leading-relaxed text-periwinkle/90"
                    >
                      ▸ {line}
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
