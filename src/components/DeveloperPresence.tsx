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
      <p className="font-terminal text-sm text-cyber-magenta mb-4 tracking-widest">&gt; PRESENCE.SYS // LOG_STREAM</p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2 tracking-wide cyber-glitch">
        Activity
      </h2>
      <p className="mb-8 max-w-full text-sm leading-relaxed text-slate-400 sm:max-w-2xl">
        GitHub contributions over the past year and LeetCode practice highlights.
      </p>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="cyber-card cyber-corner-brackets flex min-w-0 max-w-full flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FaGithub className="text-cyber-cyan text-xl" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-cyber-cyan font-terminal tracking-wider">
                  GitHub
                </h3>
                <p className="text-xs text-cyber-magenta/70 font-terminal">
                  @{profile.githubLogin}
                </p>
              </div>
            </div>
            <a
              href={ghProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-terminal text-cyber-cyan hover:text-cyber-yellow"
            >
              Profile <FaExternalLinkAlt className="text-[10px]" aria-hidden />
            </a>
          </div>

          {stats.github ? (
            <>
              <p className="text-sm text-slate-300 mb-3">
                <span className="font-bold text-cyber-yellow font-terminal text-base">
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
            <p className="text-sm text-slate-500 font-terminal">
              GitHub activity could not be loaded.
            </p>
          )}
        </div>

        <div className="cyber-card cyber-corner-brackets flex min-w-0 max-w-full flex-col overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <SiLeetcode className="text-cyber-yellow text-xl" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-cyber-yellow font-terminal tracking-wider">
                  LeetCode
                </h3>
                <p className="text-xs text-cyber-magenta/70 font-terminal">
                  @{profile.leetcodeUsername}
                </p>
              </div>
            </div>
            <a
              href={lcProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-terminal text-cyber-cyan hover:text-cyber-yellow"
            >
              Profile <FaExternalLinkAlt className="text-[10px]" aria-hidden />
            </a>
          </div>

          {!lc ? (
            <p className="text-sm text-slate-500 font-terminal">
              Stats unavailable — rebuild failed to fetch LeetCode data.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {lc.streak != null && (
                  <span className="px-2.5 py-1 rounded-none text-xs font-terminal bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30">
                    Streak: {lc.streak} day{lc.streak === 1 ? '' : 's'}
                  </span>
                )}
                {lc.totalActiveDays != null && (
                  <span className="px-2.5 py-1 rounded-none text-xs font-terminal bg-cyber-cyan/5 text-cyber-cyan border border-cyber-cyan/25">
                    Active days ({new Date().getFullYear()}):{' '}
                    {lc.totalActiveDays}
                  </span>
                )}
                {lc.solved.Easy != null && (
                  <span className="px-2.5 py-1 rounded-none text-xs font-terminal bg-cyber-green/5 text-cyber-green border border-cyber-green/25">
                    Easy {lc.solved.Easy}
                  </span>
                )}
                {lc.solved.Medium != null && (
                  <span className="px-2.5 py-1 rounded-none text-xs font-terminal bg-cyber-yellow/5 text-cyber-yellow border border-cyber-yellow/25">
                    Medium {lc.solved.Medium}
                  </span>
                )}
                {lc.solved.Hard != null && (
                  <span className="px-2.5 py-1 rounded-none text-xs font-terminal bg-cyber-magenta/5 text-cyber-magenta border border-cyber-magenta/25">
                    Hard {lc.solved.Hard}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-[11px] font-terminal text-cyber-cyan/50">
                {lc.solved.All != null && (
                  <span>
                    Accepted problems (total):{' '}
                    <span className="text-cyber-cyan font-bold">{lc.solved.All}</span>
                  </span>
                )}
                {lc.activeYears && lc.activeYears.length > 0 && (
                  <span className="text-cyber-cyan/40">
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
