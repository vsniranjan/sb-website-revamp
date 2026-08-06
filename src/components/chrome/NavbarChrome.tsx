'use client'

import { useEffect, useRef } from 'react'
import { initNavigation } from '@/lib/animations/interactions'

/** Runs the navbar shrink/mobile-menu/back-to-top wiring once per tab session. */
export function NavbarChrome() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    initNavigation()
  }, [])

  return null
}
