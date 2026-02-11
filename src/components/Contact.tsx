import { useState } from 'react'
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import ContactForm from './ContactForm'

const Contact = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const socialLinks = [
    {
      name: 'Email',
      value: '08airajosh@gmail.com',
      url: 'mailto:08airajosh@gmail.com',
      Icon: HiMail,
    },
    {
      name: 'LinkedIn',
      value: 'Aira Josh Ynte',
      url: 'https://linkedin.com/in/aira-josh-ynte-755353322',
      Icon: FaLinkedin,
    },
    {
      name: 'GitHub',
      value: '@Aera0908',
      url: 'https://github.com/Aera0908',
      Icon: FaGithub,
    },
    {
      name: 'Discord',
      value: 'aeradynamics',
      url: 'https://discord.com/users/aeradynamics',
      Icon: FaDiscord,
    },
  ]

  return (
    <section id="contact" className="py-16">
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; COMMS</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8">Contact</h2>
      <p className="text-slate-400 mb-8">Open to discussing new projects and opportunities.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {socialLinks.map((link, index) => {
          const Icon = link.Icon
          return (
            <a
              key={index}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="dashboard-card block group flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl group-hover:bg-white/10 transition-colors">
                <Icon className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-slate-500 mb-1">{link.name}</p>
                <p className="text-slate-100 font-medium group-hover:text-blue-400 transition-colors truncate">
                  {link.value}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      <div className="dashboard-card text-center">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">
          Internship Opportunities
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Actively seeking internship positions in digital systems, IC design, web development, and AI integration.
        </p>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary"
        >
          Send Message
        </button>
      </div>

      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  )
}

export default Contact
