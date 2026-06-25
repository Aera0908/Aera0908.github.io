import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { routeTo } from '../hooks/useRoute'
import { certificatesData, Certificate } from '../data/certificates'

const Certifications = () => {
  const featuredCertificates = certificatesData.filter((cert) => cert.featured)

  const [selected, setSelected] = useState<Certificate | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, selected !== null)

  useEffect(() => {
    if (!selected) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  return (
    <section id="certs" className="py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-terminal text-sm text-cyber-magenta mb-2 tracking-widest">&gt; CERTIFICATIONS.DB // INDEX</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-50 tracking-wide cyber-glitch">Featured Certifications</h2>
        </div>
        <button
          onClick={() => routeTo('/certificates')}
          className="cyber-btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-none border-cyber-cyan/45 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-yellow hover:text-cyber-yellow"
        >
          View all certificates
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {featuredCertificates.map((cert, index) => (
          <button
            key={index}
            onClick={() => setSelected(cert)}
            className="cyber-card cyber-corner-brackets block text-left group focus:outline-none focus:ring-2 focus:ring-cyber-yellow/40"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-[13px] md:text-sm font-bold text-slate-100 group-hover:text-cyber-yellow transition-colors font-cyber tracking-wide line-clamp-2 min-h-[2.5rem]">
                {cert.name}
              </h3>
              <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-terminal tracking-wider bg-cyber-cyan/5 text-cyber-cyan border border-cyber-cyan/25 group-hover:text-cyber-yellow group-hover:border-cyber-yellow/45 transition-colors">
                PREVIEW
              </span>
            </div>
            <p className="text-cyber-cyan font-bold font-cyber text-xs mb-1 truncate">{cert.issuer}</p>
            <p className="text-slate-400 text-xs line-clamp-2">{cert.description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} preview`}
          ref={dialogRef}
          tabIndex={-1}
        >
          <div
            className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          />

          <div
            className="relative w-full max-w-4xl h-[85vh] cyber-card cyber-corner-brackets border border-cyber-yellow/45 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-cyber-yellow/15 mb-3">
              <div className="min-w-0">
                <p className="font-terminal text-[10px] text-cyber-magenta tracking-widest mb-1">
                  CERTIFICATE PREVIEW
                </p>
                <h3 className="text-base md:text-lg font-bold text-slate-100 truncate font-cyber">
                  {selected.name}
                </h3>
                <p className="text-cyber-cyan text-sm truncate font-cyber font-bold">{selected.issuer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selected.url}
                  download={selected.downloadName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                    />
                  </svg>
                  Download
                </a>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex cyber-btn-outline items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-none"
                  title="Open in new tab"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 text-cyber-cyan hover:text-cyber-yellow rounded-none hover:bg-cyber-yellow/15 transition-colors"
                  aria-label="Close preview"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 rounded-none overflow-hidden border border-cyber-cyan/35 bg-cyber-dark flex items-center justify-center">
              {selected.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <img
                  src={selected.url}
                  alt={`${selected.name} preview`}
                  className="max-w-full max-h-full object-contain p-2"
                />
              ) : (
                <iframe
                  src={`${selected.url}#toolbar=0&navpanes=0&view=FitH`}
                  title={`${selected.name} preview`}
                  className="w-full h-full border-0"
                />
              )}
            </div>

            <p className="mt-3 font-terminal text-[10px] text-cyber-magenta/70 tracking-widest uppercase">
              // PRESS ESC OR CLICK OUTSIDE TO CLOSE // SYSTEM_READY
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Certifications
