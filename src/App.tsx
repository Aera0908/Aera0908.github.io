import { useState, useEffect, useRef } from 'react'
import HeaderBar from './components/HeaderBar'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Journey from './components/Journey'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Portfolio from './components/Portfolio'
import SystemDesign from './components/SystemDesign'
import DeveloperPresence from './components/DeveloperPresence'
import Contact from './components/Contact'
import FloatingDownloadButton from './components/FloatingDownloadButton'
import PortfolioPage from './components/PortfolioPage'
import ProjectDetailPage from './components/ProjectDetailPage'
import { useRoute, SECTION_PATHS, PATH_TO_SECTION, replaceUrl } from './hooks/useRoute'

const SECTION_IDS = [
  'dashboard',
  'whoami',
  'edu',
  'journey',
  'stack',
  'certs',
  'projects',
  'designs',
  'presence',
  'comms',
] as const

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { route } = useRoute()
  const hasScrolledOnMount = useRef(false)

  const isPortfolioRoute =
    route.segments[0] === 'portfolio' || route.path === '/portfolio'
  const isProjectDetail = isPortfolioRoute && route.segments.length >= 2
  const projectId = isProjectDetail ? route.segments[1] : null

  // Deep-link: scroll to section on initial page load
  useEffect(() => {
    if (isPortfolioRoute || hasScrolledOnMount.current) return
    hasScrolledOnMount.current = true

    const sectionId = PATH_TO_SECTION[route.path]
    if (sectionId && sectionId !== 'dashboard') {
      // Small delay to ensure the DOM is ready
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll-spy: detect which section is in view and update URL
  useEffect(() => {
    if (isPortfolioRoute) return

    const handleScroll = () => {
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i])
        if (el && el.getBoundingClientRect().top < 200) {
          const newSection = SECTION_IDS[i]
          setActiveSection(newSection)
          // Sync URL with visible section
          const sectionPath = SECTION_PATHS[newSection]
          if (sectionPath) {
            replaceUrl(sectionPath)
          }
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPortfolioRoute])

  if (isProjectDetail && projectId) {
    return <ProjectDetailPage projectId={projectId} />
  }

  if (isPortfolioRoute) {
    return <PortfolioPage />
  }

  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid flex flex-col overflow-x-hidden pt-8">
      <HeaderBar />
      
      <div className="flex flex-1 relative min-w-0">
        <div className="lg:hidden fixed top-8 left-0 right-0 h-12 bg-cyber-gray/95 backdrop-blur border-b border-cyber-yellow/20 z-30 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-cyber-cyan hover:text-cyber-yellow transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-terminal text-sm text-cyber-yellow ml-2 tracking-wider">AIRA.SYS</span>
        </div>

        <Sidebar 
          activeSection={activeSection} 
          onNavigate={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 pt-20 lg:pt-0 min-h-screen min-w-0 w-full max-w-full overflow-x-hidden lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0 box-border">
          <Hero />
          <About />
          <Education />
          <Journey />
          <Skills />
          <Certifications />
          <Portfolio />
          <SystemDesign />
          <DeveloperPresence />
          <Contact />
        </div>

        <footer className="py-8 px-4 border-t border-cyber-yellow/10 bg-cyber-gray/30">
          <p className="font-terminal text-center text-xs text-cyber-cyan/50 tracking-wider">
            // {new Date().getFullYear()} AIRA YNTE // SYSTEM ONLINE
          </p>
        </footer>
        </main>
      </div>

      <FloatingDownloadButton />
    </div>
  )
}

export default App
