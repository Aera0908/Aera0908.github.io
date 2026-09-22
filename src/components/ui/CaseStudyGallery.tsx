"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHudAudio } from "@/components/providers/HudAudioProvider";
import { CyberLines } from "@/components/ui/CyberLines";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

type GalleryItem = {
  src: string;
  caption: string;
  type?: "image" | "video" | "youtube";
  poster?: string;
};

function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}

/**
 * The still shown in the grid. Never returns a media URL: a self-hosted clip
 * falls back to its own poster, and a YouTube item to the CDN thumbnail —
 * which needs a parseable id, so an unparseable URL yields null rather than
 * the broken `/vi//hqdefault.jpg` the old code silently produced.
 */
function thumbFor(item: GalleryItem): string | undefined {
  if (item.poster) return item.poster;
  if (item.type === "youtube") {
    const id = getYoutubeId(item.src);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
  }
  return undefined;
}

export function CaseStudyGallery({ gallery, slug }: { gallery: GalleryItem[]; slug: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? gallery[activeIndex] : null;
  const { fx } = useHudAudio();
  /** the tile that opened the lightbox, so focus can go back to it on close */
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleOpen = (index: number, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? null;
    setActiveIndex(index);
    fx.click();
  };

  const handleClose = () => {
    setActiveIndex(null);
    fx.deny();
    openerRef.current?.focus();
  };

  /* Escape closes, arrows navigate, and the page behind must not scroll while it is open. */
  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
      } else if (e.key === "ArrowLeft") {
        e.stopPropagation();
        setActiveIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : null));
        fx.blip();
      } else if (e.key === "ArrowRight") {
        e.stopPropagation();
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : null));
        fx.blip();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });

    lockScroll();
    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, gallery.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = touchStartXRef.current - e.changedTouches[0].clientX;
    if (delta > 45) {
      setActiveIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : null));
      fx.blip();
    } else if (delta < -45) {
      setActiveIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : null));
      fx.blip();
    }
    touchStartXRef.current = null;
  };

  return (
    <>
      <div className="mt-16 border-t border-periwinkle/15 pt-12">
        <p className="t-label mb-6 text-iris-bright font-mono tracking-widest uppercase">GALLERY & EVIDENCE FILES</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {gallery.map((item, idx) => {
            const thumb = thumbFor(item);
            return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`Open ${item.caption}`}
              onClick={(e) => handleOpen(idx, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpen(idx, e.currentTarget);
                }
              }}
              className="group relative overflow-hidden border border-periwinkle/15 bg-world-2 p-3 transition-colors duration-500 hover:border-iris-bright/40 cursor-pointer clip-tab-tl focus-visible:outline-2"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 flex items-center justify-center">
                {item.type === "video" || item.type === "youtube" ? (
                  <>
                    {/* Always a still in the grid — never the media itself. */}
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={item.caption}
                        loading="lazy"
                        decoding="async"
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
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-world/40 to-transparent" />
              </div>
              <p className="t-micro mt-4 leading-relaxed text-periwinkle/60 transition-colors duration-300 group-hover:text-periwinkle font-mono">
                ■ {item.type === "video" ? "[ VIDEO DEMO ] " : item.type === "youtube" ? "[ YOUTUBE FEED ] " : ""}{item.caption.toUpperCase()}
              </p>
            </div>
            );
          })}
        </div>
      </div>

      {/* Modal Lightbox — full-screen edge-to-edge on mobile, cyber card frame on desktop */}
      {activeItem &&
        activeIndex !== null &&
        createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption}
          tabIndex={-1}
          onClick={handleClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 md:bg-black/95 p-0 md:p-4 backdrop-blur-md transition-opacity duration-300 cursor-zoom-out focus:outline-none select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-[100dvh] md:h-auto md:max-w-5xl flex flex-col justify-between overflow-hidden border-0 md:border border-periwinkle/25 bg-black md:bg-world p-3 md:p-6 shadow-none md:shadow-[0_0_30px_rgba(0,0,0,0.8)] clip-none md:clip-tab-tl cursor-default animate-modal-enter"
          >
            {/* HUD border line-work inside modal (desktop only) */}
            <div className="hidden md:block">
              <CyberLines tone="light" />
            </div>

            {/* Modal header/meta */}
            <div className="relative z-10 mb-2 flex items-center justify-between border-b border-periwinkle/15 pb-2.5 text-[10px] text-periwinkle/70 font-mono">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="h-2 w-2 rounded-full bg-signal shrink-0 animate-ping" />
                <span className="font-bold text-paper truncate">EVIDENCE // {slug.toUpperCase()}</span>
                <span className="text-iris-bright hidden sm:inline">[{activeItem.type === "youtube" ? "YOUTUBE BROADCAST" : activeItem.type === "video" ? "VIDEO FEED" : "IMAGE STILL"}]</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-iris-bright font-mono text-[10px]">
                  {activeIndex + 1} / {gallery.length}
                </span>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-xs border border-periwinkle/30 bg-world-2 text-paper hover:border-iris-bright hover:text-iris-bright transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Media content — adaptive to maximize viewport on mobile without forced 16:9 */}
            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden bg-black/60 my-auto rounded-xs">
              {activeItem.type === "youtube" ? (
                <div className="relative aspect-video w-full max-h-[78dvh] overflow-hidden">
                  <iframe
                    src={`${activeItem.src}?autoplay=1`}
                    title={activeItem.caption}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : activeItem.type === "video" ? (
                <video
                  src={activeItem.src}
                  poster={activeItem.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="max-h-[78dvh] max-w-full w-auto h-auto object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeItem.src}
                  alt={activeItem.caption}
                  className="max-h-[78dvh] max-w-full w-auto h-auto object-contain transition-transform duration-300"
                />
              )}

              {/* Prev / Next buttons */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fx.blip();
                      setActiveIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0));
                    }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/70 border border-periwinkle/25 text-paper hover:border-iris-bright hover:text-iris-bright transition-all backdrop-blur-sm cursor-pointer"
                    aria-label="Previous image"
                  >
                    <span className="text-lg md:text-xl font-bold">‹</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fx.blip();
                      setActiveIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0));
                    }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/70 border border-periwinkle/25 text-paper hover:border-iris-bright hover:text-iris-bright transition-all backdrop-blur-sm cursor-pointer"
                    aria-label="Next image"
                  >
                    <span className="text-lg md:text-xl font-bold">›</span>
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            <div className="relative z-10 border-t border-periwinkle/15 pt-2.5 mt-2 bg-world/90 md:bg-transparent px-1">
              <p className="t-micro leading-relaxed text-periwinkle/85 font-mono line-clamp-2 md:line-clamp-none">
                ■ {activeItem.caption.toUpperCase()}
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
