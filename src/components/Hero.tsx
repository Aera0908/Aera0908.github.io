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
    <section id="home" className="py-12 lg:py-16">
      <div
        className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="font-mono text-sm text-slate-500 mb-4">&gt; WHOAMI</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50 mb-4">
          Hello, I&apos;m <span className="text-violet-400">Aira</span>.
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
          I am a{' '}
          <span className="font-semibold text-blue-400">Computer Engineering Student</span>{' '}
          bridging the gap between hardware and software. I build systems that think, interact, and solve real-world problems.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="hashtag-tag text-blue-400 border border-blue-500/40 bg-blue-500/10">
            #ICDesign
          </span>
          <span className="hashtag-tag text-violet-400 border border-violet-500/40 bg-violet-500/10">
            #IoT
          </span>
          <span className="hashtag-tag text-green-400 border border-green-500/40 bg-green-500/10">
            #SoftwareDev
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`${import.meta.env.BASE_URL}YNTE_Resume.pdf`}
            download="YNTE_Resume.pdf"
            className="btn-primary"
          >
            Download Resume
          </a>
          <button
            onClick={() => scrollToSection('about')}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-500 text-slate-300 hover:bg-white/5 transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-slate-500 text-slate-300 hover:bg-white/5 transition-colors"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
