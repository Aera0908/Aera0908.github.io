import { useState } from 'react'

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('https://formspree.io/f/xanplgbo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => {
          onClose()
          setStatus('idle')
        }, 2000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md cyber-card cyber-corner-brackets overflow-hidden border border-cyber-yellow/45">
        <div className="border-b border-cyber-yellow/15 p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-cyber-cyan hover:text-cyber-yellow rounded-none hover:bg-cyber-yellow/15 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="font-terminal text-sm text-cyber-magenta tracking-widest">SEND_MESSAGE.SYS</p>
          <h2 className="text-lg font-bold text-slate-100 mt-1 font-cyber tracking-wider">Contact</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block font-terminal text-xs text-cyber-cyan mb-2 tracking-widest">
              NAME
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/35 rounded-none text-slate-100 text-sm font-terminal placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-yellow/50 transition-colors focus:ring-1 focus:ring-cyber-yellow/30"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-terminal text-xs text-cyber-cyan mb-2 tracking-widest">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/35 rounded-none text-slate-100 text-sm font-terminal placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-yellow/50 transition-colors focus:ring-1 focus:ring-cyber-yellow/30"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block font-terminal text-xs text-cyber-cyan mb-2 tracking-widest">
              SUBJECT
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/35 rounded-none text-slate-100 text-sm font-terminal placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-yellow/50 transition-colors focus:ring-1 focus:ring-cyber-yellow/30"
              placeholder="Subject"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-terminal text-xs text-cyber-cyan mb-2 tracking-widest">
              MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cyber-dark/80 border border-cyber-cyan/35 rounded-none text-slate-100 text-sm font-terminal placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-yellow/50 transition-colors resize-none focus:ring-1 focus:ring-cyber-yellow/30"
              placeholder="Your message"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-cyber-green/5 border border-cyber-green/30 rounded-none text-cyber-green text-sm font-terminal uppercase tracking-wider">
              // Message sent successfully.
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-cyber-magenta/5 border border-cyber-magenta/30 rounded-none text-cyber-magenta text-sm font-terminal uppercase tracking-wider">
              // Something went wrong. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full cyber-btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
          >
            {status === 'loading' ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
