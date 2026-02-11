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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md dashboard-card overflow-hidden">
        <div className="border-b border-white/5 p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="font-mono text-sm text-slate-500">SEND_MESSAGE</p>
          <h2 className="text-lg font-semibold text-slate-100 mt-1">Contact</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block font-mono text-xs text-slate-500 mb-2">
              NAME
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-mono text-xs text-slate-500 mb-2">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block font-mono text-xs text-slate-500 mb-2">
              SUBJECT
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Subject"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-mono text-xs text-slate-500 mb-2">
              MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              placeholder="Your message"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              Message sent successfully.
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              Something went wrong. Please try again or email directly.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
          >
            {status === 'loading' ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
