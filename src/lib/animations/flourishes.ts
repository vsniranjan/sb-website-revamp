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
    initTimelineNodes()
  }
}

/**
 * The three timeline nodes "power on" as the scrub-drawn progress line reaches
 * them — same scroll range as the line itself, so a second ScrollTrigger over
 * that range just toggles .is-lit past each node's proportional x position
 * (viewBox is 1200 wide; node positions are 60/480/1140, see CircuitTimeline).
 */
function initTimelineNodes(): void {
  const nodes = gsap.utils.toArray<SVGCircleElement>('.about__timeline-node')
  const thresholds = [60 / 1200, 480 / 1200, 1140 / 1200]
  ScrollTrigger.create({
    trigger: '.about',
    start: 'top 85%',
    end: 'bottom 75%',
    scrub: 1.2,
    onUpdate: (self) => {
      nodes.forEach((node, i) => {
        node.classList.toggle('is-lit', self.progress >= thresholds[i])
      })
    },
  })
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
  gsap.utils.toArray<SVGCircleElement>('.about__timeline-node').forEach((node) => {
    node.classList.add('is-lit')
  })
}
