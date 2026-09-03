"use client";

import { useState, useEffect } from "react";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function StickyDownloadButton() {
  const [visible, setVisible] = useState(false);
  const { fx } = useHudAudio();

  useEffect(() => {
    // scrollHeight + getElementById forced a layout flush on EVERY scroll
    // event, and Lenis emits one per frame. Both are cached and only refreshed
    // on resize / when the document actually changes size, and the handler is
    // rAF-throttled and passive.
    let docHeight = document.documentElement.scrollHeight;
    let winHeight = window.innerHeight;
    let hasContact = !!document.getElementById("contact");
    let queued = false;

    const remeasure = () => {
      docHeight = document.documentElement.scrollHeight;
      winHeight = window.innerHeight;
      hasContact = !!document.getElementById("contact");
    };

    const evaluate = () => {
      queued = false;
      const scrollY = window.scrollY;
      const isScrollPastThreshold = scrollY > 400;
      const isNearBottom = scrollY + winHeight >= docHeight - 120;
      setVisible(isScrollPastThreshold && !(hasContact && isNearBottom));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(evaluate);
    };

    // the one-pager's pinned sections change the document height well after
    // mount, so re-measure when the layout settles rather than only at t=0
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    evaluate();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-1.5 font-mono text-[9px] transition-all duration-500 select-none ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex gap-2 bg-world-2/95 border border-periwinkle/20 p-2 rounded-md shadow-2xl backdrop-blur-md">
        <button
          onClick={() => {
            fx.click();
            window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "resume" } }));
          }}
          className="px-3 py-1.5 rounded-xs border border-periwinkle/30 text-periwinkle hover:border-signal hover:text-signal hover:bg-signal/10 transition-all duration-200 tracking-wider font-bold cursor-pointer"
          onMouseEnter={fx.blip}
        >
          RESUME
        </button>
        <button
          onClick={() => {
            fx.click();
            window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { type: "cv" } }));
          }}
          className="px-3 py-1.5 rounded-xs border border-periwinkle/30 text-periwinkle hover:border-signal hover:text-signal hover:bg-signal/10 transition-all duration-200 tracking-wider font-bold cursor-pointer"
          onMouseEnter={fx.blip}
        >
          CV
        </button>
      </div>
      <span className="text-[8px] text-periwinkle/55 mr-1">SYS_UPLINK // DOWNLOAD</span>
    </div>
  );
}
