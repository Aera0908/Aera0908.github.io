import type { WebTier } from '../data/projectTypes'

type Size = 'sm' | 'md'

interface Props {
  tier?: WebTier | null
  size?: Size
  className?: string
}

const styles: Record<WebTier, string> = {
  Web2: 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30',
  Web3: 'bg-cyber-magenta/15 text-cyber-magenta border border-cyber-magenta/30',
  Hybrid: 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30',
}

const titles: Record<WebTier, string> = {
  Web2: 'Traditional web / app stack',
  Web3: 'Includes on-chain / blockchain components',
  Hybrid: 'Hybrid — combines Web2 and Web3 components',
}

const sizes: Record<Size, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
}

const WebTierBadge = ({ tier, size = 'sm', className = '' }: Props) => {
  if (!tier) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-none font-terminal tracking-wider ${styles[tier]} ${sizes[size]} ${className}`}
      title={titles[tier]}
    >
      <span className="w-1.5 h-1.5 rounded-none bg-current opacity-80" />
      {tier.toUpperCase()}
    </span>
  )
}

export default WebTierBadge
