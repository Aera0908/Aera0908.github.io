import { useEffect, useCallback, useState } from 'react'
import type { GalleryImage } from '../data/projectTypes'

interface ProjectGalleryProps {
  items: GalleryImage[]
  /** When true (e.g. gallery inside another modal), do not toggle `document.body.style.overflow`. */
  nested?: boolean
}

/** Image/video grid: thumbnails open in a modal; videos never autoplay inline—only inside the modal. */
const ProjectGallery = ({ items, nested = false }: ProjectGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
                className="group relative w-full overflow-hidden rounded-lg bg-slate-900/40 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Play video: ${item.caption}`}
              >
                <video
                  src={item.src}
                  muted
                  playsInline
                  preload="metadata"
                  className="pointer-events-none w-full aspect-video object-cover opacity-90 transition group-hover:opacity-100"
                  tabIndex={-1}
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/45">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition group-hover:scale-105">
                    <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group block w-full overflow-hidden rounded-lg bg-slate-900/40 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Open image: ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt=""
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            )}
            <figcaption className="text-left text-xs leading-relaxed text-slate-400">{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      {openItem && openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={openItem.type === 'video' ? 'Video player' : 'Image preview'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={close}
            aria-label="Close gallery"
          />

          <div
            className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm text-slate-300">{openItem.caption}</p>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 shadow-2xl">
              {openItem.type === 'video' ? (
                <video
                  key={openItem.src}
                  src={openItem.src}
                  controls
                  playsInline
                  autoPlay
                  className="max-h-[75vh] w-full bg-black"
                >
                  Your browser does not support embedded video.
                </video>
              ) : (
                <img
                  src={openItem.src}
                  alt={openItem.caption}
                  className="max-h-[75vh] w-full object-contain"
                />
              )}
            </div>

            <p className="text-center font-mono text-[10px] text-slate-500">
              ← → to navigate · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectGallery
