import { useState, useEffect } from 'react'

const HeaderBar = () => {
  const [time, setTime] = useState('')
  const [isFrozen, setIsFrozen] = useState(false)

  const updateTime = () => {
    const now = new Date()
    setTime(now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }))
  }

  useEffect(() => {
    const handleSande = (e: Event) => {
      const active = (e as CustomEvent).detail.active
      setIsFrozen(active)
    }
    window.addEventListener('sandevistan-state', handleSande)
    return () => window.removeEventListener('sandevistan-state', handleSande)
  }, [])

  useEffect(() => {
    if (isFrozen) return // Freeze: clear interval and do not register updates

    updateTime() // Instantly catch up to the current actual time
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [isFrozen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-8 bg-cyber-gray border-b border-cyber-yellow/35 flex items-center justify-between px-4 font-terminal text-xs shrink-0 select-none">
      <div className="flex gap-3 sm:gap-6 items-center">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
          </span>
          <span className="text-cyber-cyan">SYS:</span>
          <span className="text-cyber-yellow font-bold">ONLINE</span>
        </span>
        <span className="hidden sm:inline text-cyber-cyan/80">CPU: <span className="text-cyber-yellow">3.2GHz</span></span>
        <span className="hidden sm:inline text-cyber-cyan/80">LOC: <span className="text-cyber-yellow">MUNTINLUPA, PH</span></span>
        <span className="hidden md:inline text-cyber-cyan/80">TUNNEL: <span className="text-cyber-magenta font-semibold">ESTABLISHED</span></span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-cyber-cyan/40">// EDGERUNNER.NET</span>
        <span className="text-cyber-yellow font-bold tracking-widest">{time}</span>
      </div>
    </header>
  )
}

export default HeaderBar
