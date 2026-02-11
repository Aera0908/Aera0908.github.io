import { useState, useEffect } from 'react'

const HeaderBar = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4 font-mono text-xs text-slate-400 shrink-0">
      <div className="flex gap-3 sm:gap-6">
        <span className="hidden sm:inline">MEM: 16GB OK</span>
        <span className="hidden sm:inline">CPU: 3.2GHz</span>
        <span>LOC: Manila, PH</span>
      </div>
      <span className="text-slate-500">{time}</span>
    </header>
  )
}

export default HeaderBar
