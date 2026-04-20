import type { WebTier } from '../data/projectTypes'

type Size = 'sm' | 'md'

interface Props {
  tier?: WebTier | null
  size?: Size
  className?: string
}

const styles: Record<WebTier, string> = {
  Web2: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  Web3: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  Hybrid: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
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
      className={`inline-flex items-center gap-1 rounded font-mono tracking-wider ${styles[tier]} ${sizes[size]} ${className}`}
      title={titles[tier]}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-80" />
      {tier.toUpperCase()}
    </span>
  )
}

export default WebTierBadge
