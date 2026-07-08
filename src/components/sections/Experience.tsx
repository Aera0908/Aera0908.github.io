"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";

/* real history — sourced from the resume (see web_resume/src/data/journey.json) */
const ENTRIES = [
  {
    index: "001",
    role: "Lead Web3 & Full-Stack Developer",
    org: "FEHUVIA",
    period: "2026",
    blurb:
      "Architected an open-finance B2B treasury workstation on Morph L2 — Solidity billing clearance settling T+0 in under 2 seconds, a self-healing background gas faucet, an EVM listener daemon reconciling a dual-state PostgreSQL ledger, and a GPT-4o RAG co-pilot with OCR invoice parsing.",
    tags: ["Solidity", "Morph L2", "React 19", "Express", "PostgreSQL", "GPT-4o"],
  },
  {
    index: "002",
    role: "Lead Hardware & Software Engineer",
    org: "AEROVIT",
    period: "2024 — 2026",
    blurb:
      "Built a fitness-gamified smartwatch ecosystem — designed and brought up custom ESP32-S3 PCBs (QMI8658 IMU, MAX30102 heart-rate), a 33-landmark BlazePose pipeline with real-time rep and form state machines, and the AERO ERC-20 reward token on Ethereum Sepolia.",
    tags: ["ESP32-S3", "C++", "BLE 5.0", "MediaPipe", "Flutter", "Sepolia"],
  },
  {
    index: "003",
    role: "Freelance Web3 & Full-Stack Developer",
    org: "VARIOUS CLIENTS",
    period: "2023 — NOW",
    blurb:
      "Deliver custom Web2/Web3 dashboards and database systems — secure client-side signing with MetaMask (EIP-1193), highly optimized PostgreSQL schemas, and RESTful Express microservices with strict rate-limiting and audit logging.",
    tags: ["React", "Node.js", "Express", "Solidity", "PostgreSQL", "MetaMask"],
  },
  {
    index: "004",
    role: "IC Design Intern",
    org: "XINYX DESIGN",
    period: "OJT",
    blurb:
      "On-the-job training in integrated circuit design and peripheral verification — SystemVerilog RTL modeling and verification of an AMBA APB3 protocol implementation.",
    tags: ["SystemVerilog", "RTL", "AMBA APB3", "Verification", "Digital Logic"],
  },
  {
    index: "005",
    role: "B.S. Computer Engineering",
    org: "COLEGIO DE MUNTINLUPA",
    period: "2022 — 2026",
    blurb:
      "Specializing in embedded systems, systems design, and digital signal processing — Magna Cum Laude standing, expected July 2026. Research prototyping across microcontrollers, RTOS, and PCB layout, including a muscle bio-signal acquisition controller.",
    tags: ["Embedded Systems", "RTOS", "PCB", "DSP", "C/C++"],
  },
];

