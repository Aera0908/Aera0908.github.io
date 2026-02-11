const Education = () => {
  const educationData = [
    {
      school: 'Colegio de Muntinlupa',
      degree: 'Bachelor of Science in Computer Engineering',
      period: '2022 – 2026 (Expected)',
      location: 'Muntinlupa City, Metro Manila, Philippines',
      progress: 'In Progress...',
      highlights: [
        'Digital electronics, circuit design, computer architecture',
        'Hardware assembly, robotics, system simulation',
        'CPE Challenge 2024 (Java Programming by ICpEP.se)',
        'School Clinic Web Booking System (DB, UI, backend)',
      ],
    },
    {
      school: 'Muntinlupa Science High School',
      degree: 'Senior & Junior High School',
      period: '2016 – 2022',
      location: 'Muntinlupa City, Metro Manila, Philippines',
      progress: 'Completed',
      highlights: [
        'Xepto Education website during work immersion',
        'Automotive robot (DRRR project)',
      ],
    },
  ]

  return (
    <section id="education" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; EDUCATION</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Education</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {educationData.map((edu, index) => (
          <div key={index} className="dashboard-card">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-100">{edu.school}</h3>
            </div>
            <p className="text-blue-400 font-medium mb-2">{edu.degree}</p>
            <p className="text-slate-400 text-sm mb-4">Specializing in Logic Design & Firmware</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: edu.progress === 'Completed' ? '100%' : '75%' }}
              />
            </div>
            <p className="font-mono text-xs text-slate-500 mb-4">{edu.progress}</p>
            <ul className="space-y-2 text-slate-400 text-sm">
              {edu.highlights.map((h, i) => (
                <li key={i}>– {h}</li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="dashboard-card md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-100">Current Status</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p><span className="text-slate-500">Focus:</span> <span className="text-slate-300">IC Design & Microcontrollers</span></p>
            <p><span className="text-slate-500">Learning:</span> <span className="text-slate-300">Machine Learning on Edge</span></p>
            <p><span className="text-slate-500">Availability:</span> <span className="text-green-400 font-medium">Open for Internships</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
