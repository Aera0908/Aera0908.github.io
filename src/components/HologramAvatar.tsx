import React, { useEffect, useState } from 'react'

export const HologramAvatar: React.FC = () => {
  const [active, setActive] = useState(false)
  const [zoomedIn, setZoomedIn] = useState(false)
  const [edgesVisible, setEdgesVisible] = useState(false)
  const [hudVisible, setHudVisible] = useState(false)
  
  const base = import.meta.env.BASE_URL
  const [imgSrc, setImgSrc] = useState(`${base}aera-full-body.png`)

  useEffect(() => {
    let hudTimer: any

    const handleSande = (e: Event) => {
      const isSandeActive = (e as CustomEvent).detail.active
      if (isSandeActive) {
        // Sandevistan active: trigger slide-in immediately (zoomed out, full-body view)
        setActive(true)
        setZoomedIn(false)
        setEdgesVisible(false)
        setHudVisible(false)
      } else {
        // Sandevistan inactive:
        // 1. Instantly show edges (corner brackets) and start zoom-in (cropping body)
        setEdgesVisible(true)
        setZoomedIn(true)

        // 2. Delay the card outline, background, and HUD rings until the crop transition completes (1000ms)
        hudTimer = setTimeout(() => {
          setHudVisible(true)
        }, 1000)
      }
    }

    window.addEventListener('sandevistan-state', handleSande)
    return () => {
      window.removeEventListener('sandevistan-state', handleSande)
      if (hudTimer) clearTimeout(hudTimer)
    }
  }, [])

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] aspect-[3/4] flex items-center justify-center overflow-visible py-8 px-6">
      {/* SVG Filters for Sandevistan Rainbow Silhouette Trails */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <filter id="sande-cyan">
            <feFlood floodColor="#00f0ff" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="sande-magenta">
            <feFlood floodColor="#ff00ff" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="sande-green">
            <feFlood floodColor="#00ff66" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="sande-yellow">
            <feFlood floodColor="#fcee0a" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Translucent Card Background and Neon Outline (Fades in after crop settles) */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out border rounded-lg z-0 ${
          hudVisible 
            ? 'bg-cyber-gray/35 border-cyber-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]' 
            : 'bg-transparent border-transparent'
        }`}
      />

      {/* Bounding Box Corner Brackets ("edges") - Appears instantly when time stop ends */}
      <div 
        className={`absolute inset-0 transition-all duration-300 pointer-events-none z-20 ${
          edgesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan/70 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan/70 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan/70 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan/70 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
      </div>

      {/* Cyber HUD Vector Background (Fades in after zoom-in completes) */}
      <div 
        className={`absolute w-[105%] h-[105%] flex items-center justify-center pointer-events-none transition-all duration-1000 ease-out z-0 ${
          hudVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Rotating Circular HUD Rings */}
        <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-cyber-cyan/35 animate-hud-spin-slow" />
        <div className="absolute w-[80%] h-[80%] rounded-full border border-double border-cyber-cyan/15 animate-hud-spin-reverse" />
        
        {/* HUD Data Labels */}
        <div className="absolute top-[-20px] left-2 font-terminal text-[9px] text-cyber-yellow/70 tracking-wider">
          [ SUBJECT: AIRA_YNTE ]
        </div>
        <div className="absolute bottom-[-24px] right-2 font-terminal text-[9px] text-cyber-cyan/70 tracking-wider">
          [ COORD: 14.4081° N, 121.0415° E ]
        </div>
        <div className="absolute bottom-[-10px] left-2 font-terminal text-[8px] text-cyber-magenta/60 tracking-widest">
          // SCANNING.SYS_OK
        </div>
      </div>

      {/* Main Image Container (Slices crop from bottom after time stop) */}
      <div className={`avatar-crop-container ${
        zoomedIn ? 'overflow-hidden rounded-b-lg zoomed' : 'overflow-visible'
      }`}>
        
        <div className={`absolute left-1/2 -translate-x-1/2 aspect-[3/4] origin-top pointer-events-none sande-anim-allowed transition-all duration-1000 ease-in-out w-[250%] ${
          zoomedIn ? 'top-[-65%]' : 'top-[-40%]'
        }`}>
          {/* Sandevistan Rainbow Trails (Translucent colored silhouettes trailing behind) */}
          {active && (
            <>
              <div className="absolute inset-0 mix-blend-screen z-5 animate-sande-cyan">
                <img
                  src={imgSrc}
                  alt="Cyan Trail"
                  className="w-full h-full object-cover"
                  style={{ filter: 'url(#sande-cyan)' }}
                />
              </div>
              <div className="absolute inset-0 mix-blend-screen z-4 animate-sande-magenta">
                <img
                  src={imgSrc}
                  alt="Magenta Trail"
                  className="w-full h-full object-cover"
                  style={{ filter: 'url(#sande-magenta)' }}
                />
              </div>
              <div className="absolute inset-0 mix-blend-screen z-3 animate-sande-green">
                <img
                  src={imgSrc}
                  alt="Green Trail"
                  className="w-full h-full object-cover"
                  style={{ filter: 'url(#sande-green)' }}
                />
              </div>
              <div className="absolute inset-0 mix-blend-screen z-2 animate-sande-yellow">
                <img
                  src={imgSrc}
                  alt="Yellow Trail"
                  className="w-full h-full object-cover"
                  style={{ filter: 'url(#sande-yellow)' }}
                />
              </div>
            </>
          )}

          {/* Main Portrait Image (Centered, Slides in, and then floats) */}
          <div 
            className={`absolute inset-0 z-10 ${
              active ? 'animate-sande-main' : 'opacity-0'
            }`}
          >
            <img
              src={imgSrc}
              onError={() => setImgSrc(`${base}aera-avatar-full.png`)}
              alt="Aira Ynte Portrait"
              className={`w-full h-full object-cover ${
                hudVisible ? 'animate-holo-float' : ''
              }`}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.75))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Scoped Styles for Cyber HUD and Sandevistan Animations */}
      <style>{`
        /* Dynamic crop container that shrivels height from bottom to top */
        .avatar-crop-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          pointer-events: none;
          z-index: 10;
          height: 215%;
          transition: height 1s cubic-bezier(0.16, 1, 0.3, 1), border-radius 1s ease-in-out;
        }
        .avatar-crop-container.zoomed {
          height: 100%;
        }

        /* Slow HUD rotations */
        @keyframes hudSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-hud-spin-slow {
          animation: hudSpin 25s linear infinite;
        }
        .animate-hud-spin-reverse {
          animation: hudSpin 18s linear infinite reverse;
        }

        /* 3D Floating Sway for the settled photo */
        @keyframes holoFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.01);
          }
        }
        .animate-holo-float {
          animation: holoFloat 6s ease-in-out infinite;
        }

        /* Sandevistan Staggered Slide-In Animations (Rainbow Trails) */
        @keyframes sandeMain {
          0% {
            transform: translateX(180px) scale(0.95);
            opacity: 0;
          }
          15% {
            opacity: 0.3;
          }
          75% {
            transform: translateX(-8px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        /* Uniform trail slide animation, staggered by delay */
        @keyframes sandeTrail {
          0% {
            transform: translateX(180px);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          70% {
            transform: translateX(-8px);
            opacity: 0.5;
          }
          90% {
            transform: translateX(0);
            opacity: 0.2;
          }
          100% {
            transform: translateX(0);
            opacity: 0;
          }
        }

        .animate-sande-main {
          animation: sandeMain 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-sande-cyan {
          animation: sandeTrail 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards;
        }
        .animate-sande-magenta {
          animation: sandeTrail 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s forwards;
        }
        .animate-sande-green {
          animation: sandeTrail 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.36s forwards;
        }
        .animate-sande-yellow {
          animation: sandeTrail 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.48s forwards;
        }
      `}</style>
    </div>
  )
}

export default HologramAvatar
