import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

const HERO_BITS =
  '.hero__badge, .hero__title, .hero__ctas .btn, .hero__scrollcue, .navbar__inner'

/** Hide hero chrome before the preloader lifts so there is no un-animated flash. */
export function primeHero(): void {
  gsap.set(HERO_BITS, { autoAlpha: 0 })
}

/**
 * Hide everything the scroll reveals will animate, while the preloader still covers
 * the page.
 *
 * `ScrollTrigger.batch` builds its tween inside `onEnter`, and the section-head
 * timelines are not built until `initSectionReveals` runs after the preloader. Until
 * those moments the elements sit in their natural, fully visible state. So whatever
 * is on screen when the triggers are finally created gets snapped to hidden and
 * played back in, which reads as the page glitching out and recovering.
 *
 * Priming here means nothing is ever painted in a state it has not been animated to.
 * The matching `y` offset is applied now too, so the reveal is a `to` rather than a
 * `from` and never has to snap anything.
 */
export function primeReveals(): void {
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 32 })
  gsap.set('.section__head', { autoAlpha: 0 })
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
    if (!titleEl) {
      // primed hidden, but there is nothing here to animate, so restore it rather
      // than leaving the head invisible for good
      gsap.set(head, { autoAlpha: 1 })
      return
    }
    const split = new SplitText(titleEl, { type: 'lines', mask: 'lines' })
    gsap
      .timeline({
        scrollTrigger: { trigger: head, start: 'top 82%' },
        defaults: { ease: 'expo.out' },
      })
      .from(head.querySelector('.eyebrow'), { x: -18, autoAlpha: 0, duration: 0.9 })
      .from(split.lines, { yPercent: 105, duration: 1.4, stagger: 0.15 }, 0.1)
      .from(head.querySelector('.section__subtext'), { y: 18, autoAlpha: 0, duration: 1.1 }, 0.55)

    // The `from` tweens above render immediately, so the inner pieces are already
    // hidden. Lifting the primed container now cannot flash anything.
    gsap.set(head, { autoAlpha: 1 })
  })

  const revealed = new WeakSet<Element>()
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    onEnter: (batch) => {
      const fresh = batch.filter((el) => !revealed.has(el))
      if (!fresh.length) return
      fresh.forEach((el) => revealed.add(el))
      // `to`, not `from`: primeReveals already put these at y 32 and hidden, so there
      // is nothing to snap and no frame where the element is seen un-animated
      gsap.to(fresh, {
        y: 0,
        autoAlpha: 1,
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
