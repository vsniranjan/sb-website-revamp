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
        scrollTrigger: { trigger: board, start: 'top 88%', once: true },
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

/** Gauge dials sweep in once when the stats scroll into view. */
export function initGauges(): void {
  gsap.utils.toArray<SVGCircleElement>('.gauge__fill').forEach((fill) => {
    const frac = Number(fill.dataset.fill ?? '0')
    const ARC = 226.2
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(fill, { strokeDashoffset: ARC * (1 - frac), duration: 2.8, ease: 'expo.out' })
      },
    })
  })

  gsap.utils.toArray<SVGLineElement>('.gauge__needle').forEach((needle) => {
    const frac = Number(needle.dataset.fill ?? '0')
    gsap.set(needle, { rotation: -135, svgOrigin: '60 60' })
    ScrollTrigger.create({
      trigger: needle,
      start: 'top 85%',
      once: true,
      onEnter: () => {
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

/** Rotating ring text: the 1988 seal and each execom badge. */
export function initRotors(): void {
  gsap.utils.toArray<SVGGElement>('.seal__rotor, .plate__rotor').forEach((rotor, i) => {
    gsap.to(rotor, {
      rotation: i % 2 ? -360 : 360,
      svgOrigin: '60 60',
      duration: 40,
      ease: 'none',
      repeat: -1,
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
        scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      },
    )
  })
}

/** Mono ticker strip above the footer. */
export function initTicker(): void {
  const track = document.getElementById('ticker-track')
  if (!track) return
  gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
}

/** Ghost section numbers drift slowly against scroll. */
export function initSectionNumbers(): void {
  gsap.utils.toArray<HTMLElement>('.section__num').forEach((num) => {
    gsap.fromTo(
      num,
      { yPercent: 18 },
      {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: num.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
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

/** Crosshair cursor follower (fine pointers only). */
export function initReticle(): void {
  const reticle = document.getElementById('reticle')
  if (!reticle) return
  if (!window.matchMedia('(pointer: fine)').matches) return

  // reticle is live — hide the native cursor site-wide
  document.body.classList.add('has-reticle')

  const toX = gsap.quickTo(reticle, 'x', { duration: 0.35, ease: 'power3.out' })
  const toY = gsap.quickTo(reticle, 'y', { duration: 0.35, ease: 'power3.out' })
  let shown = false

  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      shown = true
      gsap.to(reticle, { opacity: 1, duration: 0.4 })
    }
    toX(e.clientX)
    toY(e.clientY)
  })

  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element
    reticle.classList.toggle('is-hover', !!target.closest('a, button'))
    // blue-filled surfaces would swallow the blue reticle
    reticle.classList.toggle('is-inverted', !!target.closest('.event-row, .btn--primary'))
  })
}
