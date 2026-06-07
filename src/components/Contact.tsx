import { useState } from 'react'
import { FaLinkedin, FaGithub, FaDiscord, FaFacebook } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
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
      value: 'Aira Ynte',
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
      name: 'Twitter',
      value: 'Aera_W3',
      url: 'https://x.com/aera0908',
      Icon: FaXTwitter,
    },
    {
      name: 'Facebook',
      value: 'Aira Ynte',
      url: 'https://www.facebook.com/Smo.etti/',
      Icon: FaFacebook,
    },
    {
      name: 'Discord',
      value: 'aeradynamics',
      url: 'https://discord.com/users/aeradynamics',
      Icon: FaDiscord,
    },
  ]

  return (
    <section id="comms" className="py-16">
      <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; COMMS.SYS // SEND_RECV</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-8 tracking-wide cyber-glitch">Contact</h2>
      <p className="text-slate-400 mb-8 font-terminal">// Open to discussing new projects and opportunities.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {socialLinks.map((link, index) => {
          const Icon = link.Icon
          return (
            <a
              key={index}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="cyber-card cyber-corner-brackets block group flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-none bg-cyber-dark border border-cyber-cyan/30 flex items-center justify-center text-2xl text-cyber-cyan group-hover:bg-cyber-yellow/10 group-hover:border-cyber-yellow group-hover:text-cyber-yellow transition-all duration-300">
                <Icon />
              </div>
              <div className="min-w-0">
                <p className="font-terminal text-xs text-cyber-magenta/70 mb-1">{link.name}</p>
                <p className="text-slate-100 font-semibold group-hover:text-cyber-yellow transition-colors truncate font-cyber tracking-wide">
                  {link.value}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      <div className="cyber-card cyber-corner-brackets text-center border border-cyber-yellow/45">
        <h3 className="text-lg font-bold text-slate-100 mb-3 font-cyber tracking-wider">
          Engineering Opportunities
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Open to software engineering and system architecture roles in web development, database planning, and AI integration. Expected graduation: July 2026.
        </p>
        <button
          onClick={() => setIsFormOpen(true)}
          className="cyber-btn-primary"
        >
          Send Message
        </button>
      </div>

      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  )
}

export default Contact
