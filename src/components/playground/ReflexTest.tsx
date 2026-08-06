'use client'

import { useRef, useState } from 'react'

type Phase = 'idle' | 'waiting' | 'go' | 'result' | 'early'

function rate(ms: number): string {
  if (ms < 150) return 'Faster than a relay switch.'
  if (ms < 200) return 'Solid-state speed.'
  if (ms < 250) return 'Copper-quick.'
  if (ms < 350) return 'Respectable response time.'
  return 'A bit of resistance there.'
}

/** Reaction-time test framed as "close the circuit" — the same reflex-test
 * mechanic that shows up across game-jam/marketing minigames, given a fit
 * that isn't arbitrary here: reaction latency is a real electrical-response
 * concept, not just a borrowed genre. */
export function ReflexTest() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const goAtRef = useRef(0)

  function start() {
    setPhase('waiting')
    setResult(null)
    const delay = 900 + Math.random() * 2200
    timeoutRef.current = window.setTimeout(() => {
      goAtRef.current = performance.now()
      setPhase('go')
    }, delay)
  }

  function handleClick() {
    if (phase === 'idle' || phase === 'result' || phase === 'early') {
      start()
      return
    }
    if (phase === 'waiting') {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      setPhase('early')
      return
    }
    if (phase === 'go') {
      const ms = Math.round(performance.now() - goAtRef.current)
      setResult(ms)
      setBest((b) => (b === null ? ms : Math.min(b, ms)))
      setPhase('result')
    }
  }

  return (
    <div
      className={`reflex-test reflex-test--${phase}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Reflex test — close the circuit"
    >
      <div className="reflex-test__stage">
        {phase === 'idle' && <p>Tap to start</p>}
        {phase === 'waiting' && <p>Wait for it…</p>}
        {phase === 'go' && <p className="reflex-test__go">CLOSE THE CIRCUIT</p>}
        {phase === 'early' && <p>Too soon — tap to retry</p>}
        {phase === 'result' && result !== null && (
          <>
            <p className="reflex-test__ms">{result}ms</p>
            <p className="reflex-test__rating">{rate(result)}</p>
          </>
        )}
      </div>
      {best !== null && <p className="reflex-test__best">Best: {best}ms</p>}
    </div>
  )
}
