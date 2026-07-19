"use client";

import { useState } from "react";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { CyberLines } from "@/components/ui/CyberLines";

type GalleryItem = {
  src: string;
  caption: string;
  type?: "image" | "video" | "youtube";
};

function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

export function CaseStudyGallery({ gallery, slug }: { gallery: GalleryItem[]; slug: string }) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const { fx } = useHudAudio();

  const handleOpen = (item: GalleryItem) => {
    setActiveItem(item);
    fx.click();
  };

  const handleClose = () => {
    setActiveItem(null);
    fx.deny();
  };

  return (
    <>
      <div className="mt-16 border-t border-periwinkle/15 pt-12">
        <p className="t-label mb-6 text-iris-bright font-mono tracking-widest uppercase">GALLERY & EVIDENCE FILES</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {gallery.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleOpen(item)}
              className="group relative overflow-hidden border border-periwinkle/15 bg-world-2 p-3 transition-colors duration-500 hover:border-iris-bright/40 cursor-pointer clip-tab-tl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center">
                {item.type === "video" || item.type === "youtube" ? (
                  <>
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        muted
                        playsInline
                        loop
                        autoPlay
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <img
                        src={`https://img.youtube.com/vi/${getYoutubeId(item.src)}/hqdefault.jpg`}
                        alt={item.caption}
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    {/* Play HUD overlay indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-500">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-iris-bright/60 bg-world/80 text-iris-bright backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-iris-bright group-hover:shadow-[0_0_15px_rgba(156,66,245,0.4)]">
                        <svg
                          className="h-6 w-6 fill-current ml-0.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-world/40 to-transparent" />
              </div>
              <p className="t-micro mt-4 leading-relaxed text-periwinkle/60 transition-colors duration-300 group-hover:text-periwinkle/95 font-mono">
                ■ {item.type === "video" ? "[ VIDEO DEMO ] " : item.type === "youtube" ? "[ YOUTUBE FEED ] " : ""}{item.caption.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      {activeItem && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-opacity duration-300 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden border border-periwinkle/25 bg-world p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] clip-tab-tl md:p-6 cursor-default animate-modal-enter"
          >
            {/* HUD border line-work inside modal */}
            <CyberLines tone="light" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-sm border border-periwinkle/20 bg-world-2 text-periwinkle transition-all duration-300 hover:border-iris-bright hover:text-iris-bright hover:shadow-[0_0_10px_rgba(156,66,245,0.3)]"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal header/meta */}
            <div className="mb-4 flex justify-between pr-14 t-micro text-periwinkle/40 font-mono">
              <span><span>● CASE FILE EVIDENCE // </span>{slug.toUpperCase()}</span>
              <span className="text-iris-bright">{activeItem.type === "youtube" ? "YOUTUBE BROADCAST" : activeItem.type === "video" ? "VIDEO FEED" : "IMAGE STILL"}</span>
            </div>

            {/* Media content */}
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black border border-periwinkle/10">
              {activeItem.type === "youtube" ? (
                <iframe
                  src={`${activeItem.src}?autoplay=1`}
                  title={activeItem.caption}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : activeItem.type === "video" ? (
                <video
                  src={activeItem.src}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={activeItem.src}
                  alt={activeItem.caption}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Caption */}
            <div className="mt-4 border-t border-periwinkle/10 pt-4">
              <p className="t-micro leading-relaxed text-periwinkle/80 font-mono">
                ■ {activeItem.caption.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
