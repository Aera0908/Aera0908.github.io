"use client";

import { useEffect, useState } from "react";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

export function ResumePreviewModal() {
  const [type, setType] = useState<"resume" | "cv" | null>(null);
  const { fx } = useHudAudio();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: "resume" | "cv" }>;
      setType(customEvent.detail.type);
    };
    window.addEventListener("open-resume-preview", handleOpen);
    return () => window.removeEventListener("open-resume-preview", handleOpen);
  }, []);

  // Freeze background page scroll while the preview is open. Ref-counted, so
  // closing this cannot release a lock another overlay still holds.
  useEffect(() => {
    if (!type) return;
    lockScroll();
    return () => unlockScroll();
  }, [type]);

  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fx.click();
        setType(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [type, fx]);

  if (!type) return null;

  const url = type === "resume" ? "/YNTE_RESUME.pdf" : "/YNTE_CV.pdf";
  const downloadName = type === "resume" ? "YNTE_RESUME.pdf" : "YNTE_CV.pdf";
  const title = type === "resume" ? "AIRA YNTE — RESUME" : "AIRA YNTE — CURRICULUM VITAE";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${type} preview`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050507]/90 backdrop-blur-md"
        onClick={() => {
          fx.click();
          setType(null);
        }}
      />

      {/* Cybernetic Solid Yellow Modal Container */}
      <div className="animate-zoom-in relative w-full max-w-4xl h-[92dvh] md:h-[85vh] border-2 border-[#0a0a0c] bg-signal rounded flex flex-col overflow-hidden font-mono shadow-[0_20px_50px_rgba(232,217,12,0.15)] z-10">
        
        {/* Tactical Crosshair / Corner Details */}
        <div className="absolute top-1 left-1 text-[8px] text-[#0a0a0c]/40 pointer-events-none select-none">┌ SEC_PREVIEW ┐</div>
        <div className="absolute bottom-1 left-1 text-[8px] text-[#0a0a0c]/40 pointer-events-none select-none">└ MODULE_AERA ┘</div>

        {/* Modal Header (Solid Black bar with solid yellow text) */}
        <div className="bg-[#0a0a0c] text-signal px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between text-xs font-black border-b-2 border-[#0a0a0c] select-none gap-2">
          <div className="flex min-w-0 items-center gap-2 truncate">
            <span className="w-2 h-2 shrink-0 rounded-full bg-signal animate-ping" />
            <span className="tracking-widest truncate text-[10px] sm:text-xs">{title}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href={url}
              download={downloadName}
              className="bg-signal text-[#0a0a0c] font-black px-2.5 sm:px-4 py-1.5 sm:py-2 border border-signal sm:border-2 hover:bg-transparent hover:text-signal transition-colors font-mono text-[8px] sm:text-[9px] tracking-wider sm:tracking-widest uppercase leading-none shadow-[0_4px_12px_rgba(232,217,12,0.25)] cursor-pointer shrink-0"
              onMouseEnter={fx.blip}
              onClick={fx.click}
            >
              [ DOWNLOAD PDF ]
            </a>
            <button
              onClick={() => {
                fx.click();
                setType(null);
              }}
              className="px-1.5 sm:px-2 py-1 text-signal hover:text-white transition-colors text-[10px] sm:text-xs font-mono font-bold cursor-pointer shrink-0"
              aria-label="Close preview"
            >
              [ESC] CLOSE
            </button>
          </div>
        </div>

        {/* Document Viewer Frame (Nested black-bordered iframe) */}
        <div className="flex-1 bg-[#121216] flex items-center justify-center overflow-hidden p-2 sm:p-4 relative border-l-2 sm:border-l-4 border-r-2 sm:border-r-4 border-b-2 sm:border-b-4 border-[#0a0a0c]">
          <iframe
            src={`${url}#toolbar=0&navpanes=0&view=FitH`}
            title={`${type} preview`}
            className="w-full h-full border-2 border-[#0a0a0c] bg-[#121216]"
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0a0a0c] text-signal/60 px-4 py-2 text-[8px] flex justify-between select-none border-t-2 border-[#0a0a0c]">
          <span>SECURE_VIEW: COMPLETED // SUCCESS</span>
          <span>AERA SECURE WORKSTATION v2.0 // DECRYPT_ENGINE_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
