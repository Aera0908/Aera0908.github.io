import React from 'react'

/**
 * Animated Scanline overlay simulating a retro CRT / cybernetic optic feed.
 */
export const CyberScanline: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 opacity-[0.15]">
      {/* Scanline line */}
      <div 
        className="w-full h-1 bg-cyber-cyan shadow-[0_0_8px_#00f0ff] absolute left-0"
        style={{
          animation: 'cyber-scanline 6s linear infinite',
        }}
      />
      {/* Subtle screen flicker overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
        style={{
          animation: 'cyber-flicker 0.15s infinite',
        }}
      />
      
      <style>{`
        @keyframes cyber-scanline {
          0% { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes cyber-flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/**
 * Spinning tech crosshair / target vector graphics.
 */
export const CyberTarget: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <svg className="w-full h-full text-cyber-cyan animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="30 15" />
        <path d="M 50 0 L 50 15 M 50 85 L 50 100 M 0 50 L 15 50 M 85 50 L 100 50" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-cyber-magenta animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Rotating telemetry telemetry graphs / details.
 */
export const CyberTelemetry: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none font-terminal text-[8px] text-cyber-yellow`}>
      <svg className="w-full h-full text-cyber-yellow/40 animate-[spin_20s_linear_infinite_reverse]" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="0.75" strokeDasharray="15 5 2 5" />
        <circle cx="60" cy="60" r="42" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1.5" strokeDasharray="80 120" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-cyber-cyan font-bold tracking-widest animate-pulse">LNK.0</span>
        <span className="text-[6px] text-cyber-magenta opacity-80">SYS_V.82</span>
      </div>
    </div>
  )
}

/**
 * Digital HUD corner frames that wrap elements.
 */
export const CyberHudFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative p-2 border border-cyber-cyan/25 bg-cyber-gray/40 backdrop-blur-sm ${className}`}>
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-yellow" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyber-yellow" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyber-yellow" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-yellow" />
      
      {/* Dynamic scan line inside frame */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-cyber-cyan/20 animate-[scan-horizontal_3s_ease-in-out_infinite]" />
      
      {children}

      <style>{`
        @keyframes scan-horizontal {
          0%, 100% { top: 0; opacity: 0; }
          10%, 90% { opacity: 0.7; }
          50% { top: 100%; opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
