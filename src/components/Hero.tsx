import { useEffect, useState } from 'react'
import ResumePreviewModal from './ResumePreviewModal'
import HologramAvatar from './HologramAvatar'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$*&*{}[];:<>'

const ScrambledText = ({ targetText, delay = 100, speed = 35 }: { targetText: string; delay?: number; speed?: number }) => {
  const [text, setText] = useState(() =>
    targetText.split('').map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])).join(''),
  )

  useEffect(() => {
    let timer: any
    let frame = 0
    const totalIterations = targetText.length * 3

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        let currentText = ''
        for (let i = 0; i < targetText.length; i++) {
          if (targetText[i] === ' ') {
            currentText += ' '
            continue
          }

          const revealIndex = Math.floor(frame / 3)
          if (i < revealIndex) {
            currentText += targetText[i]
          } else {
            currentText += chars[Math.floor(Math.random() * chars.length)]
          }
        }

        setText(currentText)
        frame++

        if (frame > totalIterations) {
          setText(targetText)
          clearInterval(timer)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timer) clearInterval(timer)
    }
  }, [targetText, delay, speed])

  return <span>{text}</span>
}

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [showGreenTint, setShowGreenTint] = useState(false)

  const resumeSrc = `${import.meta.env.BASE_URL}YNTE_RESUME.pdf`
  const cvSrc = `${import.meta.env.BASE_URL}YNTE_CV.pdf`

  useEffect(() => {
    setIsVisible(true)

    const base = import.meta.env.BASE_URL
    const audio = new Audio(`${base}sfx/entry-sfx.mp3`)
    audio.volume = 0.4
    audio.preload = 'auto'

    let hasStarted = false
    let sequenceTimer: any
    let endTimer: any

    const playFallback = () => {
      audio.play().then(() => {
        window.removeEventListener('click', playFallback)
        window.removeEventListener('touchstart', playFallback)
      }).catch((err) => {
        console.error('SFX play failed in fallback:', err)
      })
    }

    const triggerSequenceEffects = () => {
      setShowGreenTint(true)
      document.body.classList.add('sande-active')
      window.dispatchEvent(new CustomEvent('sandevistan-state', { detail: { active: true } }))

      endTimer = setTimeout(() => {
        setShowGreenTint(false)
        document.body.classList.remove('sande-active')
        window.dispatchEvent(new CustomEvent('sandevistan-state', { detail: { active: false } }))
      }, 3000)
    }

    const startSequence = () => {
      if (hasStarted) return
      hasStarted = true

      // Clean up start listeners
      cleanupListeners()

      if (sequenceTimer) clearTimeout(sequenceTimer)

      // Try playing the audio immediately
      audio.play().catch((err) => {
        console.warn('SFX autoplay blocked, registering gesture fallback during time stop:', err)
        window.addEventListener('click', playFallback)
        window.addEventListener('touchstart', playFallback)
      })

      // Always trigger visual effects
      triggerSequenceEffects()
    }

    const handleInteraction = () => {
      startSequence()
    }

    const cleanupListeners = () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('mousedown', handleInteraction)
    }

    // Auto-start in 1.2s
    sequenceTimer = setTimeout(() => {
      startSequence()
    }, 1200)

    // Interaction triggers sequence immediately
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    window.addEventListener('mousedown', handleInteraction)

    return () => {
      clearTimeout(sequenceTimer)
      if (endTimer) clearTimeout(endTimer)
      cleanupListeners()
      window.removeEventListener('click', playFallback)
      window.removeEventListener('touchstart', playFallback)
      document.body.classList.remove('sande-active')
      audio.pause()
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const emailHref =
    'mailto:08airajosh@gmail.com' +
    '?subject=' +
    encodeURIComponent('Engineering opportunity — Aira Ynte') +
    '&body=' +
    encodeURIComponent(
      'Hi Aira,\n\nI came across your portfolio and wanted to reach out about an opportunity.\n\n',
    )

  return (
    <section id="dashboard" className="min-h-[calc(100vh-5rem)] lg:min-h-screen flex flex-col justify-center px-4 sm:px-10 lg:px-16 py-12 lg:py-16 w-full min-w-0 max-w-full relative overflow-hidden">
      {showGreenTint && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-auto bg-[rgba(0,255,90,0.06)] shadow-[inset_0_0_120px_rgba(0,255,90,0.25)] cursor-not-allowed select-none"
        />
      )}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full min-w-0 max-w-full relative z-10">
        
        {/* Left column - Content */}
        <div
          className={`flex-1 transition-all duration-700 w-full min-w-0 max-w-full ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-5 inline-flex max-w-full flex-nowrap items-center gap-x-2 border border-cyber-cyan/40 bg-cyber-cyan/5 px-3 py-1.5 font-terminal text-[10px] sm:text-[11px] tracking-wider text-cyber-cyan leading-snug">
            <span className="relative shrink-0 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-green opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" />
            </span>
            <span className="min-w-0 whitespace-nowrap sm:hidden">OPEN TO SW/ARCH ROLES · MNL / REMOTE</span>
            <span className="hidden min-w-0 sm:inline">
              OPEN TO SOFTWARE ENGINEERING &amp; ARCHITECTURE ROLES · METRO MANILA / REMOTE
            </span>
          </div>

          <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; WHOAMI.INIT // ENTRY_POINT</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 mb-6 tracking-wide leading-none">
            Hello, I&apos;m <span className="text-cyber-yellow select-all relative inline-block whitespace-nowrap after:absolute after:bottom-2 after:left-0 after:right-0 after:h-2 lg:after:h-3 after:bg-cyber-yellow/20"><ScrambledText targetText="Aira Ynte" delay={200} /></span>.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-full sm:max-w-2xl lg:max-w-3xl break-words relative z-10">
            I am a{' '}
            <span className="font-semibold text-cyber-cyan font-cyber tracking-wide">Software Engineer &amp; System Architect</span>{' '}
            specializing in robust full-stack systems and hardware-firmware integration. Expected graduation: July 2026.
          </p>
          <div className="flex flex-wrap gap-2 mb-8 w-full max-w-full font-terminal">
            <span className="hashtag-tag text-cyber-yellow border border-cyber-yellow/30 bg-cyber-yellow/5">#ICDesign</span>
            <span className="hashtag-tag text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/5">#IoT</span>
            <span className="hashtag-tag text-cyber-magenta border border-cyber-magenta/30 bg-cyber-magenta/5">#AI</span>
            <span className="hashtag-tag text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/5">#Web2</span>
            <span className="hashtag-tag text-cyber-yellow border border-cyber-yellow/30 bg-cyber-yellow/5">#Web3</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="cyber-btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Resume/CV
            </button>
            <a
              href={emailHref}
              className="cyber-btn-secondary inline-flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto"
            >
              <svg className="w-4 h-4 text-cyber-cyan" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me
            </a>
            <a
              href="https://linkedin.com/in/aira-josh-ynte"
              target="_blank"
              rel="noopener noreferrer me"
              className="cyber-btn-outline inline-flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto"
            >
              <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .78 0 1.73v20.54C0 23.22.79 24 1.77 24h20.46c.98 0 1.77-.78 1.77-1.73V1.73C24 .78 23.21 0 22.23 0z" />
              </svg>
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => scrollToSection('whoami')}
              className="cyber-btn-outline w-full shrink-0 sm:w-auto text-center flex justify-center items-center"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right column - Hologram Avatar */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex justify-center items-center shrink-0 z-20">
          <HologramAvatar />
        </div>

      </div>

      <ResumePreviewModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        resumeSrc={resumeSrc}
        cvSrc={cvSrc}
      />
    </section>
  )
}

export default Hero