export function Experience({ entered }: { entered: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!entered) return;

    const section = rootRef.current;
    const cardsContainer = containerRef.current;
    if (!section || !cardsContainer) return;

    const ctx = gsap.context(() => {
      // Horizontal travel: translate the track until the LAST card's center
      // sits on the viewport center. rect.left minus the track's current x
      // gives the untransformed position (the flip rotation is origin-left,
      // so the card's left edge is stable); offsetWidth is layout width.
      const getScrollWidth = () => {
        const cards = cardsContainer.querySelectorAll<HTMLElement>(".xp-card");
        const last = cards[cards.length - 1];
        if (!last) return 0;
        const trackX = Number(gsap.getProperty(cardsContainer, "x")) || 0;
        const naturalLeft = last.getBoundingClientRect().left - trackX;
        return Math.max(
          0,
          naturalLeft + last.offsetWidth / 2 - window.innerWidth / 2,
        );
      };

      /**
       * Entrance — plays while the section scrolls INTO view (the viewport-
       * height of scroll where the collapsed Hero exits). The moonbase rises
       * from below the horizon and the header fades in, so there is never a
       * dead black gap between the white card collapsing and the Journey.
       */
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(hudState, {
          facilityY: -55.0,
          moonParallaxY: -55.0,
        }, {
          facilityY: 2.5, // Rest position of facility
          moonParallaxY: 1.5, // Rest position of moon horizon
          duration: 1.0,
          ease: "none",
        }, 0)
        .fromTo(".journey-header", {
          opacity: 0,
          y: 40,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "none",
        }, 0.55);

      // Pinned horizontal timeline — starts exactly when the entrance ends
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollWidth() + 1600}`, // dynamic duration
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Horizontal cards scroll
      tl.to(cardsContainer, {
        x: () => -getScrollWidth(),
        ease: "none",
        duration: 3.0,
      }, 0);

      // 2. Parallax camera pan on WebGL background (foreground pans faster
      // than the facility dome). Pans are centered — see hud-state.ts.
      tl.fromTo(hudState, {
        facilityX: 5.0,
        moonParallaxX: 22.5,
      }, {
        facilityX: -5.0, // Slower background pan
        moonParallaxX: -22.5, // Faster foreground pan
        ease: "none",
        duration: 3.0,
        immediateRender: false,
      }, 0);

      // 3. Card flips synced to position: every card flips in the moment it
      // reaches the middle-right slot (~58vw); the LAST card instead flips
      // as the track settles it onto the viewport center.
      const cards = gsap.utils.toArray<HTMLElement>(".xp-card");
      const travel = getScrollWidth();
      const trackX0 = Number(gsap.getProperty(cardsContainer, "x")) || 0;
      cards.forEach((card, idx) => {
        const isLast = idx === cards.length - 1;
        const naturalLeft = card.getBoundingClientRect().left - trackX0;
        const reach = isLast
          ? travel
          : Math.max(0, naturalLeft - window.innerWidth * 0.58);
        const startTime = (Math.min(reach, travel) / travel) * 3.0;
        tl.fromTo(card, {
          transformPerspective: 1200,
          rotationY: -75,
          scale: 0.86,
          opacity: 0,
          transformOrigin: "left center",
        }, {
          rotationY: 0,
          scale: 1.0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
        }, startTime);
      });
    }, rootRef);

    return () => ctx.revert();
  }, [entered]);

  useEffect(() => {
    if (!entered) return;

    // Delayed refresh & sort to let Hero.tsx settle
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 300);
    return () => clearTimeout(timer);
  }, [entered]);

  return (
    <section
      id="journey"
      ref={rootRef}
      className="relative z-10 h-screen w-screen overflow-hidden flex flex-col justify-center bg-transparent px-6 md:px-16"
    >
      {/* drifting mono coordinates */}
      <span
        className="t-micro absolute top-[8%] right-[8%] text-periwinkle/40"
      >
        SECTOR 02 // JOURNEY
      </span>

      <div className="journey-header opacity-0 max-w-2xl select-none">
        <h2 className="t-h2 mb-2 text-paper uppercase">
          THE JOURNEY<span className="text-iris-bright">.</span>
        </h2>
        <p className="t-label text-periwinkle/60">
          ● 001 — EXPERIENCE LOG
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex flex-row flex-nowrap gap-[8vw] pl-[58vw] pr-[50vw] mt-12 w-max items-center"
      >
        {ENTRIES.map((e) => (
          <article
            key={e.index}
            className="xp-card clip-bevel-br relative w-[80vw] max-w-[500px] flex-shrink-0 bg-paper p-8 text-ink md:p-12"
          >
            {/* journey-family line accents */}
            <span
              className="pointer-events-none absolute right-6 top-6 h-6 w-px bg-ink/25"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute bottom-8 left-8 h-px w-8 bg-ink/20"
              aria-hidden="true"
            />
            <div className="mb-6 flex items-baseline justify-between">
              <span className="index-marker">● {e.index}</span>
              <span className="t-micro text-ink-soft">{e.period}</span>
            </div>
            <h3 className="t-h2 mb-1 !text-[clamp(1.2rem,2.5vw,2.0rem)]">
              {e.role}
            </h3>
            <p className="t-label mb-6 text-iris">{e.org}</p>
            <p className="mb-8 max-w-prose leading-relaxed text-ink-soft text-[0.95rem]">
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
