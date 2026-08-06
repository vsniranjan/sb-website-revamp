'use client'

import { useEffect, useRef } from 'react'
import { WaveField } from '@/lib/backdrop/WaveField'
import { usePreloader } from './PreloaderContext'

export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<WaveField | null>(null)
  const { ready } = usePreloader()

  useEffect(() => {
    if (!canvasRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
    const lowPowerHardware = (navigator.hardwareConcurrency ?? 8) <= 4
    fieldRef.current = new WaveField(canvasRef.current, {
      lowPower: mobile || lowPowerHardware,
      animate: !reducedMotion,
    })
  }, [])

  useEffect(() => {
    if (ready) fieldRef.current?.drawIn()
  }, [ready])

  return <canvas className="backdrop" id="backdrop" ref={canvasRef} aria-hidden="true" />
}
