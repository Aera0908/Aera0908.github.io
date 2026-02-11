const Certifications = () => {
  const certificates = [
    {
      name: 'Zuitt Game Dev Certificate',
      issuer: 'Zuitt',
      description: 'Basic Web Development Workshop (June 15)',
      url: 'https://github.com/Aera0908/certificates/raw/main/Aira%20Josh%20C.%20Ynte%20Basic%20Web%20Development%20Workshop%20(June%2015)%20-%20Certificate%20of%20Participation%20(1).pdf',
    },
    {
      name: 'Learn React Certificate',
      issuer: 'Scrimba',
      description: 'Comprehensive React.js course completion',
      url: 'https://github.com/Aera0908/certificates/raw/main/Learn%20React%20Certificate.pdf',
    },
    {
      name: 'Learn TailwindCSS Certificate',
      issuer: 'Scrimba',
      description: 'Modern utility-first CSS framework mastery',
      url: 'https://github.com/Aera0908/certificates/raw/main/Learn%20Tailwind%20CSS.pdf',
    },
    {
      name: 'The AI Engineer Path Certificate',
      issuer: 'Scrimba',
      description: 'AI integration and engineering fundamentals',
      url: 'https://github.com/Aera0908/certificates/raw/main/The%20AI%20Engineer%20Path.pdf',
    },
  ]

  return (
    <section id="certifications" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; CERTIFICATIONS</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Certifications</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map((cert, index) => (
          <a
            key={index}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="dashboard-card block group"
          >
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-1">
              {cert.name}
            </h3>
            <p className="text-blue-400 text-sm mb-1">{cert.issuer}</p>
            <p className="text-slate-400 text-sm">{cert.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Certifications
