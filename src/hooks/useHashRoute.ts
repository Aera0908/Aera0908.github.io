import { useEffect, useState, useCallback } from 'react'

export interface HashRoute {
  path: string
  segments: string[]
}

const parseHash = (): HashRoute => {
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) return { path: '/', segments: [] }

  if (!raw.startsWith('/')) {
    return { path: '/', segments: [] }
  }

  const cleaned = raw.split('?')[0].split('#')[0]
  const segments = cleaned.split('/').filter(Boolean)
  return { path: '/' + segments.join('/'), segments }
}

export const useHashRoute = () => {
  const [route, setRoute] = useState<HashRoute>(() => parseHash())

  useEffect(() => {
    const handler = () => setRoute(parseHash())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`
    window.location.hash = normalized
  }, [])

  return { route, navigate }
}

export const routeTo = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  window.location.hash = normalized
}
