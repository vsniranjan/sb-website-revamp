import gsap from 'gsap'

const BLUE_R = 0
const BLUE_G = 98
const BLUE_B = 155

/** Peak alpha, reached only at the brightest crests. Body copy sits over this. */
const PEAK_ALPHA = 0.16
/**
 * Gamma on the amplitude. Above 1 it pushes the mid-range down while leaving the
 * crests alone, so the bands read as bands against clean paper instead of the whole
 * field reading as an even wash. This is what raises contrast; PEAK_ALPHA alone just
 * makes everything uniformly darker.
 */
const CONTRAST = 1.6

/** Offscreen buffer width in pixels; height follows the viewport ratio. */
const RES_DESKTOP = 220
const RES_MOBILE = 150

/** Emitters whose wavefronts are summed. */
const SOURCES = 4

/*
 * Motion budget. The field runs on its own clock and ignores scroll completely, so
 * the page has one continuous state rather than a per-section one.
 */

/** Spatial frequency of the wavefronts. Higher packs the bands tighter. */
const WAVE_K = 38
/** Radians per second the wavefronts travel outward. */
const DRIFT_SPEED = 0.55
/** Radians per second the emitter ring turns. */
const RING_DRIFT = 0.015

/**
 * Wave superposition backdrop: four radial emitters, their amplitudes summed per
 * pixel. Crests reinforce into soft bands, a crest meeting a trough cancels back to
 * bare paper — so the structure is interference rather than anything drawn, and it
 * has no edges to read as linework.
 *
 * The field is rendered into a small buffer and scaled up with smoothing on. That
 * upscale is what makes it smooth, and it cuts the per-frame cost by the square of
 * the scale factor.
 *
 * Runs entirely on its own clock. Nothing about it responds to scroll position, so
 * the page carries one continuous field from top to bottom.
 */
export class WaveField {
  readonly ok: boolean
  /** 0..1 fade-in, held back until drawIn() runs. */
  readonly intro = { value: 1 }

  private ctx!: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private buf!: HTMLCanvasElement
  private bufCtx!: CanvasRenderingContext2D
  private img!: ImageData
  private w = 0
  private h = 0
  private lw = 0
  private lh = 0
  private res: number
  private time = 0
  /**
   * Phones and reduced-motion visitors get one static frame rather than a ticker.
   * A permanent rAF loop is a battery cost that decoration has not earned, and a
   * still interference pattern reads as intentional.
   */
  private live: boolean

  constructor(canvas: HTMLCanvasElement, opts: { mobile: boolean; animate: boolean }) {
    this.canvas = canvas
    this.res = opts.mobile ? RES_MOBILE : RES_DESKTOP
    this.live = opts.animate && !opts.mobile

    const ctx = canvas.getContext('2d')
    const buf = document.createElement('canvas')
    const bufCtx = buf.getContext('2d')
    if (!ctx || !bufCtx) {
      this.ok = false
      canvas.style.display = 'none'
      return
    }
    this.ok = true
    this.ctx = ctx
    this.buf = buf
    this.bufCtx = bufCtx

    this.resize()
    window.addEventListener('resize', this.onResize)

    if (this.live) {
      // hold the field back until drawIn() fades it up behind the cleared preloader
      this.intro.value = 0
      gsap.ticker.add(this.tick)
    } else {
      this.render()
    }
  }

  /** Fade the field up from nothing. Called once the preloader clears. */
  drawIn(): void {
    if (!this.ok || !this.live) return
    gsap.to(this.intro, { value: 1, duration: 2, ease: 'power2.inOut' })
  }

  private onResize = (): void => {
    this.resize()
    if (!this.live) this.render()
  }

  private resize(): void {
    this.w = window.innerWidth
    this.h = window.innerHeight
    // The source buffer is low resolution by design, so the canvas itself needs no
    // devicePixelRatio scaling; the browser stretches one buffer pixel either way.
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.lw = this.res
    this.lh = Math.max(2, Math.round((this.res * this.h) / this.w))
    this.buf.width = this.lw
    this.buf.height = this.lh
    this.img = this.bufCtx.createImageData(this.lw, this.lh)
  }

  private tick = (_time: number, deltaTime: number): void => {
    this.time += deltaTime / 1000
    this.render()
  }

  private render(): void {
    const { lw, lh, time } = this
    const data = this.img.data
    const aspect = lh / lw

    // The emitters ring the centre and turn slowly on their own clock.
    const sx: number[] = []
    const sy: number[] = []
    for (let i = 0; i < SOURCES; i++) {
      const a = (i / SOURCES) * Math.PI * 2 + time * RING_DRIFT
      sx.push(0.5 + Math.cos(a) * 0.3)
      sy.push(0.5 + Math.sin(a) * 0.26)
    }

    const peak = PEAK_ALPHA * 255 * this.intro.value

    for (let y = 0, p = 0; y < lh; y++) {
      const v = y / lh
      for (let x = 0; x < lw; x++, p += 4) {
        const u = x / lw
        let s = 0
        for (let i = 0; i < SOURCES; i++) {
          const dx = u - sx[i]
          const dy = (v - sy[i]) * aspect
          const d = Math.sqrt(dx * dx + dy * dy)
          // amplitude falls off with distance, so near sources stay legible as sources
          s += Math.sin(d * WAVE_K - time * DRIFT_SPEED + i * 1.1) / (1 + d * 4.5)
        }
        const amp = Math.pow(Math.min(1, Math.abs(s / SOURCES) * 2.05), CONTRAST)
        data[p] = BLUE_R
        data[p + 1] = BLUE_G
        data[p + 2] = BLUE_B
        // a gradient this large and this soft bands visibly on 8-bit displays, so
        // every sample gets a sub-step of jitter to break the contours up
        data[p + 3] = amp * peak + (Math.random() - 0.5) * 5
      }
    }

    this.bufCtx.putImageData(this.img, 0, 0)
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.w, this.h)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(this.buf, 0, 0, this.w, this.h)
  }
}
