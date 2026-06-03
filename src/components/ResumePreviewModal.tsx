import { useEffect, useRef } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface ResumePreviewModalProps {
  open: boolean
  onClose: () => void
  /** Public path to the Resume PDF */
  resumeSrc: string
  /** Public path to the CV PDF */
  cvSrc: string
}

const ResumePreviewModal = ({
  open,
  onClose,
  resumeSrc,
  cvSrc,
}: ResumePreviewModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef, open)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const DownloadIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
      />
    </svg>
  )

  const OpenIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14M5 5v14h14v-6" />
    </svg>
  )

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Resume and CV preview"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-7xl h-[90vh] dashboard-card flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/5 mb-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
              RESUME / CV PREVIEW
            </p>
            <h3 className="text-base md:text-lg font-semibold text-slate-100 truncate">
              Aira Ynte — Resume / CV
            </h3>
            <p className="text-blue-400 text-sm truncate">PDF · Software / Hardware Engineer (Expected Graduation: July 2026)</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Side-by-side PDF panels */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3">
          {/* Resume (Left) */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[10px] text-emerald-400 tracking-wider font-semibold">
                RESUME
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={resumeSrc}
                  download="YNTE_Resume.pdf"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors border border-blue-500/20"
                  title="Download Resume"
                >
                  <DownloadIcon />
                  Download
                </a>
                <a
                  href={resumeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-slate-500 text-slate-300 rounded-md hover:bg-white/5 transition-colors"
                  aria-label="Open resume in a new tab"
                  title="Open in new tab"
                >
                  <OpenIcon />
                  Open
                </a>
              </div>
            </div>
            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10 bg-slate-900/60">
              <object
                data={resumeSrc}
                type="application/pdf"
                aria-label="Resume PDF preview"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                  <p className="text-slate-300 text-sm">
                    Your browser can&apos;t display PDFs inline.
                  </p>
                  <a
                    href={resumeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Open Resume in new tab
                  </a>
                </div>
              </object>
            </div>
          </div>

          {/* CV (Right) */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[10px] text-violet-400 tracking-wider font-semibold">
                CURRICULUM VITAE
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={cvSrc}
                  download="YNTE_CV.pdf"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-600/20 text-emerald-400 rounded-md hover:bg-emerald-600/30 transition-colors border border-emerald-500/20"
                  title="Download CV"
                >
                  <DownloadIcon />
                  Download
                </a>
                <a
                  href={cvSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-slate-500 text-slate-300 rounded-md hover:bg-white/5 transition-colors"
                  aria-label="Open CV in a new tab"
                  title="Open in new tab"
                >
                  <OpenIcon />
                  Open
                </a>
              </div>
            </div>
            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10 bg-slate-900/60">
              <object
                data={cvSrc}
                type="application/pdf"
                aria-label="CV PDF preview"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                  <p className="text-slate-300 text-sm">
                    Your browser can&apos;t display PDFs inline.
                  </p>
                  <a
                    href={cvSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    Open CV in new tab
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>

        <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
          Esc to close
        </p>
      </div>
    </div>
  )
}

export default ResumePreviewModal
