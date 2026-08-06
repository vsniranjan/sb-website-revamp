'use client'

import { useRef } from 'react'
import { useGSAP, ScrollTrigger } from '@/lib/gsap-setup'
import { primeReveals, initSectionReveals, initCounters, showEverythingInstantly } from '@/lib/animations/reveals'
import { initLineDraws, initGauges, initCallouts, applyStaticFlourishes } from '@/lib/animations/flourishes'
import { usePreloader } from '@/components/chrome/PreloaderContext'

/**
 * Per-page GSAP wrapper for scroll-reveal animations (section heads, cards,
 * gauges, counters, line-draws, callouts). Mounted once per page — remounts on
 * every client-side navigation, unlike the chrome components in the root layout.
 */
export function SectionAnimations({ children }: { children: React.ReactNode }) {
  const scopeRef = useRef<HTMLElement>(null)
  const { ready } = usePreloader()

  // Prime immediately on mount so nothing paints in an un-animated state, or —
  // under reduced motion — jump straight to the finished state instead.
  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        showEverythingInstantly()
        applyStaticFlourishes()
      } else {
        primeReveals()
      }
    },
    { scope: scopeRef, dependencies: [] },
  )

  // Scroll-triggered reveals wait for the preloader on a genuine first boot;
  // `ready` is already true by the time this mounts on any later navigation
  // within the same session, so it fires immediately then.
  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion || !ready) return
      initSectionReveals()
      initCounters()
      initLineDraws()
      initGauges()
      initCallouts()
      ScrollTrigger.refresh()
    },
    { scope: scopeRef, dependencies: [ready] },
  )

  return <main ref={scopeRef}>{children}</main>
}
