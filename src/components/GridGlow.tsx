import { useEffect, useState, useRef } from 'react'

interface GlowCell {
  id: number
  x: number // grid column
  y: number // grid row
  opacity: number // max opacity
  color: 'cyan' | 'yellow'
  scale: number
  delay: string
  key: number
}

export const GridGlow = () => {
  const [cells, setCells] = useState<GlowCell[]>([])
  const nextIndexRef = useRef(0)
  const isFrozenRef = useRef(false)

  useEffect(() => {
    const handleSande = (e: Event) => {
      isFrozenRef.current = (e as CustomEvent).detail.active
    }
    window.addEventListener('sandevistan-state', handleSande)

    const getGridConfig = () => {
      const cols = Math.max(10, Math.floor(window.innerWidth / 32))
      const rows = Math.max(10, Math.floor(window.innerHeight / 32))
      // Scale count dynamically based on viewport size, ~4% density
      const count = Math.min(120, Math.max(30, Math.floor(cols * rows * 0.04)))
      return { cols, rows, count }
    };

    const init = () => {
      const { cols, rows, count } = getGridConfig()
      const initialCells = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        // Wider opacity range for organic brightness variation
        opacity: Math.random() * 0.22 + 0.06, // 0.06 to 0.28 max brightness
        color: Math.random() > 0.35 ? ('cyan' as const) : ('yellow' as const),
        scale: Math.random() * 0.4 + 0.8,
        // Negative animation delay staggers start times so they don't flash in sync on load
        delay: `-${Math.random() * 3.0}s`,
        key: Math.random()
      }))
      setCells(initialCells)
      nextIndexRef.current = 0
    }

    init()

    // Handle viewport resize to adjust grid cell count
    const handleResize = () => {
      const { count } = getGridConfig()
      setCells((prev) => {
        // Only trigger full rebuild if cell count changes significantly
        if (Math.abs(prev.length - count) < 8) return prev
        const { cols, rows } = getGridConfig()
        return Array.from({ length: count }).map((_, i) => ({
          id: i,
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
          opacity: Math.random() * 0.22 + 0.06,
          color: Math.random() > 0.35 ? ('cyan' as const) : ('yellow' as const),
          scale: Math.random() * 0.4 + 0.8,
          delay: `-${Math.random() * 3.0}s`,
          key: Math.random()
        }))
      })
    }

    window.addEventListener('resize', handleResize)

    // Constant relocations: update a subset of cells every 100ms
    // With 3s animation duration, updating cells sequentially keeps the entire grid active constantly
    const interval = setInterval(() => {
      if (isFrozenRef.current) return // Stop cell relocation/state changes while frozen
      
      setCells((prev) => {
        if (prev.length === 0) return prev
        const next = [...prev]
        const { cols, rows } = getGridConfig()
        
        // Update ~1/30th of cells per 100ms (so every cell updates exactly once per 3 seconds)
        const updateCount = Math.ceil(next.length / 30)
        
        for (let i = 0; i < updateCount; i++) {
          const idx = nextIndexRef.current
          nextIndexRef.current = (idx + 1) % next.length
          
          next[idx] = {
            ...next[idx],
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
            opacity: Math.random() * 0.24 + 0.06, // 0.06 to 0.30 max brightness
            color: Math.random() > 0.35 ? 'cyan' : 'yellow',
            scale: Math.random() * 0.4 + 0.8,
            delay: '0s', // start clean from 0s at the new location
            key: Math.random()
          }
        }
        return next
      })
    }, 100)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('sandevistan-state', handleSande)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {cells.map((cell) => {
        const bgClass = cell.color === 'cyan' ? 'bg-cyber-cyan/40' : 'bg-cyber-yellow/40'
        const glowClass = cell.color === 'cyan' 
          ? 'shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
          : 'shadow-[0_0_15px_rgba(252,238,10,0.25)]'
        
        return (
          <div
            key={`${cell.id}-${cell.key}`}
            className={`absolute ${bgClass} ${glowClass}`}
            style={{
              left: `${cell.x * 32}px`,
              top: `${cell.y * 32}px`,
              width: '32px',
              height: '32px',
              transform: `scale(${cell.scale})`,
              animation: 'cyber-cell-glow 3s ease-in-out forwards',
              animationDelay: cell.delay,
              ['--max-opacity' as any]: cell.opacity,
            }}
          />
        )
      })}
    </div>
  )
}

export default GridGlow

