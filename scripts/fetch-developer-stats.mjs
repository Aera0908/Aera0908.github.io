/**
 * Build-time fetch for GitHub contribution calendar + LeetCode public stats.
 * Reads developer-presence.config.json (repo root).
 *
 * GitHub accuracy:
 * - Set GITHUB_CONTRIBUTIONS_TOKEN (classic PAT: read:user, or fine-grained with
 *   read access to user profile). The script queries `viewer` first so counts match
 *   what you see while logged in (including private contributions if your PAT is yours).
 * - Without a token, a third-party public API is used — it only sees public activity
 *   and can differ from your profile; treat it as approximate.
 *
 * Loads KEY=value pairs from .env in repo root when present (no extra deps).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outPath = path.join(root, 'src', 'data', 'developer-stats.json')
const configPath = path.join(root, 'developer-presence.config.json')

function loadDotEnv() {
  const envPath = path.join(root, '.env')
  try {
    const raw = fs.readFileSync(envPath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq <= 0) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    /* no .env */
  }
}

loadDotEnv()

function readConfig() {
  const raw = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(raw)
}

async function fetchLeetCode(username) {
  const statsQuery = `
    query ($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `
  const year = new Date().getFullYear()
  const calQuery = `
    query ($username: String!, $year: Int!) {
      matchedUser(username: $username) {
        username
        userCalendar(year: $year) {
          streak
          totalActiveDays
          submissionCalendar
          activeYears
        }
      }
    }
  `
  const headers = {
    'Content-Type': 'application/json',
    Referer: 'https://leetcode.com/',
    'User-Agent': 'web_resume-developer-stats/1.0',
  }
  const endpoint = 'https://leetcode.com/graphql'

  const [statsRes, calRes] = await Promise.all([
    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: statsQuery, variables: { username } }),
    }),
    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: calQuery, variables: { username, year } }),
    }),
  ])

  const statsJson = await statsRes.json()
  const calJson = await calRes.json()

  if (statsJson.errors?.length) {
    throw new Error(`LeetCode stats: ${statsJson.errors.map((e) => e.message).join('; ')}`)
  }
  if (!statsJson.data?.matchedUser) {
    throw new Error('LeetCode: user not found')
  }

  const acRows = statsJson.data.matchedUser.submitStats?.acSubmissionNum ?? []
  const solved = {}
  for (const row of acRows) {
    solved[row.difficulty] = row.count
  }

  const calNode = calJson.data?.matchedUser?.userCalendar
  let submissionCalendar = null
  let streak = null
  let totalActiveDays = null
  let activeYears = null

  if (!calJson.errors?.length && calNode) {
    streak = calNode.streak ?? null
    totalActiveDays = calNode.totalActiveDays ?? null
    activeYears = calNode.activeYears ?? null
    submissionCalendar = calNode.submissionCalendar ?? null
  }

  return {
    username: statsJson.data.matchedUser.username,
    streak,
    totalActiveDays,
    activeYears,
    submissionCalendar,
    solved,
    submissionsByDifficulty: acRows,
  }
}

