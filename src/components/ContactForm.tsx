import { useState } from 'react'
import { HiX } from 'react-icons/hi'

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
      // Using Formspree - you'll need to create an account at formspree.io
      // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-red-900/30 animate-slide-up overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="relative border-b border-red-900/30 p-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold gradient-text">📧 Get in Touch</h2>
          <p className="text-gray-300 mt-2">Send me a message and I'll get back to you soon!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all"
              placeholder="What's this about?"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 border border-red-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all resize-none"
              placeholder="Your message..."
            />
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
              ✅ Message sent successfully! I'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              ❌ Oops! Something went wrong. Please try again or email me directly.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <span>📤</span>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm

