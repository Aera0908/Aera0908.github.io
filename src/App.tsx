import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import SplineBackground from './components/SplineBackground'
import FloatingDownloadButton from './components/FloatingDownloadButton'

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Spline 3D Background */}
      <SplineBackground />

      <div className="relative z-10" style={{ pointerEvents: 'none' }}>
        <Navbar />
    
        <main>
          <Hero />
          <About />
          <Education />
          <Skills />
          <Certifications />
          <Contact />
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="text-gray-200">
            © {new Date().getFullYear()} Aira Josh Ynte. Built with React, TypeScript & TailwindCSS
          </p>
        </footer>
      </div>

      {/* Floating Download Button */}
      <FloatingDownloadButton />
    </div>
  )
}

export default App

