import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Blueprint } from './Blueprint'

/**
 * Scrubs the sketch morph index (0..8) as each data-scene section
 * approaches the viewport. Free-flowing scroll — no pinning.
 */
export function initScrollSync(backdrop: Blueprint): void {
  if (!backdrop.ok) return
  const sections = gsap.utils.toArray<HTMLElement>('[data-scene]')
  sections.forEach((section, i) => {
    if (i === 0) return
    gsap.to(backdrop.morph, {
      value: i,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 25%',
        scrub: 1.2,
      },
    })
  })
  ScrollTrigger.refresh()
}
