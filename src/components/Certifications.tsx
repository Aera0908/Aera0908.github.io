const Certifications = () => {
  const certificates = [
    {
      name: 'Zuitt Game Dev Certificate',
      issuer: 'Zuitt',
      description: 'Basic Web Development Workshop (June 15)',
      url: 'https://github.com/Aera0908/certificates/raw/main/Aira%20Josh%20C.%20Ynte%20Basic%20Web%20Development%20Workshop%20(June%2015)%20-%20Certificate%20of%20Participation%20(1).pdf',
      icon: '🎮',
      color: 'blue',
    },
    {
      name: 'Learn React Certificate',
      issuer: 'Scrimba',
      description: 'Comprehensive React.js course completion',
      url: 'https://github.com/Aera0908/certificates/raw/main/Learn%20React%20Certificate.pdf',
      icon: '⚛️',
      color: 'cyan',
    },
    {
      name: 'Learn TailwindCSS Certificate',
      issuer: 'Scrimba',
      description: 'Modern utility-first CSS framework mastery',
      url: 'https://github.com/Aera0908/certificates/raw/main/Learn%20Tailwind%20CSS.pdf',
      icon: '🎨',
      color: 'teal',
    },
    {
      name: 'The AI Engineer Path Certificate',
      issuer: 'Scrimba',
      description: 'AI integration and engineering fundamentals',
      url: 'https://github.com/Aera0908/certificates/raw/main/The%20AI%20Engineer%20Path.pdf',
      icon: '🤖',
      color: 'purple',
    },
  ]

  return (
    <section id="certifications" className="py-20 px-4 bg-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="gradient-text">📜 Certifications</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <a
              key={index}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group cursor-pointer animate-slide-up hover:scale-[1.03]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {cert.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-purple-400 mb-2">{cert.issuer}</p>
                  <p className="text-gray-400 text-sm mb-3">{cert.description}</p>
                  <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300">
                    <span>View Certificate</span>
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            💡 Continuously learning and expanding my skill set!
          </p>
        </div>
      </div>
    </section>
  )
}

export default Certifications

