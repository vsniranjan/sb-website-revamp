import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

import { renderContent } from './render'
import { WaveField } from './backdrop/WaveField'
import { runPreloader, skipPreloader } from './animations/preloader'
import {
  initCounters,
  initSectionReveals,
  primeHero,
  primeReveals,
  runHeroIntro,
  showEverythingInstantly,
} from './animations/reveals'
import { initGalleryMarquee, initNavigation } from './animations/interactions'
import {
  applyStaticFlourishes,
  initCallouts,
  initGauges,
  initLineDraws,
  initReticle,
  initRotors,
  initSectionNumbers,
  initTicker,
} from './animations/flourishes'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin)

/**
 * Refreshing part-way down the page restores the native scroll offset while
 * ScrollSmoother is still measuring the page, which lands the reader mid-site
 * with the preloader over it and the hero intro playing out of sight. The site is
 * built to open from the top, so drop the restore.
 *
 * Through ScrollTrigger rather than `history.scrollRestoration` directly: it
 * caches the restoration mode when it initialises — during the import above, so
 * before any of this module's own code — and writes that cached value back later,
 * undoing a plain assignment.
 */
ScrollTrigger.clearScrollMemory('manual')
window.scrollTo(0, 0)

renderContent()

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches

const canvas = document.getElementById('backdrop') as HTMLCanvasElement
const backdrop = new WaveField(canvas, { mobile, animate: !reducedMotion })

async function start(): Promise<void> {
  if (reducedMotion) {
    skipPreloader()
    showEverythingInstantly()
    applyStaticFlourishes()
    initNavigation(null)
    initGalleryMarquee(true)
    return
  }

  primeHero()
  primeReveals()

  /**
   * ScrollSmoother drives the page through a transformed wrapper, which fights the
   * browser's own momentum and address-bar behaviour on touch devices — the scroll
   * ends up feeling heavy and lagging a finger behind. Phones keep native scrolling;
   * `initNavigation` already falls back to `scrollIntoView` when there is no smoother.
   */
  const smoother = mobile
    ? null
    : ScrollSmoother.create({
        smooth: 1.1,
        effects: false,
        normalizeScroll: false,
      })

  initNavigation(smoother)
  initGalleryMarquee(false)

  // SplitText needs final metrics — wait for fonts while the preloader plays.
  await Promise.all([document.fonts.ready, runPreloader()])

  runHeroIntro()
  backdrop.drawIn()
  initSectionReveals()
  initCounters()
  initLineDraws()
  initGauges()
  initRotors()
  initCallouts()
  initTicker()
  initSectionNumbers()
  initReticle()
  ScrollTrigger.refresh()
}

void start()

if (import.meta.env.DEV) {
  Object.assign(window, { __dbg: { backdrop, gsap, ScrollTrigger } })
}
