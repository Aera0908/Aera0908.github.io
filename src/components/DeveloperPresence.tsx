import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import developerStats from '../data/developer-stats.json'
import ContributionHeatmap from './ContributionHeatmap'

type ContributionWeek = {
  contributionDays: { date: string; contributionCount: number }[]
}

interface DeveloperStatsFile {
  fetchedAt: string
  profile: { githubLogin: string; leetcodeUsername: string }
  github: null | {
    login: string
    totalContributions: number
    weeks: ContributionWeek[]
  }
  leetcode: null | {
    username: string
    streak: number | null
    totalActiveDays: number | null
    activeYears: number[] | null
    solved: Record<string, number>
    weeks: ContributionWeek[]
  }
}

const stats = developerStats as DeveloperStatsFile

const DeveloperPresence = () => {
  const { profile } = stats
  const ghProfileUrl = `https://github.com/${profile.githubLogin}`
  const lcProfileUrl = `https://leetcode.com/u/${profile.leetcodeUsername}/`

  const lc = stats.leetcode

  return (
    <section
      id="presence"
      className="w-full min-w-0 max-w-full scroll-mt-24 py-16"
      aria-label="Coding activity and practice profiles"
    >
      <p className="font-mono text-sm text-slate-500 mb-4">&gt; PRESENCE</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">
        Activity
      </h2>
      <p className="mb-8 max-w-full text-sm leading-relaxed text-slate-400 sm:max-w-2xl">
        GitHub contributions over the past year and LeetCode practice highlights.
      </p>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="dashboard-card flex min-w-0 max-w-full flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FaGithub className="text-slate-300 text-xl" aria-hidden />
              <div>
                <h3 className="text-lg font-semibold text-sky-300 font-mono">
                  GitHub
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  @{profile.githubLogin}
                </p>
              </div>
            </div>
            <a
              href={ghProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300"
            >
              Profile <FaExternalLinkAlt className="text-[10px]" aria-hidden />
            </a>
          </div>

          {stats.github ? (
            <>
              <p className="text-sm text-slate-300 mb-3">
                <span className="font-semibold text-slate-100">
                  {stats.github.totalContributions.toLocaleString()}
                </span>{' '}
                contributions in the last year on GitHub
              </p>
              <div className="min-w-0 max-w-full">
                <ContributionHeatmap
                  weeks={stats.github.weeks}
                  variant="github"
                  unitLabel="contributions"
                  ariaTitle={`GitHub contribution calendar for ${stats.github.login}, last twelve months`}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              GitHub activity could not be loaded.
            </p>
          )}
        </div>

        <div className="dashboard-card flex min-w-0 max-w-full flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <SiLeetcode className="text-[#ffa116] text-xl" aria-hidden />
              <div>
                <h3 className="text-lg font-semibold text-amber-200 font-mono">
                  LeetCode
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  @{profile.leetcodeUsername}
                </p>
              </div>
            </div>
            <a
              href={lcProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300"
            >
              Profile <FaExternalLinkAlt className="text-[10px]" aria-hidden />
            </a>
          </div>

          {!lc ? (
            <p className="text-sm text-slate-500 font-mono">
              Stats unavailable — rebuild failed to fetch LeetCode data.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {lc.streak != null && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/10 text-amber-200 border border-amber-500/25">
                    Streak: {lc.streak} day{lc.streak === 1 ? '' : 's'}
                  </span>
                )}
                {lc.totalActiveDays != null && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                    Active days ({new Date().getFullYear()}):{' '}
                    {lc.totalActiveDays}
                  </span>
                )}
                {lc.solved.Easy != null && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">
                    Easy {lc.solved.Easy}
                  </span>
                )}
                {lc.solved.Medium != null && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/10 text-amber-100 border border-amber-500/20">
                    Medium {lc.solved.Medium}
                  </span>
                )}
                {lc.solved.Hard != null && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-rose-500/10 text-rose-200 border border-rose-500/20">
                    Hard {lc.solved.Hard}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-[11px] font-mono text-slate-500">
                {lc.solved.All != null && (
                  <span>
                    Accepted problems (total):{' '}
                    <span className="text-slate-300">{lc.solved.All}</span>
                  </span>
                )}
                {lc.activeYears && lc.activeYears.length > 0 && (
                  <span className="text-slate-600">
                    Years active: {lc.activeYears.join(', ')}
                  </span>
                )}
              </div>

              <div className="min-w-0 max-w-full">
                <ContributionHeatmap
                  weeks={lc.weeks}
                  variant="leetcode"
                  unitLabel="submissions"
                  ariaTitle={`LeetCode submission calendar for ${lc.username}, last twelve months`}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DeveloperPresence
