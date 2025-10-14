import { useState, useEffect } from 'react'

const FloatingDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
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
      className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <a
        href={`${import.meta.env.BASE_URL}Aira_Josh_Ynte_Resume.pdf`}
        download="Aira_Josh_Ynte_Resume.pdf"
        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded-full shadow-2xl hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-110 group"
        title="Download Resume"
      >
        <svg 
          className="w-6 h-6 group-hover:animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <span className="font-semibold hidden sm:inline">Download Resume</span>
      </a>
    </div>
  )
}

export default FloatingDownloadButton

