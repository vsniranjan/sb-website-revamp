import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Anchor navigation for same-page hash links (e.g. About's #societies jump). */
function scrollToTarget(hash: string): void {
  const el = hash === '#top' ? 0 : document.querySelector(hash)
  if (el === null) return
  if (typeof el === 'number') window.scrollTo({ top: 0 })
  else (el as Element).scrollIntoView({ behavior: 'smooth' })
}

export function initNavigation(): void {
  const navbar = document.getElementById('navbar')
  const burger = document.getElementById('nav-burger')
  const menu = document.getElementById('mobile-menu')

  // shrink/elevate navbar after leaving the very top
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => navbar?.classList.toggle('is-scrolled', self.scroll() > 40),
  })

  // smooth same-page anchor jumps (cross-page links are plain next/link hrefs by now)
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      e.preventDefault()
      closeMenu()
      scrollToTarget(hash)
      history.replaceState(null, '', hash)
    })
  })

  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  // mobile menu
  const closeMenu = (): void => {
    if (!menu?.classList.contains('is-open')) return
    menu.classList.remove('is-open')
    menu.setAttribute('aria-hidden', 'true')
    burger?.setAttribute('aria-expanded', 'false')
    burger?.setAttribute('aria-label', 'Open menu')
  }

  burger?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open') ?? false
    menu?.setAttribute('aria-hidden', String(!open))
    burger.setAttribute('aria-expanded', String(open))
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    if (open && menu) {
      gsap.from(menu.querySelectorAll('.menu__link, .menu__cta'), {
        y: 26,
        autoAlpha: 0,
        duration: 0.5,
        ease: 'expo.out',
        stagger: 0.05,
        clearProps: 'all',
      })
    }
  })

  document.querySelectorAll<HTMLAnchorElement>('.menu__link, .menu__cta').forEach((a) =>
    a.addEventListener('click', closeMenu),
  )

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })
}

/** Posters fade in as they decode; nothing pops into a half-drawn frame. */
function trackImageLoads(track: HTMLElement): void {
  track.querySelectorAll<HTMLImageElement>('.poster__img').forEach((img) => {
    if (img.complete) img.classList.add('is-loaded')
    else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true })
  })
}

/**
 * Posters sit off to the right of the viewport, so lazy loading would only fetch
 * them as the marquee dragged each one in — a visible blank. Once the reel itself
 * is near, fetch the whole strip.
 */
function preloadOnApproach(reel: HTMLElement, track: HTMLElement): void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      track.querySelectorAll<HTMLImageElement>('.poster__img').forEach((img) => {
        img.loading = 'eager'
      })
      observer.disconnect()
    },
    { rootMargin: '600px 0px' },
  )
  observer.observe(reel)
}

/** Poster travel speed, in CSS pixels per second — independent of how many posters there are. */
const REEL_SPEED = 64

/** Seamless auto-scrolling poster reel; eases to a stop on hover. */
/**
 * `staticReel` hands the strip to native scrolling instead of the marquee. Reserved
 * for reduced motion: touch devices run the marquee too, so the reel reads as alive
 * on a phone rather than as a strip that happens to be cut off.
 *
 * The hover pause is mouse-only by nature, so on touch `hovered` stays false and the
 * scroll-velocity boost drives the reel on its own.
 */
export function initGalleryMarquee(staticReel: boolean): void {
  const reel = document.getElementById('gallery-reel')
  const track = document.getElementById('gallery-track')
  if (!reel || !track) return

  trackImageLoads(track)
  preloadOnApproach(reel, track)

  if (staticReel) {
    // no marquee to carry posters past — hand the strip over to native scrolling
    reel.classList.add('is-static')
    return
  }

  const set = track.querySelector<HTMLElement>('.gallery__set')
  const loop = gsap.to(track, {
    xPercent: -50,
    duration: set ? set.offsetWidth / REEL_SPEED : 36,
    ease: 'none',
    repeat: -1,
  })

  let hovered = false
  reel.addEventListener('mouseenter', () => {
    hovered = true
    gsap.to(loop, { timeScale: 0, duration: 0.6 })
  })
  reel.addEventListener('mouseleave', () => {
    hovered = false
    gsap.to(loop, { timeScale: 1, duration: 0.6 })
  })

  // reel speeds up with scroll velocity; ticker decays it back to 1
  const clampBoost = gsap.utils.clamp(1, 4)
  ScrollTrigger.create({
    onUpdate: (self) => {
      if (hovered) return
      loop.timeScale(Math.max(loop.timeScale(), clampBoost(1 + Math.abs(self.getVelocity()) / 2200)))
    },
  })
  gsap.ticker.add(() => {
    if (hovered) return
    const ts = loop.timeScale()
    if (ts > 1) loop.timeScale(ts + (1 - ts) * 0.03)
  })
}
