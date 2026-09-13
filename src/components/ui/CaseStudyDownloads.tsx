"use client";

import { useState } from "react";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import type { CaseStudyDownload } from "@/lib/case-studies";

interface CaseStudyDownloadsProps {
  downloads: CaseStudyDownload[];
}

export function CaseStudyDownloads({ downloads }: CaseStudyDownloadsProps) {
  const { fx } = useHudAudio();
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = (item: CaseStudyDownload) => {
    fx.confirm();
    setDownloadingFile(item.filename);

    const link = document.createElement("a");
    link.href = item.href;
    link.download = item.filename;
    link.setAttribute("download", item.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFile((prev) => (prev === item.filename ? null : prev));
    }, 2500);
  };

  return (
    <div className="mb-10">
      <h2 className="t-h3 mb-4 text-paper">INSTALLER PACKAGES</h2>
      <div className="flex flex-wrap items-start gap-4">
        {downloads.map((item, idx) => {
          const isDownloading = downloadingFile === item.filename;
          const isPrimary = idx === 0;

          return (
            <div key={item.filename} className="flex flex-col gap-1.5">
              <Magnetic strength={0.3}>
                {isPrimary ? (
                  // Primary Button Design (Matching Hero.tsx VIEW RESUME)
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    onMouseEnter={fx.blip}
                    disabled={isDownloading}
                    aria-label={`Download ${item.name}`}
                    className="group relative overflow-hidden rounded-md border border-signal bg-signal px-5 py-2.5 font-mono text-[9px] font-black tracking-[0.14em] text-[#0c0d12] uppercase transition-all duration-300 hover:scale-105 hover:bg-[#fff024] hover:shadow-[0_0_20px_rgba(232,217,12,0.4)] cursor-pointer disabled:cursor-wait"
                  >
                    {/* Subtle shine sweep on hover */}
                    <span className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-500 ease-out z-0" />
                    <span className="relative z-10 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-[#0c0d12] ${
                          isDownloading ? "animate-ping" : ""
                        }`}
                      />
                      <span>
                        {isDownloading
                          ? "DOWNLOADING..."
                          : `DOWNLOAD ${item.format.toUpperCase()} (${item.size})`}
                      </span>
                    </span>
                  </button>
                ) : (
                  // Secondary Button Design (Matching Hero.tsx VIEW CV)
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    onMouseEnter={fx.blip}
                    disabled={isDownloading}
                    aria-label={`Download ${item.name}`}
                    className="group relative overflow-hidden rounded-md border border-periwinkle/35 bg-world-2/80 px-5 py-2.5 font-mono text-[9px] font-bold tracking-[0.14em] text-periwinkle uppercase backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-iris-bright hover:text-paper hover:bg-world-2 hover:shadow-[0_0_15px_rgba(252,238,10,0.15)] cursor-pointer disabled:cursor-wait"
                  >
                    {/* Sliding yellow background */}
                    <span className="absolute inset-0 bg-iris-bright/15 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                    <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                      <span
                        className={`h-1.5 w-1.5 rounded-full border border-current ${
                          isDownloading ? "bg-iris-bright animate-ping" : ""
                        }`}
                      />
                      <span>
                        {isDownloading
                          ? "DOWNLOADING..."
                          : `DOWNLOAD ${item.format.toUpperCase()} (${item.size})`}
                      </span>
                    </span>
                  </button>
                )}
              </Magnetic>

              {item.githubHref && (
                <a
                  href={item.githubHref}
                  download={item.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    fx.click();
                  }}
                  onMouseEnter={fx.blip}
                  className="font-mono text-[8px] tracking-wider text-periwinkle/45 hover:text-iris-bright transition-colors pl-1 uppercase"
                >
                  [ GITHUB MIRROR ↗ ]
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
