import { useEffect, useCallback, useRef, useState } from 'react'
import type { GalleryImage } from '../data/projectTypes'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface ProjectGalleryProps {
  items: GalleryImage[]
  /** When true (e.g. gallery inside another modal), do not toggle `document.body.style.overflow`. */
  nested?: boolean
}

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

/** Image/video grid: thumbnails open in a modal; videos never autoplay inline—only inside the modal. */
const ProjectGallery = ({ items, nested = false }: ProjectGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, openIndex !== null)

  const openItem = openIndex !== null ? items[openIndex] : null

  const close = useCallback(() => {
    setOpenIndex(null)
  }, [])

  useEffect(() => {
    if (openIndex === null) return

    if (!nested) {
      document.body.style.overflow = 'hidden'
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft' && openIndex > 0) setOpenIndex(openIndex - 1)
      if (e.key === 'ArrowRight' && openIndex < items.length - 1) setOpenIndex(openIndex + 1)
    }

    window.addEventListener('keydown', onKey)

    return () => {
      if (!nested) {
        document.body.style.overflow = 'unset'
      }
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, items.length, close, nested])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <figure key={i} className="space-y-2">
            {item.type === 'video' ? (
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative w-full overflow-hidden rounded-none bg-cyber-dark border border-cyber-cyan/35 hover:border-cyber-yellow transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-yellow/40"
                aria-label={`Play video: ${item.caption}`}
              >
                {getYoutubeId(item.src) ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(item.src)}/hqdefault.jpg`}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none w-full aspect-video object-cover opacity-90 transition group-hover:opacity-100"
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="pointer-events-none w-full aspect-video object-cover opacity-90 transition group-hover:opacity-100"
                    tabIndex={-1}
                  />
                )}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 transition group-hover:bg-black/55">
                  <span className="flex h-12 w-12 items-center justify-center rounded-none bg-cyber-yellow text-black shadow-lg transition group-hover:scale-105 group-hover:bg-cyber-cyan duration-300 border border-black">
                    <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group block w-full overflow-hidden rounded-none bg-cyber-dark border border-cyber-cyan/35 hover:border-cyber-yellow transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-yellow/40"
                aria-label={`Open image: ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt={item.caption || 'Project image'}
                  loading="lazy"
                  decoding="async"
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            )}
            <figcaption className="text-left text-xs leading-relaxed text-slate-400 font-terminal mt-1">{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      {openItem && openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={openItem.type === 'video' ? 'Video player' : 'Image preview'}
          ref={dialogRef}
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute inset-0 bg-cyber-dark/85 backdrop-blur-md"
            onClick={close}
            aria-label="Close gallery"
          />

          <div
            className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col gap-2 sm:gap-3 cyber-card cyber-corner-brackets border border-cyber-yellow/45 p-4 sm:p-6 bg-cyber-dark/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-cyber-yellow/15 mb-2">
              <p className="min-w-0 pr-2 text-sm text-slate-200 font-terminal">{openItem.caption}</p>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-none p-1 text-cyber-cyan hover:text-cyber-yellow hover:bg-cyber-yellow/15 transition-all duration-300"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => openIndex > 0 && setOpenIndex(openIndex - 1)}
                  disabled={openIndex === 0}
                  className="shrink-0 rounded-none border border-cyber-cyan/35 bg-cyber-dark p-2 text-cyber-cyan hover:text-cyber-yellow hover:border-cyber-yellow disabled:pointer-events-none disabled:opacity-30 transition-all duration-300"
                  aria-label="Previous item"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-none border border-cyber-cyan/35 bg-black shadow-2xl">
                {openItem.type === 'video' ? (
                  getYoutubeId(openItem.src) ? (
                    <iframe
                      key={openItem.src}
                      src={`https://www.youtube.com/embed/${getYoutubeId(openItem.src)}?autoplay=1`}
                      title={openItem.caption || "YouTube video player"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full bg-black max-h-[70vh] sm:max-h-[75vh]"
                    />
                  ) : (
                    <video
                      key={openItem.src}
                      src={openItem.src}
                      controls
                      playsInline
                      autoPlay
                      className="max-h-[70vh] w-full bg-black sm:max-h-[75vh]"
                    >
                      Your browser does not support embedded video.
                    </video>
                  )
                ) : (
                  <img
                    src={openItem.src}
                    alt={openItem.caption || 'Project image'}
                    decoding="async"
                    className="max-h-[70vh] w-full object-contain sm:max-h-[75vh] mx-auto"
                  />
                )}
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    openIndex < items.length - 1 && setOpenIndex(openIndex + 1)
                  }
                  disabled={openIndex >= items.length - 1}
                  className="shrink-0 rounded-none border border-cyber-cyan/35 bg-cyber-dark p-2 text-cyber-cyan hover:text-cyber-yellow hover:border-cyber-yellow disabled:pointer-events-none disabled:opacity-30 transition-all duration-300"
                  aria-label="Next item"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-center font-terminal text-[10px] text-cyber-magenta tracking-widest mt-2 uppercase">
              {items.length > 1 ? 'Use arrows or keyboard ← → · ' : ''}
              ESC TO CLOSE // SYSTEM_STABLE
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectGallery
