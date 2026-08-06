'use client'

import { useRef, useState } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react'
import { gsap } from '@/lib/gsap-setup'
import { funFacts } from '@/lib/fun-facts'

const HUES = ['var(--hue-blue)', 'var(--hue-violet)', 'var(--hue-coral)', 'var(--hue-amber)']
const SEG_ANGLE = 360 / funFacts.length

function wheelGradient(): string {
  const stops = funFacts.map((_, i) => `${HUES[i % HUES.length]} ${i * SEG_ANGLE}deg ${(i + 1) * SEG_ANGLE}deg`)
  return `conic-gradient(from 0deg, ${stops.join(', ')})`
}

/**
 * Spins to a random final rotation rather than solving rotation-math to hit a
 * chosen segment — the fact shown is just whichever segment ends up under the
 * fixed pointer, derived from the actual landed angle. Same randomness from
 * the visitor's side, far less to get subtly wrong.
 */
export function FunFactWheel() {
  const wheelRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const [fact, setFact] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)

  function spin() {
    if (spinning || !wheelRef.current) return
    setSpinning(true)
    setFact(null)
    const next = rotationRef.current + 1080 + Math.random() * 360
    rotationRef.current = next
    gsap.to(wheelRef.current, {
      rotation: next,
      duration: 2.4,
      ease: 'power3.out',
      onComplete: () => {
        const normalized = (360 - (next % 360)) % 360
        const index = Math.floor(normalized / SEG_ANGLE) % funFacts.length
        setFact(funFacts[index])
        setSpinning(false)
      },
    })
  }

  return (
    <div className="fact-wheel">
      <div className="fact-wheel__stage">
        <span className="fact-wheel__pointer" aria-hidden="true" />
        <div
          className="fact-wheel__disc"
          ref={wheelRef}
          style={{ background: wheelGradient() }}
          aria-hidden="true"
        />
      </div>
      <button className="btn btn--secondary fact-wheel__btn" type="button" onClick={spin} disabled={spinning}>
        <ArrowClockwise size={16} weight="bold" aria-hidden="true" />
        {spinning ? 'Spinning…' : 'Spin for a fun fact'}
      </button>
      <p className="fact-wheel__result" role="status" aria-live="polite">
        {fact}
      </p>
    </div>
  )
}
