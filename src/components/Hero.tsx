import { useEffect, useState } from 'react'
import ResumePreviewModal from './ResumePreviewModal'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const resumeSrc = `${import.meta.env.BASE_URL}YNTE_Resume.pdf`

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const emailHref =
    'mailto:08airajosh@gmail.com' +
    '?subject=' +
    encodeURIComponent('Internship inquiry — Aira Ynte') +
    '&body=' +
    encodeURIComponent(
      'Hi Aira,\n\nI came across your portfolio and wanted to reach out about an opportunity.\n\n',
    )

  return (
    <section id="home" className="py-12 lg:py-16 w-full min-w-0 max-w-full">
      <div
        className={`transition-all duration-700 w-full min-w-0 max-w-full ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-wider text-emerald-300 leading-snug">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          OPEN TO INTERNSHIPS · METRO MANILA / REMOTE
        </div>

        <p className="font-mono text-sm text-slate-500 mb-4">&gt; WHOAMI</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 mb-4 break-words text-balance">
          Hello, I&apos;m <span className="text-violet-400">Aira Ynte</span>.
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 max-w-full sm:max-w-2xl break-words">
          I am a{' '}
          <span className="font-semibold text-blue-400">Computer Engineering Student</span>{' '}
          bridging the gap between hardware and software. I build systems that think, interact, and solve real-world problems.
        </p>
        <div className="flex flex-wrap gap-2 mb-8 w-full max-w-full">
          <span className="hashtag-tag text-blue-400 border border-blue-500/40 bg-blue-500/10">#ICDesign</span>
          <span className="hashtag-tag text-violet-400 border border-violet-500/40 bg-violet-500/10">#IoT</span>
          <span className="hashtag-tag text-cyan-400 border border-cyan-500/40 bg-cyan-500/10">#AI</span>
          <span className="hashtag-tag text-sky-400 border border-sky-500/40 bg-sky-500/10">#Web2</span>
          <span className="hashtag-tag text-fuchsia-400 border border-fuchsia-500/40 bg-fuchsia-500/10">#Web3</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Resume
          </button>
          <a
            href={resumeSrc}
            download="YNTE_Resume.pdf"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-500 text-slate-300 hover:bg-white/5 transition-colors sm:w-auto"
            title="Download resume as PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download
          </a>
          <a
            href={emailHref}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-blue-600/15 border border-blue-500/40 text-blue-300 hover:bg-blue-600/25 transition-colors sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Me
          </a>
          <a
            href="https://linkedin.com/in/aira-josh-ynte-755353322"
            target="_blank"
            rel="noopener noreferrer me"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-500 text-slate-300 hover:bg-white/5 transition-colors sm:w-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .78 0 1.73v20.54C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.73V1.73C24 .78 23.21 0 22.23 0z" />
            </svg>
            LinkedIn
          </a>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="w-full shrink-0 px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-500 text-slate-300 hover:bg-white/5 transition-colors sm:w-auto"
          >
            Learn More
          </button>
        </div>
      </div>

      <ResumePreviewModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        src={resumeSrc}
        downloadName="YNTE_Resume.pdf"
      />
    </section>
  )
}

export default Hero
