'use client'

import { useEffect, useRef, useState } from 'react'
import { burstSparksAt } from '@/lib/animations/cursor'

const ORB_COUNT = 8
const COLLECT_RADIUS = 36

interface Orb {
  id: number
  x: number
  y: number
}

/** Fine-pointer-only bonus layer on top of the plain easter-egg burst: move
 * the cursor near a scattered orb to collect it. Not offered on touch/reduced
 * motion — the plain celebrate() burst+toast already covers those, this is
 * additive, not the only path to acknowledging the trigger. */
export function SparkCollectGame({ onComplete }: { onComplete: () => void }) {
  const [orbs, setOrbs] = useState<Orb[]>([])
  const collectedRef = useRef(0)

  useEffect(() => {
    const margin = 80
    setOrbs(
      Array.from({ length: ORB_COUNT }, (_, i) => ({
        id: i,
        x: margin + Math.random() * (window.innerWidth - margin * 2),
        y: margin + Math.random() * (window.innerHeight - margin * 2),
      })),
    )
  }, [])

  useEffect(() => {
    function onMove(e: PointerEvent) {
      setOrbs((prev) =>
        prev.filter((orb) => {
          const dx = orb.x - e.clientX
          const dy = orb.y - e.clientY
          const hit = dx * dx + dy * dy < COLLECT_RADIUS * COLLECT_RADIUS
          if (hit) {
            burstSparksAt(orb.x, orb.y)
            collectedRef.current += 1
            if (collectedRef.current >= ORB_COUNT) window.setTimeout(onComplete, 300)
          }
          return !hit
        }),
      )
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [onComplete])

  return (
    <div className="spark-game" aria-hidden="true">
      {orbs.map((orb) => (
        <span className="spark-game__orb" key={orb.id} style={{ left: orb.x, top: orb.y }} />
      ))}
    </div>
  )
}
