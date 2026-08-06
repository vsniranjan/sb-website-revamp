'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ROUTE_ACCENT: Record<string, { accent: string; contrast: string; gradient: string }> = {
  '/': { accent: 'var(--accent-home)', contrast: 'var(--hue-blue-contrast)', gradient: 'var(--gradient-blue)' },
  '/about': {
    accent: 'var(--accent-about)',
    contrast: 'var(--hue-violet-contrast)',
    gradient: 'var(--gradient-violet)',
  },
  '/events': {
    accent: 'var(--accent-events)',
    contrast: 'var(--hue-coral-contrast)',
    gradient: 'var(--gradient-coral)',
  },
  '/team': { accent: 'var(--accent-team)', contrast: 'var(--hue-amber-contrast)', gradient: 'var(--gradient-amber)' },
  '/contact': {
    accent: 'var(--accent-contact)',
    contrast: 'var(--hue-blue-contrast)',
    gradient: 'var(--gradient-blue)',
  },
  '/playground': {
    accent: 'var(--accent-playground)',
    contrast: 'var(--hue-violet-contrast)',
    gradient: 'var(--gradient-violet)',
  },
}

/**
 * Chrome (the cursor, in practice) sits outside `#content`, so it can't inherit
 * a page's --accent-section from its wrapper class the way page content does.
 * This mirrors the current route's accent onto the document root instead, for
 * chrome only — page content keeps its own cascade-based override from
 * sections.css regardless of what this does. Gallery has no entry, so it falls
 * through to the root's default (brand blue), matching that page staying on
 * the neutral global accent.
 */
export function SectionAccentSync() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement.style
    const match = ROUTE_ACCENT[pathname]
    if (match) {
      root.setProperty('--accent-section', match.accent)
      root.setProperty('--on-accent-section', match.contrast)
      root.setProperty('--gradient-section', match.gradient)
    } else {
      root.removeProperty('--accent-section')
      root.removeProperty('--on-accent-section')
      root.removeProperty('--gradient-section')
    }
  }, [pathname])

  return null
}
