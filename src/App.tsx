import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Navbar from './components/Navbar'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/10">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Aira Josh Ynte. Built with React, TypeScript & TailwindCSS
        </p>
      </footer>
    </div>
  )
}

export default App

