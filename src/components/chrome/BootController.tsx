'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap-setup'
import { runPreloader, skipPreloader } from '@/lib/animations/preloader'
import { initReticle } from '@/lib/animations/flourishes'
import { useSetPreloaderReady } from './PreloaderContext'

const KEY = 'ieee-booted'

/**
 * Chrome-level boot sequence — runs once per tab session, not once per page.
 * Sits in the root layout so it survives client-side navigation between pages.
 */
export function BootController() {
  const setReady = useSetPreloaderReady()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyBooted = sessionStorage.getItem(KEY) === '1'

    if (reducedMotion) {
      skipPreloader()
      sessionStorage.setItem(KEY, '1')
      setReady(true)
      return
    }

    // Cursor reticle is permanent chrome, independent of the once-per-session
    // preloader/hero choreography — enable it whenever motion isn't reduced.
    initReticle()

    if (alreadyBooted) {
      skipPreloader()
      setReady(true)
      return
    }

    // Refreshing part-way down the page restores the native scroll offset before
    // the preloader/hero intro have a chance to play out from the top.
    ScrollTrigger.clearScrollMemory('manual')
    window.scrollTo(0, 0)

    Promise.all([document.fonts.ready, runPreloader()]).then(() => {
      sessionStorage.setItem(KEY, '1')
      setReady(true)
    })
  }, [setReady])

  return null
}
