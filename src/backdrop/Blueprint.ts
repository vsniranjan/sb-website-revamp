import gsap from 'gsap'
import { SKETCHES, type Prim, type Sketch } from './sketches'

const BLUE = '0, 98, 155'

const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1)
const smoothstep = (t: number): number => t * t * (3 - 2 * t)

/**
 * "Living blueprint" backdrop: a fixed 2D canvas that drafts one linework
 * composition per section — primitives stroke themselves in, staggered, as
 * the scroll-scrubbed morph index (0..8) moves; the previous sketch un-draws.
 * Exposes the same { ok, morph } API the old 3D Experience had.
 */
export class Blueprint {
  readonly ok: boolean
  /** 0..8 continuous section index; scrollSync scrubs this. */
  readonly morph = { value: 0 }
  /** 0..1 draw-in for the hero sketch, which has no scroll range to scrub. */
  readonly intro = { value: 1 }

  private ctx!: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private w = 0
  private h = 0
  private dpr = 1
  private pointer = { x: 0, y: 0 }
  private sections: HTMLElement[] = []
  private time = 0
  private animate: boolean
  private mobile: boolean

  constructor(canvas: HTMLCanvasElement, opts: { mobile: boolean; animate: boolean }) {
    this.canvas = canvas
    this.animate = opts.animate
    this.mobile = opts.mobile
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      this.ok = false
      canvas.style.display = 'none'
      return
    }
    this.ok = true
    this.ctx = ctx
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 2)

    this.resize()
    window.addEventListener('resize', this.onResize)
    if (!opts.mobile) window.addEventListener('pointermove', this.onPointerMove)

    if (this.animate) {
      // hold the hero sketch back until drawIn() drafts it
      this.intro.value = 0
      gsap.ticker.add(this.tick)
    } else {
      this.render()
      window.addEventListener('scroll', () => this.render(), { passive: true })
      // canvas labels need IBM Plex Mono — repaint once fonts arrive
      document.fonts.ready.then(() => this.render())
    }
  }

  /** Draft the hero sketch in from nothing. Called once the preloader clears. */
  drawIn(): void {
    if (!this.ok || !this.animate) return
    gsap.to(this.intro, { value: 1, duration: 2, ease: 'power2.inOut' })
  }

  private onResize = (): void => {
    this.resize()
    this.render()
  }

  private onPointerMove = (e: PointerEvent): void => {
    this.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    this.pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
  }

  private resize(): void {
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
  }

  private tick = (_time: number, deltaTime: number): void => {
    this.time += deltaTime / 1000
    this.render()
  }

  private render(): void {
    const ctx = this.ctx
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.w, this.h)
    ctx.translate(this.pointer.x * 6, this.pointer.y * 6)
    ctx.lineCap = 'round'

    if (this.sections.length === 0) {
      this.sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    }

    const v = this.morph.value
    for (let i = 0; i < SKETCHES.length; i++) {
      const el = this.sections[i]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -80 || rect.top > this.h + 80) continue
      // draw-in as the section arrives, un-draw as it leaves; anchored to the
      // section so the sketch scrolls with its own content
      let p = this.animate ? smoothstep(clamp01(1 - Math.abs(v - i))) : 1
      // the hero sits at morph 0, so scroll never drafts it — drawIn() does
      if (i === 0) p *= this.intro.value
      if (p > 0) this.drawSketch(SKETCHES[i], p, rect.top)
    }
  }

  /** Draw a sketch at overall progress 0..1; primitives stagger across it. */
  private drawSketch(sketch: Sketch, progress: number, offsetY: number): void {
    const prims = this.mobile && sketch.mobilePrims ? sketch.prims.slice(0, sketch.mobilePrims) : sketch.prims
    const n = prims.length
    for (let i = 0; i < n; i++) {
      const start = n > 1 ? (0.45 * i) / (n - 1) : 0
      const p = clamp01((progress - start) / 0.55)
      if (p > 0) this.drawPrim(prims[i], p, offsetY)
    }
  }

  private drawPrim(prim: Prim, p: number, offsetY: number): void {
    const ctx = this.ctx
    const W = this.w
    const H = this.h
    // mobile: pull compositions toward the horizontal center
    const cxf = (x: number): number => (this.mobile ? (0.5 + (x - 0.5) * 0.9) * W : x * W)
    // y is measured from the top of the sketch's section
    const cyf = (y: number): number => y * H + offsetY

    ctx.save()
    switch (prim.kind) {
      case 'line': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.62)`
        ctx.lineWidth = 2.4
        const x1 = cxf(prim.x1)
        const y1 = cyf(prim.y1)
        const x2 = x1 + (cxf(prim.x2) - x1) * p
        const y2 = y1 + (cyf(prim.y2) - y1) * p
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        if (prim.ticks && p > 0.92) {
          const a = Math.atan2(cyf(prim.y2) - y1, cxf(prim.x2) - x1) + Math.PI / 2
          for (const [tx, ty] of [
            [x1, y1],
            [cxf(prim.x2), cyf(prim.y2)],
          ]) {
            ctx.beginPath()
            ctx.moveTo(tx - Math.cos(a) * 5, ty - Math.sin(a) * 5)
            ctx.lineTo(tx + Math.cos(a) * 5, ty + Math.sin(a) * 5)
            ctx.stroke()
          }
        }
        break
      }
      case 'dash': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.42)`
        ctx.lineWidth = 1.8
        ctx.setLineDash([9, 10])
        ctx.lineDashOffset = -this.time * 10
        const x1 = cxf(prim.x1)
        const y1 = cyf(prim.y1)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x1 + (cxf(prim.x2) - x1) * p, y1 + (cyf(prim.y2) - y1) * p)
        ctx.stroke()
        break
      }
      case 'arc': {
        ctx.strokeStyle = `rgba(${BLUE}, ${prim.dashed ? 0.42 : 0.62})`
        ctx.lineWidth = prim.dashed ? 1.8 : 2.4
        if (prim.dashed) {
          ctx.setLineDash([8, 10])
          ctx.lineDashOffset = -this.time * 8
        }
        ctx.beginPath()
        ctx.arc(cxf(prim.cx), cyf(prim.cy), prim.r * H, prim.a0, prim.a0 + (prim.a1 - prim.a0) * p)
        ctx.stroke()
        break
      }
      case 'ellipse': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.52)`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(cxf(prim.cx), cyf(prim.cy), prim.rx * H, prim.ry * H, 0, 0, Math.PI * 2 * p)
        ctx.stroke()
        break
      }
      case 'rect': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.62)`
        ctx.lineWidth = 2.4
        const x = cxf(prim.x)
        const y = cyf(prim.y)
        const w = prim.w * W * (this.mobile ? 0.9 : 1)
        const h = prim.h * H
        const perim = 2 * (w + h)
        let remaining = perim * p
        const edges: [number, number, number, number][] = [
          [x, y, x + w, y],
          [x + w, y, x + w, y + h],
          [x + w, y + h, x, y + h],
          [x, y + h, x, y],
        ]
        ctx.beginPath()
        for (const [ex1, ey1, ex2, ey2] of edges) {
          if (remaining <= 0) break
          const len = Math.hypot(ex2 - ex1, ey2 - ey1)
          const seg = Math.min(1, remaining / len)
          ctx.moveTo(ex1, ey1)
          ctx.lineTo(ex1 + (ex2 - ex1) * seg, ey1 + (ey2 - ey1) * seg)
          remaining -= len
        }
        ctx.stroke()
        break
      }
      case 'cross': {
        ctx.strokeStyle = `rgba(${BLUE}, ${0.7 * p})`
        ctx.lineWidth = 2.4
        const cx = cxf(prim.cx)
        const cy = cyf(prim.cy)
        const r = prim.r * H
        ctx.translate(cx, cy)
        ctx.rotate(this.animate ? this.time * 0.25 : 0)
        ctx.beginPath()
        ctx.moveTo(-r * 1.6, 0)
        ctx.lineTo(r * 1.6, 0)
        ctx.moveTo(0, -r * 1.6)
        ctx.lineTo(0, r * 1.6)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.stroke()
        break
      }
      case 'pad': {
        ctx.fillStyle = `rgba(${BLUE}, ${0.75 * p})`
        ctx.beginPath()
        ctx.arc(cxf(prim.cx), cyf(prim.cy), prim.r * H * p, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'ticks': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.52)`
        ctx.lineWidth = 1.8
        const cx = cxf(prim.cx)
        const cy = cyf(prim.cy)
        const r = prim.r * H
        const visible = Math.round(prim.count * p)
        ctx.beginPath()
        for (let i = 0; i < visible; i++) {
          const a = (i / prim.count) * Math.PI * 2 - Math.PI / 2
          ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          ctx.lineTo(cx + Math.cos(a) * (r + 7), cy + Math.sin(a) * (r + 7))
        }
        ctx.stroke()
        break
      }
      case 'path': {
        ctx.strokeStyle = `rgba(${BLUE}, 0.65)`
        ctx.lineWidth = 2.4
        const pts = prim.pts.map(([x, y]) => [cxf(x), cyf(y)] as const)
        let total = 0
        const lens: number[] = []
        for (let i = 1; i < pts.length; i++) {
          const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
          lens.push(l)
          total += l
        }
        let remaining = total * p
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length && remaining > 0; i++) {
          const seg = Math.min(1, remaining / lens[i - 1])
          ctx.lineTo(
            pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * seg,
            pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * seg,
          )
          remaining -= lens[i - 1]
        }
        ctx.stroke()
        break
      }
      case 'label': {
        ctx.fillStyle = `rgba(${BLUE}, ${0.75 * p})`
        ctx.font = "500 12px 'IBM Plex Mono', monospace"
        if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
        ctx.fillText(prim.text, cxf(prim.x), cyf(prim.y))
        break
      }
    }
    ctx.restore()
  }
}
