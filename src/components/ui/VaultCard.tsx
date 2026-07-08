"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { gsap, EASE } from "@/lib/gsap";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

const HOLD_SECONDS = 0.6;
const RING_R = 14;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Collectible-style vault card (vault shape family: .clip-tab-tl).
 * Hold for 600ms → the card flips to its CASE FILE back face and the
 * router pushes to the full case study. Enter/Space skips the hold.
 */
export function VaultCard({
  index,
  name,
  stack,
  img,
  slug,
  summary,
}: {
  index: string;
  name: string;
  stack: string;
  img: string;
  slug: string;
  summary: string;
}) {
  const router = useRouter();
  const { fx } = useHudAudio();
  const flipRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const holdRef = useRef<gsap.core.Tween | null>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);
  const overlayBlackRef = useRef<HTMLDivElement>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [mounted, setMounted] = useState(false);
  // holds the card's screen rect once the open sequence starts (also gates
  // the body-portaled overlay that runs the cover→fullscreen→black flight)
  const [openRect, setOpenRect] = useState<DOMRect | null>(null);

  useEffect(() => setMounted(true), []);

  const unlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    fx.confirm();
    const el = flipRef.current;
    if (!el) {
      router.push(`/vault/archive/${slug}`);
      return;
    }
    // capture the card's on-screen box; the portal overlay flies from here
    setOpenRect(el.getBoundingClientRect());
  };

  /**
   * Open sequence (runs once the portal has mounted):
   * 1) the folder cover swings fully open,
   * 2) the cover image lifts off the card and flies forward to fill the
   *    whole viewport,
   * 3) it fades to solid black, then we navigate — the case page fades in
   *    from black on its own (CaseEnter), so the seam is invisible.
   */
  useEffect(() => {
    if (!openRect) return;
    const rect = openRect;
    const cover = flipRef.current?.querySelector<HTMLElement>(".vault-cover");
    const img = overlayImgRef.current;
    const black = overlayBlackRef.current;

    const tl = gsap.timeline({
      onComplete: () => router.push(`/vault/archive/${slug}`),
    });

    if (cover) {
      // kill the Tailwind hover transition so GSAP owns the transform cleanly
      tl.set(cover, { transition: "none", transformOrigin: "left center" }, 0);
      tl.to(cover, { rotateY: -168, duration: 0.42, ease: "power3.in" }, 0);
    }

    if (img) {
      gsap.set(img, {
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        opacity: 0,
      });
      tl.to(img, { opacity: 1, duration: 0.12, ease: "none" }, 0.3);
      tl.to(
        img,
        {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          duration: 0.62,
          ease: "power3.inOut",
        },
        0.34,
      );
    }

    if (black) {
      tl.to(black, { opacity: 1, duration: 0.42, ease: "power2.in" }, 0.9);
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRect]);

  useEffect(() => {
    const proxy = { p: 0 };
    holdRef.current = gsap.to(proxy, {
      p: 1,
      duration: HOLD_SECONDS,
      ease: EASE.cam,
      paused: true,
      onUpdate: () => {
        ringRef.current?.setAttribute(
          "stroke-dashoffset",
          String(RING_C * (1 - proxy.p)),
        );
      },
      onComplete: unlock,
    });
    return () => {
      holdRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      className="group relative block w-full text-left [perspective:1200px] focus-visible:outline-2"
      onPointerDown={() => !unlocking && holdRef.current?.timeScale(1).play()}
      onPointerUp={() => !unlocking && holdRef.current?.timeScale(2).reverse()}
      onPointerLeave={() => !unlocking && holdRef.current?.timeScale(2).reverse()}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          unlock();
        }
      }}
      onMouseEnter={fx.blip}
      aria-label={`${name} — hold to open case file`}
      style={{ touchAction: "manipulation", userSelect: "none" }}
    >
      <div
        ref={flipRef}
        className="relative aspect-[3/4] w-full transition-transform duration-500 group-hover:-translate-y-2 [transform-style:preserve-3d]"
      >
        {/* front face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d] [perspective:1000px]">
          {/* folder back */}
          <div className="clip-tab-tl absolute inset-0 bg-[#0c0d12] border border-periwinkle/15 group-hover:border-iris-bright group-hover:translate-x-3.5 transition-all duration-500 ease-out overflow-hidden">
             {/* yellow micro grid background */}
             <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(252,238,10,1)_1px,transparent_1px),linear-gradient(90deg,rgba(252,238,10,1)_1px,transparent_1px)] bg-[size:16px_16px]" />
             <span className="absolute top-2.5 right-4 font-mono text-[8px] tracking-[0.14em] text-iris/40">
               AERA_SECURE_ARCHIVE
             </span>
             {/* decorative circular radar / sonar */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-iris/5 rounded-full flex items-center justify-center">
               <div className="w-24 h-24 border border-iris/5 rounded-full border-dashed" />
             </div>
          </div>

          {/* inner document */}
          <div className="absolute inset-x-3.5 bottom-3.5 top-8 bg-paper text-ink p-4 flex flex-col justify-between transition-all duration-500 ease-out translate-y-3 group-hover:translate-y-0 group-hover:rotate-[-2deg] z-10 shadow-xl border border-black/10">
             <div className="flex justify-between items-start border-b border-ink/10 pb-2">
               <span className="font-mono text-[8px] font-bold text-ink-soft tracking-wider">DOSSIER // {index}</span>
               <span className="font-mono text-[7px] px-1 bg-ink text-paper font-bold leading-none py-0.5">TOP SECRET</span>
             </div>
             <div className="flex-grow pt-4 flex flex-col justify-between">
               <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase leading-tight text-ink tracking-tight">{name}</h4>
                   <p className="font-mono text-[8px] text-ink-soft leading-relaxed tracking-tight">{stack}</p>
               </div>
               <div className="border-t border-dashed border-ink/15 pt-2 mt-2">
                 <div className="flex justify-between font-mono text-[7px] text-ink-soft tracking-wider">
                   <span>SYS_STATUS: READY</span>
                   <span>LOC: MNL_SYS</span>
                 </div>
               </div>
             </div>
          </div>

          {/* folder front cover (opens like folder) */}
          <div className="vault-cover clip-tab-tl absolute inset-0 overflow-hidden border border-periwinkle/20 group-hover:border-iris-bright bg-world-2 flex flex-col justify-between transition-all duration-500 ease-out [transform-origin:left_center] group-hover:[transform:translateX(-14px)_rotateY(-15deg)] z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${name} cover`}
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-world via-world/45 to-transparent"
              aria-hidden="true"
            />
            {/* card lines — vault family accents */}
            <span
              className="pointer-events-none absolute right-4 top-7 h-8 w-px bg-iris-bright/50"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute left-4 top-7 t-micro text-periwinkle/70"
              aria-hidden="true"
            >
              ● {index}
            </span>

            <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2">
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-paper">
                {name}
              </h3>
              <p className="t-micro text-iris-bright">{stack}</p>
              <div className="mt-2 flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
                  <circle
                    cx="18"
                    cy="18"
                    r={RING_R}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    strokeWidth="1.5"
                  />
                  <circle
                    ref={ringRef}
                    cx="18"
                    cy="18"
                    r={RING_R}
                    fill="none"
                    stroke="var(--signal)"
                    strokeWidth="1.5"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C}
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span className="t-micro text-periwinkle/80">
                  HOLD TO OPEN CASE FILE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* back face */}
        <div className="clip-tab-tl absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-4 border border-iris-bright/40 bg-world-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="index-marker">● {index}</span>
          <span className="font-display text-xl font-black uppercase tracking-tight text-paper">
            {name}
          </span>
          <span className="t-micro animate-pulse text-iris-bright">
            ACCESSING CASE FILE ▸▸
          </span>
        </div>
      </div>

      {/* open sequence overlay — portaled to <body> so `fixed` escapes the
          transformed fan wrapper and truly covers the viewport */}
      {mounted &&
        openRect &&
        createPortal(
          <div className="fixed inset-0 z-[1000] pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={overlayImgRef} src={img} alt="" className="object-cover" />
            <div
              ref={overlayBlackRef}
              className="absolute inset-0 bg-black"
              style={{ opacity: 0 }}
            />
          </div>,
          document.body,
        )}
    </button>
  );
}
