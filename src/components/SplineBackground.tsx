import { Suspense, lazy } from 'react'

// Lazy load Spline for better performance
const Spline = lazy(() => import('@splinetool/react-spline'))

const SplineBackground = () => {
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

