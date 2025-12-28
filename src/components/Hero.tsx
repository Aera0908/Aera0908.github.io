import { useEffect, useState } from 'react'

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Profile Photo - Discord Style Avatar Frame */}
          <div className="mb-8 flex justify-center">
            <div className="relative group w-56 h-56 flex items-center justify-center">
              {/* Rotating outer ring with particles */}
              <div className="absolute inset-0 discord-frame-ring">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className="discord-particle absolute"
                    style={{
                      left: `${50 + 48 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                      top: `${50 + 48 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              {/* Animated gradient border */}
              <div className="absolute inset-4 discord-border rounded-full"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-6 rounded-full blur-xl bg-gradient-to-br from-red-500/40 via-purple-500/40 to-orange-500/40 animate-pulse"></div>
              
              {/* Inner decorative ring */}
              <div className="absolute inset-8 rounded-full border-2 border-red-400/30"></div>
              
              {/* Avatar image */}
              <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-red-500/50 shadow-2xl z-10"
                   style={{
                     boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(220, 38, 38, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.3)'
                   }}>
                <img
                  src={`${import.meta.env.BASE_URL}ynte_pic.jpg?v=2`}
                  alt="Aira Josh Ynte"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center center' }}
                  onError={(e) => {
                    console.error('Image failed to load');
                    e.currentTarget.src = 'https://via.placeholder.com/200';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Introduction */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Hello! I'm{' '}
            <br />
            <span className="gradient-text">Aira Josh Ynte</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-100 mb-6">
            Computer Engineering Student
          </p>
          
          <p className="text-lg text-gray-200 mb-4">
            Muntinlupa City, Metro Manila, Philippines
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="card inline-block">
              <p className="text-sm">
                IC Design
              </p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">
                Digital Systems
              </p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">
                Web Development
              </p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">
                AI Integration
              </p>
            </div>
          </div>

          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            Eager to apply technical skills in real-world projects through internship opportunities!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}Aira_Josh_Ynte_Resume.pdf`}
              download="Aira_Josh_Ynte_Resume.pdf"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
            <button
              onClick={() => scrollToSection('about')}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-red-600 hover:bg-red-600/20 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-red-600 hover:bg-red-600/20 transition-all duration-300 transform hover:scale-105"
            >
              Get in Touch
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce-slow">
            <svg
              className="w-6 h-6 mx-auto text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

