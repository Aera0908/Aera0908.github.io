import { useState, useEffect } from 'react'

const FloatingDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const base = import.meta.env.BASE_URL

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col gap-2 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <a
        href={`${base}YNTE_RESUME.pdf`}
        download="YNTE_RESUME.pdf"
        className="cyber-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-none text-xs shadow-lg shadow-cyber-yellow/10 border border-cyber-yellow"
        title="Download resume (PDF)"
      >
        Download Resume
      </a>
      <a
        href={`${base}YNTE_CV.pdf`}
        download="YNTE_CV.pdf"
        className="cyber-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 rounded-none text-xs shadow-lg shadow-cyber-cyan/10 border border-cyber-cyan"
        title="Download CV (PDF)"
      >
        Download CV
      </a>
    </div>
  )
}

export default FloatingDownloadButton
