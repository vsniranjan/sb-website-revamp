'use client'

import { useRef } from 'react'
import { useGSAP } from '@/lib/gsap-setup'
import { primeHero, runHeroIntro } from '@/lib/animations/reveals'
import { usePreloader } from '@/components/chrome/PreloaderContext'

const KEY = 'ieee-booted'

/**
 * Choreographed hero entrance — plays only on a genuine first boot of the tab
 * session. Reads `sessionStorage` itself rather than relying on a flag from
 * BootController: React fires child effects before parent effects, so this
 * component's effect runs before BootController's — a value BootController
 * sets asynchronously would still read stale here on the real first load.
 *
 * Deliberately unscoped (no `scope` option): the entrance choreography reaches
 * into `.navbar__inner`, which lives in the root layout outside this
 * component's own subtree — scoping useGSAP's selector resolution to this
 * section would silently fail to find it.
 */
export function HeroIntro({ children }: { children: React.ReactNode }) {
  const { ready } = usePreloader()
  const isFirstBoot = useRef<boolean | null>(null)

  useGSAP(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    isFirstBoot.current = !reducedMotion && sessionStorage.getItem(KEY) !== '1'
    if (isFirstBoot.current) primeHero()
  }, [])

  useGSAP(() => {
    if (!ready || !isFirstBoot.current) return
    runHeroIntro()
  }, [ready])

  return (
    <section className="hero section" id="home">
      {children}
    </section>
  )
}
