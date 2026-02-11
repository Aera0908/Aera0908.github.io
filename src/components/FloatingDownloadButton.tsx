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

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <a
        href={`${import.meta.env.BASE_URL}YNTE_Resume.pdf`}
        download="YNTE_Resume.pdf"
        className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg font-mono transition-colors"
        title="Download Resume"
      >
        Download Resume
      </a>
    </div>
  )
}

export default FloatingDownloadButton
