import { gsap } from '@/lib/gsap-setup'

/** Minimum pixel distance between pointermove events before a new spark spawns —
 * keeps a slow-moving pointer from burning through the whole pool in one place. */
const TRAIL_MIN_DIST = 14

/**
 * Circuit cursor: crosshair ring, a pooled spark trail, and a hover-circuit
 * trace drawn to whatever's under the pointer. Fine pointers only — touch gets
 * a CSS-only tap pulse instead (see the `(hover: none)` block in base.css).
 *
 * The ring is positioned with a direct style write on every pointermove, not a
 * tween — any eased/duration-based follow reads as lag behind the real cursor,
 * which is the opposite of what a cursor replacement should feel like.
 */
export function initCursor(): void {
  const reticle = document.getElementById('reticle')
  const trail = document.getElementById('reticle-trail')
  const tracePath = document.getElementById('circuit-trace-path') as SVGPathElement | null
  if (!reticle || !trail) return
  if (!window.matchMedia('(pointer: fine)').matches) return

  // cursor is live — hide the native cursor site-wide
  document.body.classList.add('has-reticle')

  const sparks = Array.from(trail.children) as HTMLElement[]
  let sparkIndex = 0
  let lastSparkX = 0
  let lastSparkY = 0
  let shown = false

  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      shown = true
      gsap.to(reticle, { opacity: 1, duration: 0.4 })
    }
    reticle.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`

    const dx = e.clientX - lastSparkX
    const dy = e.clientY - lastSparkY
    if (dx * dx + dy * dy < TRAIL_MIN_DIST * TRAIL_MIN_DIST) return
    lastSparkX = e.clientX
    lastSparkY = e.clientY
    spawnSpark(sparks[sparkIndex], e.clientX, e.clientY)
    sparkIndex = (sparkIndex + 1) % sparks.length
  })

  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element
    const hoverTarget = target.closest('a, button, [data-circuit]')
    reticle.classList.toggle('is-hover', !!hoverTarget)
    // section-accent-filled surfaces would swallow a same-color cursor
    reticle.classList.toggle('is-inverted', !!target.closest('.event-row, .btn--primary'))
    if (hoverTarget && tracePath) {
      drawTrace(tracePath, hoverTarget, e.clientX, e.clientY)
    }
  })

  document.addEventListener('mouseout', (e) => {
    const target = e.target as Element
    if (tracePath && target.closest('a, button, [data-circuit]')) {
      undrawTrace(tracePath)
    }
  })
}

/** Burst a pooled spark dot from the pointer's current position. The pool is
 * fixed-size and cycled by index — dots are repositioned and re-faded, never
 * created or removed, so the trail costs one transform + opacity write. */
function spawnSpark(spark: HTMLElement | undefined, x: number, y: number): void {
  if (!spark) return
  gsap.killTweensOf(spark)
  gsap.fromTo(
    spark,
    { x, y, opacity: 0.85, scale: 1 },
    { opacity: 0, scale: 0.2, duration: 0.6, ease: 'power2.out' },
  )
}

/** Straight elbow (horizontal-then-vertical) between two points — the same
 * shape language as the intro/about circuit traces, so a hover connection
 * reads as the same visual system rather than a second effect. */
function elbowPath(x1: number, y1: number, x2: number, y2: number): string {
  const midX = x1 + (x2 - x1) / 2
  return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`
}

function drawTrace(path: SVGPathElement, target: Element, originX: number, originY: number): void {
  const rect = target.getBoundingClientRect()
  const tx = rect.left + rect.width / 2
  const ty = rect.top + rect.height / 2
  path.setAttribute('d', elbowPath(originX, originY, tx, ty))
  gsap.killTweensOf(path)
  gsap.fromTo(path, { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: 0.55, duration: 0.35, ease: 'power2.out' })
}

/**
 * Radial burst from a fixed point, reusing the same pooled spark elements the
 * trail uses — a burst is just "spawn every dot outward from one origin"
 * instead of "spawn one dot at the moving pointer," so it's the same
 * primitive as spawnSpark rather than a second particle system. Doesn't
 * depend on initCursor() having run, so it also works on touch/reduced-input
 * devices for the easter egg trigger.
 */
export function burstSparksAt(x: number, y: number): void {
  const trail = document.getElementById('reticle-trail')
  if (!trail) return
  const sparks = Array.from(trail.children) as HTMLElement[]
  sparks.forEach((spark, i) => {
    const angle = (i / sparks.length) * Math.PI * 2 + Math.random() * 0.4
    const distance = 60 + Math.random() * 60
    gsap.killTweensOf(spark)
    gsap.fromTo(
      spark,
      { x, y, opacity: 1, scale: 1.4 },
      {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.2,
        duration: 0.9,
        ease: 'power2.out',
      },
    )
  })
}

function undrawTrace(path: SVGPathElement): void {
  gsap.killTweensOf(path)
  gsap.to(path, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => gsap.set(path, { drawSVG: '0%' }),
  })
}
