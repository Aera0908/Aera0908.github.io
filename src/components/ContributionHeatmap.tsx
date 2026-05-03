import { useMemo } from 'react'

export type ContributionWeek = {
  contributionDays: { date: string; contributionCount: number }[]
}

type Variant = 'github' | 'leetcode'

const PALETTES: Record<Variant, string[]> = {
  github: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  leetcode: ['#1c1917', '#422006', '#a16207', '#ea580c', '#fbbf24'],
}

/** Parse YYYY-MM-DD as UTC midnight */
function parseUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
}

function monthYearKey(dateStr: string): string {
  const dt = parseUTCDate(dateStr)
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth()}`
}

function shortMonth(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  }).format(parseUTCDate(dateStr))
}

function formatRangeUTC(from: string, to: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return `${fmt.format(parseUTCDate(from))} – ${fmt.format(parseUTCDate(to))}`
}

/** Rows follow GitHub / GraphQL order: Sun … Sat (index 0 = Sunday) */
const WEEKDAY_ROW_LABELS: [number, string][] = [
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
]

function bucket(count: number, max: number): number {
  if (count <= 0) return 0
  if (max <= 0) return 1
  const r = count / max
  if (r <= 0.25) return 1
  if (r <= 0.5) return 2
  if (r <= 0.75) return 3
  return 4
}

const gapClass = 'gap-[2px] sm:gap-[3px]'
const cellClass =
  'h-[9px] w-[9px] shrink-0 rounded-[2px] sm:h-[11px] sm:w-[11px]'
const monthCellClass =
  'flex h-4 w-[9px] shrink-0 items-start justify-start overflow-visible sm:w-[11px]'

interface ContributionHeatmapProps {
  weeks: ContributionWeek[]
  variant: Variant
  unitLabel: string
  ariaTitle: string
}

export default function ContributionHeatmap({
  weeks,
  variant,
  unitLabel,
  ariaTitle,
}: ContributionHeatmapProps) {
  const max = useMemo(() => {
    let m = 0
    for (const w of weeks) {
      for (const d of w.contributionDays) {
        if (d.contributionCount > m) m = d.contributionCount
      }
    }
    return m
  }, [weeks])

  const { rangeLabel, monthCells } = useMemo(() => {
    if (!weeks.length) {
      return { rangeLabel: '', monthCells: [] as { key: string; label: string }[] }
    }

    const firstDate = weeks[0].contributionDays[0]?.date ?? ''
    const lastWeek = weeks[weeks.length - 1]
    const lastDate =
      lastWeek.contributionDays[lastWeek.contributionDays.length - 1]?.date ?? ''

    const cells = weeks.map((week, wi) => {
      const sun = week.contributionDays[0]?.date
      if (!sun) return { key: `w-${wi}`, label: '' }

      const prevSun =
        wi > 0 ? weeks[wi - 1].contributionDays[0]?.date : null

      if (wi > 0 && prevSun && monthYearKey(sun) === monthYearKey(prevSun)) {
        return { key: `w-${wi}-${sun}`, label: '' }
      }

      const label = shortMonth(sun)
      return { key: `w-${wi}-${sun}`, label }
    })

    const range =
      firstDate && lastDate ? formatRangeUTC(firstDate, lastDate) : ''

    return { rangeLabel: range, monthCells: cells }
  }, [weeks])

  const palette = PALETTES[variant]

  if (!weeks.length) {
    return (
      <p className="font-mono text-sm text-slate-500">
        No calendar data available yet.
      </p>
    )
  }

  return (
    <div className="max-w-full min-w-0 rounded-lg border border-white/10 bg-[#121212] p-3 sm:p-4">
      <div
        className="max-w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] touch-pan-x"
        role="img"
        aria-label={ariaTitle}
      >
        <div className="inline-flex min-w-min flex-col gap-1">
          {/* Month row — aligns with week columns (Sunday column date) */}
          <div className="flex items-end">
            <div
              className="w-8 shrink-0 sm:w-9"
              aria-hidden
            />
            <div className={`flex ${gapClass}`}>
              {monthCells.map((mc) => (
                <div key={mc.key} className={monthCellClass}>
                  <span className="whitespace-nowrap pl-px font-mono text-[9px] leading-none text-slate-500 sm:text-[10px]">
                    {mc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekday labels + grid */}
          <div className="flex">
            <div
              className={`grid w-8 shrink-0 grid-rows-7 ${gapClass} pr-1 sm:w-9`}
              aria-hidden
            >
              {Array.from({ length: 7 }, (_, row) => {
                const label =
                  WEEKDAY_ROW_LABELS.find(([i]) => i === row)?.[1] ?? ''
                return (
                  <div
                    key={row}
                    className="flex h-[9px] items-center justify-end sm:h-[11px]"
                  >
                    <span className="font-mono text-[8px] leading-none text-slate-500 sm:text-[9px]">
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className={`flex ${gapClass}`}>
              {weeks.map((week, wi) => (
                <div
                  key={wi}
                  className={`flex w-[9px] shrink-0 flex-col sm:w-[11px] ${gapClass}`}
                >
                  {week.contributionDays.map((day) => {
                    const lv = bucket(day.contributionCount, max)
                    const bg = palette[lv]
                    return (
                      <div
                        key={`${wi}-${day.date}`}
                        className={cellClass}
                        style={{ backgroundColor: bg }}
                        title={`${day.date} · ${day.contributionCount} ${unitLabel}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {rangeLabel ? (
          <p className="order-2 font-mono text-[9px] text-slate-600 sm:order-1">
            {rangeLabel}
          </p>
        ) : (
          <span className="sr-only">Date range unavailable.</span>
        )}
        <div className="order-1 flex flex-wrap items-center justify-end gap-2 font-mono text-[10px] text-slate-500 sm:order-2">
          <span>Less</span>
          <div className={`flex ${gapClass}`}>
            {palette.map((c, i) => (
              <div
                key={i}
                className={cellClass}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
