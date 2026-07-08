"use client";

import { useState, useEffect } from "react";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function StickyDownloadButton() {
  const [visible, setVisible] = useState(false);
  const { fx } = useHudAudio();

  useEffect(() => {
    const toggle = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-1.5 font-mono text-[9px] transition-all duration-500 select-none ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex gap-2 bg-world-2/95 border border-periwinkle/20 p-2 rounded shadow-2xl backdrop-blur-md">
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
      <span className="text-[8px] text-periwinkle/30 mr-1">SYS_UPLINK // DOWNLOAD</span>
    </div>
  );
}
