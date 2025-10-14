import { Suspense, lazy, useState, useEffect } from 'react'

// Lazy load Spline for better performance
const Spline = lazy(() => import('@splinetool/react-spline'))

const SplineBackground = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Disable on screens smaller than 1024px
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't render Spline on mobile devices
  if (isMobile) {
    return (
      <div className="fixed inset-0 w-full h-full z-0 bg-slate-950">
        {/* Simple gradient background for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-900/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <Suspense fallback={
        <div className="w-full h-full bg-slate-950" />
      }>
        <Spline 
          scene="https://prod.spline.design/dt5vaxpAULXQLc-4/scene.splinecode"
          className="w-full h-full"
          style={{ pointerEvents: 'all' }}
        />
      </Suspense>
    </div>
  )
}

export default SplineBackground

