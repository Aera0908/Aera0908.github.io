"use client";

import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { decodePlayed, decodeTween, markDecodePlayed, scrambled } from "@/lib/decode";

/**
 * Heading text that decodes the first time it scrolls into view, once per
 * session. Screen readers get the real text from the sr-only twin; the
 * scrambling span is aria-hidden so they never announce the noise.
 */
export function DecodeText({
  text,
  className,
  start = "top 80%",
  trigger,
  duration = 0.7,
}: {
  text: string;
  className?: string;
  /** selector to trigger on instead of the text itself (e.g. a pinned section) */
  trigger?: string;
  /** ScrollTrigger start — later for headings whose section fades in late */
  start?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || decodePlayed(text)) return;

    el.textContent = scrambled(text);
    let tween: ReturnType<typeof decodeTween> | null = null;
    const st = ScrollTrigger.create({
      trigger: trigger ?? el,
      start,
      // active until the page end, so a deep link that jumps past the
      // heading still fires onEnter instead of leaving it scrambled
      end: () => ScrollTrigger.maxScroll(window),
      once: true,
      // measured after the pins above it, so pin spacing is accounted for
      refreshPriority: -1,
      onEnter: () => {
        markDecodePlayed(text);
        tween = decodeTween(el, { duration, text });
      },
    });

    return () => {
      st.kill();
      tween?.kill();
      el.textContent = text;
    };
  }, [text, start, trigger, duration]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
