import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface Certificate {
  name: string
  issuer: string
  description: string
  url: string
  downloadName?: string
}

const Certifications = () => {
  const certificates: Certificate[] = [
    {
      name: 'On-the-Job Training Certificate',
      issuer: 'Xinyx Design Engineering, Inc.',
      description: 'Completion of OJT engagement — hardware / electronics design exposure.',
      url: '/CERTIFICATE-PREVIEWS/YNTE-XINYX-OJT-CERTIFICATE.pdf',
      downloadName: 'YNTE-XINYX-OJT-CERTIFICATE.pdf',
    },
    {
      name: 'TINA DESIGN SUITE WORKSHOP',
      issuer: 'Hytec Power & Inc.',
      description: 'Workshop on the TINA circuit simulation and PCB design suite.',
      url: '/CERTIFICATE-PREVIEWS/YNTE-DESIGNSOFT-TINA.pdf',
      downloadName: 'YNTE-DESIGNSOFT-TINA.pdf',
    },
    {
      name: 'Understanding EDR: Protecting Endpoints Against Modern Threats',
      issuer: 'Cybersecurity Training',
      description: 'Endpoint Detection & Response (EDR) fundamentals and modern endpoint threat protection.',
      url: '/CERTIFICATE-PREVIEWS/YNTE%20-%20Understanding%20EDR%20Protecting%20Endpoints%20Against%20Modern%20Threats.pdf',
      downloadName: 'YNTE-Understanding-EDR.pdf',
    },
    {
      name: 'Zuitt Game Dev Certificate',
      issuer: 'Zuitt',
      description: 'Basic Web Development Workshop (June 15)',
      url: '/CERTIFICATE-PREVIEWS/Aira%20Josh%20C.%20Ynte%20Basic%20Web%20Development%20Workshop%20(June%2015)%20-%20Certificate%20of%20Participation%20(1).pdf',
      downloadName: 'YNTE-Zuitt-Basic-Web-Dev-Workshop.pdf',
    },
    {
      name: 'Learn React Certificate',
      issuer: 'Scrimba',
      description: 'Comprehensive React.js course completion',
      url: '/CERTIFICATE-PREVIEWS/Learn%20React%20Certificate.pdf',
      downloadName: 'YNTE-Scrimba-Learn-React.pdf',
    },
    {
      name: 'Learn TailwindCSS Certificate',
      issuer: 'Scrimba',
      description: 'Modern utility-first CSS framework mastery',
      url: '/CERTIFICATE-PREVIEWS/Learn%20Tailwind%20CSS.pdf',
      downloadName: 'YNTE-Scrimba-Learn-Tailwind-CSS.pdf',
    },
    {
      name: 'The AI Engineer Path Certificate',
      issuer: 'Scrimba',
      description: 'AI integration and engineering fundamentals',
      url: '/CERTIFICATE-PREVIEWS/The%20AI%20Engineer%20Path.pdf',
      downloadName: 'YNTE-Scrimba-AI-Engineer-Path.pdf',
    },
    {
      name: 'Blockchain4Youth Certificate',
      issuer: 'Bitget Blockchain4Youth',
      description: 'Certification in blockchain technology, smart contract development, and Web3 fundamentals.',
      url: '/CERTIFICATE-PREVIEWS/B4Y-Certificate-Aira-Josh-C.-Ynte.jpg',
      downloadName: 'B4Y-Certificate-Aira-Josh-C.-Ynte.jpg',
    },
  ]

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
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; CERTIFICATIONS</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Certifications</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((cert, index) => (
          <button
            key={index}
            onClick={() => setSelected(cert)}
            className="dashboard-card block text-left group focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-lg"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                {cert.name}
              </h3>
              <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono tracking-wider bg-white/5 text-slate-400 rounded border border-white/10 group-hover:text-blue-300 group-hover:border-blue-500/30 transition-colors">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                PREVIEW
              </span>
            </div>
            <p className="text-blue-400 text-sm mb-1">{cert.issuer}</p>
            <p className="text-slate-400 text-sm">{cert.description}</p>
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          <div
            className="relative w-full max-w-4xl h-[85vh] dashboard-card flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/5 mb-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-slate-500 tracking-wider mb-1">
                  CERTIFICATE PREVIEW
                </p>
                <h3 className="text-base md:text-lg font-semibold text-slate-100 truncate">
                  {selected.name}
                </h3>
                <p className="text-blue-400 text-sm truncate">{selected.issuer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selected.url}
                  download={selected.downloadName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/20"
                >
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
                  Download
                </a>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                  title="Open in new tab"
                >
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
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

            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/5 bg-slate-900/60 flex items-center justify-center">
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

            <p className="mt-3 font-mono text-[10px] text-slate-500 tracking-wider">
              PRESS ESC OR CLICK OUTSIDE TO CLOSE
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Certifications
