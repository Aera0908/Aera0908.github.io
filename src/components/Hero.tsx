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
          {/* Profile Photo */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
              <div className="relative">
                <img
                  src={`${import.meta.env.BASE_URL}ynte_pic.jpg?v=2`}
                  alt="Aira Josh Ynte"
                  className="w-48 h-48 rounded-full object-cover border-4 border-red-900/40 shadow-2xl shadow-red-900/50"
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
            🎓 Computer Engineering Student
          </p>
          
          <p className="text-lg text-gray-200 mb-4">
            📍 Muntinlupa City, Philippines
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="card inline-block">
              <p className="text-sm">🔌 IC Design</p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">🔧 Digital Systems</p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">💻 Web Development</p>
            </div>
            <div className="card inline-block">
              <p className="text-sm">🤖 AI Integration</p>
            </div>
          </div>

          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            🚀 Eager to apply technical skills in real-world projects through internship opportunities!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollToSection('about')}
              className="btn-primary"
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

