import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

const HERO_BITS =
  '.hero__badge, .hero__title, .hero__ctas .btn, .hero__scrollcue, .navbar__inner'

/** Hide hero chrome before the preloader lifts so there is no un-animated flash. */
export function primeHero(): void {
  gsap.set(HERO_BITS, { autoAlpha: 0 })
}

/** Choreographed hero entrance, run once the preloader clears. */
export function runHeroIntro(): void {
  gsap.set(HERO_BITS, { clearProps: 'opacity,visibility' })
  const title = new SplitText('.hero__title', { type: 'lines, words', mask: 'lines' })
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  tl.from('.hero__badge', { y: 18, autoAlpha: 0, duration: 0.9 })
    .from(
      title.words,
      { yPercent: 110, duration: 1.5, stagger: 0.12 },
      0.15,
    )
    .from('.hero__ctas .btn', { y: 20, autoAlpha: 0, duration: 1, stagger: 0.14 }, 0.75)
    .from('.hero__scrollcue', { autoAlpha: 0, duration: 1, ease: 'power1.out' }, 1.15)
    .from('.navbar__inner', { y: -16, autoAlpha: 0, duration: 1 }, 0.35)
}

/**
 * Scroll-triggered entrances for every section head + card. No pinning, and each
 * animation plays exactly once.
 *
 * Deliberately no `once: true` anywhere: that option makes a ScrollTrigger kill
 * itself from inside its own toggle, and every trigger already past its start
 * when the triggers are built — the normal case whenever the page loads part-way
 * down — fires during the first refresh pass. Each kill splices the global
 * trigger array that pass is still walking, and the boot dies on
 * `Cannot read properties of undefined (reading 'end')`, taking every later
 * init with it. Attached tweens are already at their end state on a second
 * enter, so replaying them is a no-op; callbacks guard themselves.
 */
export function initSectionReveals(): void {
  gsap.utils.toArray<HTMLElement>('.section__head').forEach((head) => {
    const titleEl = head.querySelector('.section__title')
    if (!titleEl) return
    const split = new SplitText(titleEl, { type: 'lines', mask: 'lines' })
    gsap
      .timeline({
        scrollTrigger: { trigger: head, start: 'top 82%' },
        defaults: { ease: 'expo.out' },
      })
      .from(head.querySelector('.eyebrow'), { x: -18, autoAlpha: 0, duration: 0.9 })
      .from(split.lines, { yPercent: 105, duration: 1.4, stagger: 0.15 }, 0.1)
      .from(head.querySelector('.section__subtext'), { y: 18, autoAlpha: 0, duration: 1.1 }, 0.55)
  })

  const revealed = new WeakSet<Element>()
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    onEnter: (batch) => {
      const fresh = batch.filter((el) => !revealed.has(el))
      if (!fresh.length) return
      fresh.forEach((el) => revealed.add(el))
      gsap.from(fresh, {
        y: 32,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.13,
      })
    },
  })
}

/** Stat counters — count up once when scrolled into view. */
export function initCounters(): void {
  gsap.utils.toArray<HTMLElement>('.counter').forEach((el) => {
    const target = Number(el.dataset.counter ?? '0')
    const state = { n: 0 }
    let counted = false
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (counted) return
        counted = true
        gsap.to(state, {
          n: target,
          duration: 2.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(state.n).toLocaleString('en-US')
          },
        })
      },
    })
  })
}

/** Reduced-motion path: everything visible, counters at final value. */
export function showEverythingInstantly(): void {
  gsap.utils.toArray<HTMLElement>('.counter').forEach((el) => {
    const target = Number(el.dataset.counter ?? '0')
    el.textContent = target.toLocaleString('en-US')
  })
}
