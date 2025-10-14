import { FaLinkedin, FaInstagram, FaGithub, FaDiscord } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

const Contact = () => {
  const socialLinks = [
    {
      name: 'Email',
      username: '08airajosh@gmail.com',
      url: 'mailto:08airajosh@gmail.com',
      icon: HiMail,
      color: 'red',
      bgColor: 'bg-red-500',
    },
    {
      name: 'LinkedIn',
      username: 'Aira Josh Ynte',
      url: 'https://linkedin.com/in/aira-josh-ynte-755353322',
      icon: FaLinkedin,
      color: 'blue',
      bgColor: 'bg-blue-600',
    },
    {
      name: 'Instagram',
      username: '@Aera0908',
      url: 'https://instagram.com/Aera0908',
      icon: FaInstagram,
      color: 'pink',
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    },
    {
      name: 'GitHub',
      username: '@Aera0908',
      url: 'https://github.com/Aera0908',
      icon: FaGithub,
      color: 'gray',
      bgColor: 'bg-gray-800',
    },
    {
      name: 'Discord',
      username: 'aeradynamics',
      url: 'https://discord.com/users/aeradynamics',
      icon: FaDiscord,
      color: 'indigo',
      bgColor: 'bg-indigo-600',
    },
  ]

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          <span className="gradient-text">📬 Get in Touch</span>
        </h2>
        
        <p className="text-xl text-center text-gray-100 mb-12 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions!
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group text-center animate-slide-up hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`${link.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="text-4xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{link.name}</h3>
                <p className="text-gray-200 text-sm break-words px-2">{link.username}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-blue-400 text-sm">Click to connect →</span>
                </div>
              </a>
            )
          })}
        </div>

        {/* Social Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="https://instagram.com/Aera0908" target="_blank" rel="noopener noreferrer">
            <img
              src="https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white"
              alt="Instagram"
              className="tech-badge"
            />
          </a>
          <a href="https://linkedin.com/in/aira-josh-ynte-755353322" target="_blank" rel="noopener noreferrer">
            <img
              src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white"
              alt="LinkedIn"
              className="tech-badge"
            />
          </a>
          <a href="mailto:08airajosh@gmail.com">
            <img
              src="https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white"
              alt="Email"
              className="tech-badge"
            />
          </a>
          <a href="https://github.com/Aera0908" target="_blank" rel="noopener noreferrer">
            <img
              src="https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white"
              alt="GitHub"
              className="tech-badge"
            />
          </a>
          <a href="https://discord.com/users/aeradynamics" target="_blank" rel="noopener noreferrer">
            <img
              src="https://img.shields.io/badge/Discord-%235865F2.svg?logo=discord&logoColor=white"
              alt="Discord"
              className="tech-badge"
            />
          </a>
        </div>

        {/* Call to Action */}
        <div className="mt-16 card text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            🚀 Looking for Internship Opportunities!
          </h3>
          <p className="text-gray-100 mb-6">
            I'm actively seeking internship positions where I can contribute my skills in 
            digital systems, IC design, web development, and AI integration while continuing to learn and grow.
          </p>
          <a
            href="mailto:08airajosh@gmail.com"
            className="btn-primary inline-block"
          >
            📩 Send me an email
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
