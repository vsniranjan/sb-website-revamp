'use client'

import { useEffect, useRef, useState } from 'react'

const GRAVITY = 0.45
const JUMP_SPEED = 13
const OBSTACLE_SPEED = 3
const SPAWN_MIN_MS = 1300
const SPAWN_MAX_MS = 2400
const PLAYER_X = 40
const PLAYER_WIDTH = 32
const OBSTACLE_WIDTH = 18
const JUMP_CLEARANCE = 26

type GameState = 'idle' | 'running' | 'over'

interface ObstacleNode {
  x: number
  el: HTMLDivElement
}

/**
 * Chrome-dino-shaped runner, restyled to the site's circuit motif — a spark
 * hops over resistor obstacles along a trace. DOM-driven at 60fps via direct
 * style writes (no React state in the hot loop), same imperative-animation
 * pattern already used for the cursor's spark trail — a rAF-driven re-render
 * loop would be needlessly wasteful here.
 */
export function SignalLostGame() {
  const [state, setState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const velocityRef = useRef(0)
  const playerYRef = useRef(0)
  const obstaclesRef = useRef<ObstacleNode[]>([])
  const nextSpawnRef = useRef(0)
  const startTimeRef = useRef(0)
  const lastScoreRef = useRef(0)
  const stateRef = useRef<GameState>('idle')

  useEffect(() => {
    stateRef.current = state
  }, [state])

  function clearObstacles() {
    obstaclesRef.current.forEach((o) => o.el.remove())
    obstaclesRef.current = []
  }

  function start() {
    velocityRef.current = 0
    playerYRef.current = 0
    clearObstacles()
    lastScoreRef.current = 0
    setScore(0)
    startTimeRef.current = performance.now()
    nextSpawnRef.current = startTimeRef.current + SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS)
    setState('running')
  }

  function jump() {
    if (playerYRef.current === 0) velocityRef.current = JUMP_SPEED
  }

  function handleInput() {
    if (stateRef.current === 'idle' || stateRef.current === 'over') start()
    else jump()
  }

  function gameOver() {
    setState('over')
    setBest((b) => Math.max(b, lastScoreRef.current))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        handleInput()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (state !== 'running') return
    let raf: number
    const track = trackRef.current
    const player = playerRef.current
    if (!track || !player) return

    function frame(now: number) {
      // player physics
      velocityRef.current -= GRAVITY
      playerYRef.current = Math.max(0, playerYRef.current + velocityRef.current)
      if (playerYRef.current === 0) velocityRef.current = 0
      if (player) player.style.transform = `translateY(-${playerYRef.current}px)`

      // spawn
      if (now >= nextSpawnRef.current) {
        const el = document.createElement('div')
        el.className = 'signal-game__obstacle'
        track!.appendChild(el)
        obstaclesRef.current.push({ x: track!.clientWidth, el })
        nextSpawnRef.current = now + SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS)
      }

      // advance + collide + cull
      let collided = false
      obstaclesRef.current = obstaclesRef.current.filter((o) => {
        o.x -= OBSTACLE_SPEED
        if (o.x < -OBSTACLE_WIDTH) {
          o.el.remove()
          return false
        }
        o.el.style.transform = `translateX(${o.x}px)`
        const overlapX = o.x < PLAYER_X + PLAYER_WIDTH && o.x + OBSTACLE_WIDTH > PLAYER_X
        if (overlapX && playerYRef.current < JUMP_CLEARANCE) collided = true
        return true
      })

      const elapsedScore = Math.floor((now - startTimeRef.current) / 100)
      if (elapsedScore !== lastScoreRef.current) {
        lastScoreRef.current = elapsedScore
        setScore(elapsedScore)
      }

      if (collided) {
        gameOver()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [state])

  useEffect(() => clearObstacles, [])

  return (
    <div className="signal-game" onClick={handleInput} role="button" tabIndex={0}>
      <div className="signal-game__hud">
        <span>SCORE {score}</span>
        <span>BEST {best}</span>
      </div>
      <div className="signal-game__track" ref={trackRef}>
        <div className="signal-game__player" ref={playerRef} />
        <div className="signal-game__ground" aria-hidden="true" />
      </div>
      <p className="signal-game__hint">
        {state === 'idle' && 'Tap or press space to start'}
        {state === 'running' && 'Tap or press space to jump'}
        {state === 'over' && 'Signal lost — tap or press space to retry'}
      </p>
    </div>
  )
}
