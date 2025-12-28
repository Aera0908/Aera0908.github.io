import { IoSchool, IoCalendar, IoLocation } from 'react-icons/io5'
import { FaSchool, FaBook } from 'react-icons/fa'

const Education = () => {
  const educationData = [
    {
      icon: IoSchool,
      school: 'Colegio de Muntinlupa',
      degree: 'Bachelor of Science in Computer Engineering',
      period: '2022 – 2026 (Expected)',
      location: 'Muntinlupa City, Metro Manila, Philippines',
      highlights: [
        'Focused on digital electronics, circuit design, and computer architecture',
        'Experience in hardware assembly, robotics, and system simulation',
        'Participant in CPE Challenge 2024 (Java Programming by ICpEP.se)',
        'Developed a School Clinic Web Booking System (DB, UI, and backend integration)',
      ],
      color: 'red',
    },
    {
      icon: FaSchool,
      school: 'Muntinlupa Science High School',
      degree: 'Senior & Junior High School',
      period: '2016 – 2022',
      location: 'Muntinlupa City, Metro Manila, Philippines',
      highlights: [
        'Managed the Xepto Education website during work immersion',
        'Built and programmed an automotive robot (DRRR project)',
      ],
      color: 'orange',
    },
  ]

  return (
    <section id="education" className="py-20 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="gradient-text inline-flex items-center gap-2">
            <FaBook className="inline" />
            Education
          </span>
        </h2>

        <div className="space-y-8">
          {educationData.map((edu, index) => {
            const IconComponent = edu.icon
            return (
              <div
                key={index}
                className="card animate-slide-up hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="text-6xl text-red-400"><IconComponent /></div>
                
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 text-${edu.color}-400`}>
                    {edu.school}
                  </h3>
                  <p className="text-xl text-gray-100 mb-2">{edu.degree}</p>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-200">
                    <span className="flex items-center gap-1">
                      <IoCalendar className="inline" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <IoLocation className="inline" />
                      {edu.location}
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {edu.highlights.map((highlight, hIndex) => (
                      <li
                        key={hIndex}
                        className="flex items-start text-gray-100 group"
                      >
                        <span className={`mr-2 text-${edu.color}-400 group-hover:scale-125 transition-transform`}>
                          ▹
                        </span>
                        <span className="text-justify">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Education

