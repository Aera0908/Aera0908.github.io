"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

const HOLD_SECONDS = 0.6;
const RING_R = 14;
const RING_C = 2 * Math.PI * RING_R;

/**
 * KPR "click and hold" interaction: press for 600ms to unlock the
 * detail block; releasing early rewinds at 2× speed. Keyboard users
 * toggle instantly with Enter/Space (the hold is pure flavor).
 */
export function HoldToReveal({
  summary,
  detail,
  holdLabel = "HOLD TO DECRYPT",
}: {
  summary: ReactNode;
  detail: ReactNode;
  holdLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const { fx } = useHudAudio();

  useEffect(() => {
    const proxy = { p: 0 };
    tweenRef.current = gsap.to(proxy, {
      p: 1,
      duration: HOLD_SECONDS,
      ease: EASE.cam, // linear fill; scrub-like honesty
      paused: true,
      onUpdate: () => {
        ringRef.current?.setAttribute(
          "stroke-dashoffset",
          String(RING_C * (1 - proxy.p)),
        );
      },
      onComplete: () => setOpen(true),
    });
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (open) fx.confirm();
  }, [open, fx]);

  const press = () => {
    if (!open) tweenRef.current?.timeScale(1).play();
  };
  const release = () => {
    if (!open) tweenRef.current?.timeScale(2).reverse();
  };

  return (
    <div className="flex h-full flex-col">
      {summary}

      {!open ? (
        <button
          className="mt-6 flex items-center gap-3 self-start"
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={release}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          onMouseEnter={fx.blip}
          aria-expanded={false}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18"
              cy="18"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
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
          <span className="t-micro">{holdLabel}</span>
        </button>
      ) : (
        <div className="mt-6 border-t border-current/15 pt-4">
          {detail}
          <button
            className="t-micro mt-4 underline underline-offset-4 opacity-60"
            onClick={() => {
              fx.click();
              setOpen(false);
              tweenRef.current?.progress(0).pause();
            }}
          >
            CLOSE
          </button>
        </div>
      )}
    </div>
  );
}
