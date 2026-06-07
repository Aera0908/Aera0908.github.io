import type { Engagement } from '../data/projectTypes'

type Size = 'sm' | 'md'

const engagementStyles: Record<Engagement, string> = {
  Freelance: 'bg-cyber-yellow/15 text-cyber-yellow border border-cyber-yellow/30',
  Client: 'bg-cyber-magenta/15 text-cyber-magenta border border-cyber-magenta/30',
  Academic: 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30',
  Personal: 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30',
  'Open Source': 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30',
}

const engagementTooltip: Record<Engagement, string> = {
  Freelance: 'Paid freelance engagement',
  Client: 'Commissioned client project',
  Academic: 'Academic / coursework project',
  Personal: 'Personal project',
  'Open Source': 'Open source contribution',
}

const sizes: Record<Size, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
}

interface EngagementBadgeProps {
  engagement?: Engagement | null
  size?: Size
  className?: string
}

export const EngagementBadge = ({
  engagement,
  size = 'sm',
  className = '',
}: EngagementBadgeProps) => {
  if (!engagement) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-none font-terminal tracking-wider ${engagementStyles[engagement]} ${sizes[size]} ${className}`}
      title={engagementTooltip[engagement]}
    >
      <span className="w-1.5 h-1.5 rounded-none bg-current opacity-80" />
      {engagement.toUpperCase()}
    </span>
  )
}

interface LimitedInfoBadgeProps {
  active?: boolean
  size?: Size
  className?: string
  label?: string
}

export const LimitedInfoBadge = ({
  active,
  size = 'sm',
  className = '',
  label = 'LIMITED INFO',
}: LimitedInfoBadgeProps) => {
  if (!active) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-none font-terminal tracking-wider bg-cyber-magenta/10 text-cyber-magenta border border-dashed border-cyber-magenta/40 ${sizes[size]} ${className}`}
      title="Public information is limited per a client contract / NDA"
    >
      <svg
        className="w-2.5 h-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m0-10a4 4 0 014 4v1H8v-1a4 4 0 014-4zm-5 5h10a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6a1 1 0 011-1z"
        />
      </svg>
      {label}
    </span>
  )
}
