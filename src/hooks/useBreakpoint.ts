import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/lib/constants'

type Breakpoint = keyof typeof BREAKPOINTS

export function useBreakpoint(bp: Breakpoint): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= BREAKPOINTS[bp]
  )

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [bp])

  return matches
}

export function useIsMobile(): boolean {
  return !useBreakpoint('sm')
}

export function useIsTablet(): boolean {
  const isMd = useBreakpoint('md')
  const isLg = useBreakpoint('lg')
  return isMd && !isLg
}

export function useIsDesktop(): boolean {
  return useBreakpoint('lg')
}