function utcDayKeyFromUnixSeconds(sec) {
  const d = new Date(Number(sec) * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Rolling ~53 weeks ending today (UTC); columns = weeks, rows Sun–Sat */
function buildRollingWeeksFromDayCountMap(countsByDay) {
  const today = new Date()
  const endUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const startUTC = endUTC - 364 * 86400000

  const startDate = new Date(startUTC)
  const offset = startDate.getUTCDay()
  let weekStart = startUTC - offset * 86400000

  const weeks = []
  while (weekStart <= endUTC) {
    const days = []
    for (let i = 0; i < 7; i++) {
      const dayUTC = weekStart + i * 86400000
      const dt = new Date(dayUTC)
      const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`
      const count = dayUTC > endUTC ? 0 : countsByDay.get(key) ?? 0
      days.push({ date: key, contributionCount: count })
    }
    weeks.push({ contributionDays: days })
    weekStart += 7 * 86400000
  }

  return weeks
}

function sumRollingYearFromDayCountMap(countsByDay) {
  const today = new Date()
  const endUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const startUTC = endUTC - 364 * 86400000
  let sum = 0
  const walk = new Date(startUTC)
  while (walk.getTime() <= endUTC) {
    const key = `${walk.getUTCFullYear()}-${String(walk.getUTCMonth() + 1).padStart(2, '0')}-${String(walk.getUTCDate()).padStart(2, '0')}`
    sum += countsByDay.get(key) ?? 0
    walk.setUTCDate(walk.getUTCDate() + 1)
  }
  return sum
}

function buildRollingWeeksFromLeetCodeCalendar(submissionCalendarStr) {
  if (!submissionCalendarStr) return []

  let raw
  try {
    raw = JSON.parse(submissionCalendarStr)
  } catch {
    return []
  }

  const countsByDay = new Map()
  for (const [ts, count] of Object.entries(raw)) {
    const key = utcDayKeyFromUnixSeconds(ts)
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + Number(count))
  }

  return buildRollingWeeksFromDayCountMap(countsByDay)
}

/**
 * GitHub profile graph uses a rolling ~365-day window in UTC (full calendar days).
 * Normalize from/to so GraphQL matches the grid you see on github.com.
 */
function gitHubContributionsWindowUTC() {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth()
  const d = now.getUTCDate()
  const from = new Date(Date.UTC(y, m, d, 0, 0, 0, 0))
  from.setUTCDate(from.getUTCDate() - 364)
  const to = new Date(Date.UTC(y, m, d, 23, 59, 59, 999))
  return { from, to }
}

async function graphqlRequest(token, query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'web_resume-developer-stats/1.0',
    },
    body: JSON.stringify({ query, variables }),
  })
  return res.json()
}

async function fetchGitHubContributionsPublic(login) {
  const url = `https://github-contributions.vercel.app/api/v1/${encodeURIComponent(login)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'web_resume-developer-stats/1.0',
    },
  })
  if (!res.ok) {
    throw new Error(`Public contributions API: HTTP ${res.status}`)
  }
  const json = await res.json()
  if (!Array.isArray(json.contributions)) {
    throw new Error('Public contributions API: unexpected JSON shape')
  }
  const countsByDay = new Map()
  for (const row of json.contributions) {
    if (row?.date && typeof row.count === 'number') {
      countsByDay.set(row.date, row.count)
    }
  }
  return {
    login,
    totalContributions: sumRollingYearFromDayCountMap(countsByDay),
    weeks: buildRollingWeeksFromDayCountMap(countsByDay),
  }
}

async function fetchGitHub(login, token) {
  const { from, to } = gitHubContributionsWindowUTC()
  const fromISO = from.toISOString()
  const toISO = to.toISOString()

  const calendarFields = `
    contributionCalendar {
      totalContributions
      weeks {
        contributionDays {
          contributionCount
          date
        }
      }
    }
  `

  // Prefer viewer — same account as the PAT; matches logged-in contribution graph.
  const viewerJson = await graphqlRequest(
    token,
    `
    query ($from: DateTime!, $to: DateTime!) {
      viewer {
        login
        contributionsCollection(from: $from, to: $to) {
          ${calendarFields}
        }
      }
    }
  `,
    { from: fromISO, to: toISO },
  )

  if (!viewerJson.errors?.length) {
    const viewerLogin = viewerJson.data?.viewer?.login
    const calViewer =
      viewerJson.data?.viewer?.contributionsCollection?.contributionCalendar
    if (
      calViewer &&
      viewerLogin &&
      viewerLogin.toLowerCase() === login.toLowerCase()
    ) {
      return {
        login: viewerLogin,
        totalContributions: calViewer.totalContributions ?? 0,
        weeks: calViewer.weeks ?? [],
      }
    }
  }

  // PAT is for a different account or viewer missing — query the configured login.
  const userJson = await graphqlRequest(
    token,
    `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          ${calendarFields}
        }
      }
    }
  `,
    { login, from: fromISO, to: toISO },
  )

  if (userJson.errors?.length) {
    throw new Error(userJson.errors.map((e) => e.message).join('; '))
  }

  cal = userJson.data?.user?.contributionsCollection?.contributionCalendar
  if (!cal) {
    throw new Error('GitHub: user not found or no calendar')
  }

  return {
    login,
    totalContributions: cal.totalContributions ?? 0,
    weeks: cal.weeks ?? [],
  }
}

async function main() {
  const { githubLogin, leetcodeUsername } = readConfig()
  const token =
    process.env.GITHUB_CONTRIBUTIONS_TOKEN ||
    process.env.GITHUB_TOKEN ||
    null

  const payload = {
    fetchedAt: new Date().toISOString(),
    profile: { githubLogin, leetcodeUsername },
    github: null,
    leetcode: null,
  }

  const warnings = []

  try {
    const lcRaw = await fetchLeetCode(leetcodeUsername)
    payload.leetcode = {
      username: lcRaw.username,
      streak: lcRaw.streak,
      totalActiveDays: lcRaw.totalActiveDays,
      activeYears: lcRaw.activeYears,
      solved: lcRaw.solved,
      weeks: buildRollingWeeksFromLeetCodeCalendar(lcRaw.submissionCalendar),
    }
  } catch (e) {
    warnings.push(`leetcode: ${e instanceof Error ? e.message : String(e)}`)
  }

  if (token) {
    try {
      payload.github = await fetchGitHub(githubLogin, token)
    } catch (e) {
      warnings.push(`github GraphQL: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (!payload.github) {
    try {
      payload.github = await fetchGitHubContributionsPublic(githubLogin)
      warnings.push(
        'github: using public mirror (set GITHUB_CONTRIBUTIONS_TOKEN for data that matches your logged-in profile)',
      )
    } catch (e) {
      warnings.push(
        `github public API: ${e instanceof Error ? e.message : String(e)}`,
      )
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${path.relative(root, outPath)}`)
  if (warnings.length) console.warn('Warnings:', warnings.join(' | '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
