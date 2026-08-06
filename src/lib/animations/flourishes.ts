import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Circuit traces (intro), timeline rail (about) — drawn as you scroll. */
export function initLineDraws(): void {
  const board = document.querySelector('.intro__board')
  if (board) {
    gsap.fromTo(
      '.intro__traces .trace',
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        stagger: 0.15,
        scrollTrigger: { trigger: board, start: 'top 95%', end: 'bottom 45%', scrub: 1.2 },
      },
    )
    gsap.fromTo(
      '.intro__traces .trace-pad',
      { scale: 0, transformOrigin: 'center' },
      {
        scale: 1,
        ease: 'expo.out',
        stagger: 0.35,
        duration: 1,
        scrollTrigger: { trigger: board, start: 'top 88%' },
      },
    )
  }

  const timeline = document.querySelector('.about__timeline')
  if (timeline) {
    gsap.fromTo(
      '.about__timeline-progress',
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top 85%', end: 'bottom 75%', scrub: 1.2 },
      },
    )
  }
}

/**
 * Gauge dials sweep in once when the stats scroll into view. Guarded by a flag
 * rather than `once: true` — see the note in reveals.ts for why that option
 * breaks any load that starts part-way down the page.
 */
export function initGauges(): void {
  gsap.utils.toArray<SVGCircleElement>('.gauge__fill').forEach((fill) => {
    const frac = Number(fill.dataset.fill ?? '0')
    const ARC = 226.2
    let swept = false
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 85%',
      onEnter: () => {
        if (swept) return
        swept = true
        gsap.to(fill, { strokeDashoffset: ARC * (1 - frac), duration: 2.8, ease: 'expo.out' })
      },
    })
  })

  gsap.utils.toArray<SVGLineElement>('.gauge__needle').forEach((needle) => {
    const frac = Number(needle.dataset.fill ?? '0')
    gsap.set(needle, { rotation: -135, svgOrigin: '60 60' })
    let swung = false
    ScrollTrigger.create({
      trigger: needle,
      start: 'top 85%',
      onEnter: () => {
        if (swung) return
        swung = true
        gsap.to(needle, {
          rotation: -135 + 270 * frac,
          svgOrigin: '60 60',
          duration: 2.8,
          ease: 'expo.out',
        })
      },
    })
  })
}

/** Benefit callout leader lines draw when each row reveals. */
export function initCallouts(): void {
  gsap.utils.toArray<HTMLElement>('.callout').forEach((row) => {
    const leader = row.querySelector('.callout__leader i')
    if (!leader) return
    gsap.fromTo(
      leader,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: row, start: 'top 90%' },
      },
    )
  })
}

/** Reduced-motion path: render every flourish at its finished state, no animation. */
export function applyStaticFlourishes(): void {
  const ARC = 226.2
  gsap.utils.toArray<SVGCircleElement>('.gauge__fill').forEach((fill) => {
    fill.style.strokeDashoffset = String(ARC * (1 - Number(fill.dataset.fill ?? '0')))
  })
  gsap.utils.toArray<SVGLineElement>('.gauge__needle').forEach((needle) => {
    gsap.set(needle, { rotation: -135 + 270 * Number(needle.dataset.fill ?? '0'), svgOrigin: '60 60' })
  })
}

/**
 * Crosshair cursor follower (fine pointers only). Positioned with a direct
 * style write on every pointermove, not a tween — any eased/duration-based
 * follow reads as lag behind the real cursor, which is the opposite of what
 * a cursor replacement should feel like.
 */
export function initReticle(): void {
  const reticle = document.getElementById('reticle')
  if (!reticle) return
  if (!window.matchMedia('(pointer: fine)').matches) return

  // reticle is live — hide the native cursor site-wide
  document.body.classList.add('has-reticle')

  let shown = false

  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      shown = true
      gsap.to(reticle, { opacity: 1, duration: 0.4 })
    }
    reticle.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
  })

  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element
    reticle.classList.toggle('is-hover', !!target.closest('a, button'))
    // blue-filled surfaces would swallow the blue reticle
    reticle.classList.toggle('is-inverted', !!target.closest('.event-row, .btn--primary'))
  })
}
