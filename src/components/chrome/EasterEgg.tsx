'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap-setup'
import { burstSparksAt } from '@/lib/animations/cursor'
import { SparkCollectGame } from './SparkCollectGame'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]
const CLICK_THRESHOLD = 5
const CLICK_WINDOW_MS = 1500
const MESSAGES = ['Sparks!', 'Circuit closed.', 'Nice find.', 'Powered up.']

/**
 * Always-mounted chrome (not BootController — that's once-per-session boot
 * logic, this needs to be repeatable every time, all session). Two triggers:
 * a konami-style key sequence, and clicking the navbar logo several times
 * fast. A single accidental trigger (logo-click threshold) always does the
 * plain quick burst. The deliberate konami sequence upgrades to the full
 * collect-mode mini-game on fine pointers with motion allowed — on
 * touch/reduced-motion it falls back to the same plain burst, since a
 * cursor-proximity game has no touch equivalent worth building.
 */
export function EasterEgg() {
  const [message, setMessage] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [gameActive, setGameActive] = useState(false)
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let keyBuffer: string[] = []
    let clickTimes: number[] = []

    function celebrate(x: number, y: number) {
      const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      setDisplayText(text)
      setMessage(text)
      if (!reducedMotion) burstSparksAt(x, y)
      window.setTimeout(() => setMessage(null), reducedMotion ? 1400 : 1800)
    }

    function onKeydown(e: KeyboardEvent) {
      keyBuffer.push(e.code)
      if (keyBuffer.length > KONAMI.length) keyBuffer.shift()
      if (keyBuffer.length === KONAMI.length && keyBuffer.every((k, i) => k === KONAMI[i])) {
        keyBuffer = []
        if (!reducedMotion && finePointer) {
          setDisplayText('Collect all the sparks!')
          setMessage('Collect all the sparks!')
          window.setTimeout(() => setMessage(null), 1800)
          setGameActive(true)
        } else {
          celebrate(window.innerWidth / 2, window.innerHeight / 2)
        }
      }
    }

    function onClick(e: MouseEvent) {
      const brand = (e.target as Element).closest('.navbar__brand')
      if (!brand) return
      const now = Date.now()
      clickTimes = [...clickTimes.filter((t) => now - t < CLICK_WINDOW_MS), now]
      if (clickTimes.length >= CLICK_THRESHOLD) {
        clickTimes = []
        e.preventDefault()
        const rect = brand.getBoundingClientRect()
        celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }
    }

    window.addEventListener('keydown', onKeydown)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKeydown)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    if (!toastRef.current) return
    gsap.to(toastRef.current, {
      autoAlpha: message ? 1 : 0,
      y: message ? 0 : 10,
      duration: message ? 0.35 : 0.3,
      ease: message ? 'power2.out' : 'power2.in',
    })
  }, [message])

  return (
    <>
      <div className="easter-toast" ref={toastRef} role="status" aria-live="polite">
        {displayText}
      </div>
      {gameActive && (
        <SparkCollectGame
          onComplete={() => {
            setGameActive(false)
            setDisplayText('All sparks collected!')
            setMessage('All sparks collected!')
            window.setTimeout(() => setMessage(null), 1800)
          }}
        />
      )}
    </>
  )
}
