import { useEffect, useState, useCallback } from 'react'

export interface Route {
  path: string
  segments: string[]
}

/** Map section IDs to their clean URL paths */
export const SECTION_PATHS: Record<string, string> = {
  dashboard: '/',
  whoami: '/whoami',
  edu: '/edu',
  journey: '/journey',
  stack: '/stack',
  certs: '/certs',
  projects: '/projects',
  designs: '/designs',
  presence: '/presence',
  comms: '/comms',
}

/** Reverse map: URL path → section ID */
export const PATH_TO_SECTION: Record<string, string> = Object.fromEntries(
  Object.entries(SECTION_PATHS).map(([id, path]) => [path, id]),
)

const parsePath = (): Route => {
  const raw = window.location.pathname
  if (!raw || raw === '/') return { path: '/', segments: [] }

  const cleaned = raw.split('?')[0].split('#')[0]
  const segments = cleaned.split('/').filter(Boolean)
  return { path: '/' + segments.join('/'), segments }
}

export const useRoute = () => {
  const [route, setRoute] = useState<Route>(() => parsePath())

  useEffect(() => {
    const handler = () => setRoute(parsePath())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const navigate = useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`
    history.pushState(null, '', normalized)
    setRoute(parsePath())
  }, [])

  return { route, navigate }
}

/**
 * Navigate to a clean URL path.
 * Dispatches a popstate event so all useRoute hooks stay in sync.
 */
export const routeTo = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  history.pushState(null, '', normalized)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/**
 * Update the URL in the address bar without triggering navigation.
 * Used by scroll-spy to reflect the current section.
 */
export const replaceUrl = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (window.location.pathname !== normalized) {
    history.replaceState(null, '', normalized)
  }
}
