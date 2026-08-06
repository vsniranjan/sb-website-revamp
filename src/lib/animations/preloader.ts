import gsap from 'gsap'

/**
 * Short branded opener (~1s): counter to 100 + logo line-draw, then lifts away.
 * Resolves when the preloader has fully cleared so the hero reveal can start.
 */
export function runPreloader(): Promise<void> {
  return new Promise((resolve) => {
    const root = document.getElementById('preloader')
    const counter = document.getElementById('preloader-counter')
    if (!root || !counter) {
      resolve()
      return
    }

    const state = { n: 0 }
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        // Not root.remove(): the preloader is owned by React's persistent root
        // layout, which never re-renders to learn the node is gone. A later
        // client-side navigation touching a sibling then throws trying to
        // reference it. The autoAlpha tween below already leaves it fully
        // invisible and non-interactive, so hiding is enough — no need to
        // detach it from the DOM.
        root.style.pointerEvents = 'none'
        resolve()
      },
    })

    tl.to('.preloader__circle', { strokeDashoffset: 0, duration: 0.7 }, 0)
      .to('.preloader__bolt', { strokeDashoffset: 0, duration: 0.55 }, 0.15)
      .to(
        state,
        {
          n: 100,
          duration: 0.85,
          ease: 'power1.inOut',
          onUpdate: () => {
            counter.textContent = String(Math.round(state.n)).padStart(2, '0')
          },
        },
        0,
      )
      .to(root, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0.95)
  })
}

/** Reduced-motion path: drop the preloader instantly. */
export function skipPreloader(): void {
  const root = document.getElementById('preloader')
  if (!root) return
  gsap.set(root, { autoAlpha: 0 })
  root.style.pointerEvents = 'none'
}
