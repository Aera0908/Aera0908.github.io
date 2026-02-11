import { useState, useEffect } from 'react'
import HeaderBar from './components/HeaderBar'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import FloatingDownloadButton from './components/FloatingDownloadButton'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'skills', 'certifications', 'portfolio', 'contact']
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d] bg-grid-pattern flex flex-col">
      <HeaderBar />
      
      <div className="flex flex-1 relative">
        <div className="lg:hidden fixed top-8 left-0 right-0 h-12 bg-[#141414]/95 backdrop-blur border-b border-white/5 z-30 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-mono text-sm text-slate-400 ml-2">AIRA.SYS</span>
        </div>

        <Sidebar 
          activeSection={activeSection} 
          onNavigate={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 pt-20 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Hero />
          <About />
          <Education />
          <Skills />
          <Certifications />
          <Portfolio />
          <Contact />
        </div>

        <footer className="py-8 px-4 border-t border-white/5">
          <p className="font-mono text-center text-xs text-slate-500">
            {new Date().getFullYear()} Aira Josh Ynte
          </p>
        </footer>
        </main>
      </div>

      <FloatingDownloadButton />
    </div>
  )
}

export default App
