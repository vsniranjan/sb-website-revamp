'use client'

import { useEffect, useRef } from 'react'
import { initGalleryMarquee } from '@/lib/animations/interactions'

/** Wires the gallery reel's marquee loop — runs immediately on mount, once per page-view. */
export function GalleryMarquee() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    initGalleryMarquee(reducedMotion)
  }, [])

  return null
}
