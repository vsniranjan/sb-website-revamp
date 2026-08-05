import gsap from 'gsap'

/** The field paints white light onto the dark page, matching the accent. */
const TINT_R = 255
const TINT_G = 255
const TINT_B = 255

/**
 * Peak alpha, reached only at the brightest crests. Far lower than the light theme
 * needed: white lifting a near-black background is a much stronger visual move than
 * blue darkening paper, so the same number would blow out the page.
 */
const PEAK_ALPHA = 0.07
/**
 * Gamma on the normalised amplitude. Above 1 it pushes the mid-range down while
 * leaving crests alone, so bands read as bands against clean paper rather than as an
 * even wash.
 */
const CONTRAST = 1.3
/**
 * Summed amplitude rarely approaches the theoretical maximum, because the emitters
 * are out of phase with each other and cancel as often as they reinforce. Measured
 * across a run, the 98th percentile sits near 0.6, so this lifts that to 1 and the
 * top couple of percent clip into solid crests.
 *
 * Without it the field peaks around a third of PEAK_ALPHA and reads as blank paper.
 */
const FIELD_GAIN = 1.7
/**
 * How fast amplitude decays with distance from an emitter. Steep values confine the
 * pattern to tight halos and leave most of the screen empty.
 */
const FALLOFF = 1.5

/** Offscreen buffer width in pixels; height follows the viewport ratio. */
const RES_DESKTOP = 220
/**
 * Phones — and any desktop-sized device that reports weak hardware — run the same
 * animation, so the buffer drops further to pay for it. The upscale is a blur either
 * way, and at this softness the difference is invisible.
 */
const RES_LOW_POWER = 110

/**
 * Emitters whose wavefronts are summed. Three interfere cleanly; a fourth mostly
 * cancels the other three and flattens the result toward the mean.
 */
const SOURCES = 3

/*
 * Motion budget. The field runs on its own clock and ignores scroll completely, so
 * the page has one continuous state rather than a per-section one.
 */

/**
 * Spatial frequency of the wavefronts. At 38 the rings packed tight enough to read
 * as a fingerprint or a moire artefact. Low single digits give a handful of broad
 * pools of light across the whole viewport, which is what reads as minimal.
 */
const WAVE_K = 9
/** Radians per second the wavefronts travel outward. */
const DRIFT_SPEED = 0.55
/** Radians per second the emitter ring turns. */
const RING_DRIFT = 0.015

/**
 * Wave superposition backdrop: three radial emitters, their amplitudes summed per
 * pixel. Crests reinforce into soft bands of light, a crest meeting a trough cancels
 * back to the bare background, so the structure is interference rather than anything
 * drawn and it has no edges to read as linework.
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
  /** Only reduced-motion visitors get a single static frame instead of a ticker. */
  private live: boolean
  /**
   * Phones and other weak-hardware devices render on every other tick. The
   * wavefronts travel slowly enough that 30fps is indistinguishable from 60, and it
   * halves the cost of the per-pixel loop.
   */
  private halfRate: boolean
  private skipFrame = false
  /**
   * The bicubic-quality upscale in drawImage is the single most expensive line in
   * render() on weak GPUs — dropping to 'medium' is a much smaller quality loss than
   * the frame it buys back, at this buffer size.
   */
  private smoothingQuality: ImageSmoothingQuality

  constructor(canvas: HTMLCanvasElement, opts: { lowPower: boolean; animate: boolean }) {
    this.canvas = canvas
    this.res = opts.lowPower ? RES_LOW_POWER : RES_DESKTOP
    this.live = opts.animate
    this.halfRate = opts.lowPower
    this.smoothingQuality = opts.lowPower ? 'medium' : 'high'

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
    // time keeps accumulating on skipped frames, so the field advances at the same
    // rate regardless of how often it is actually drawn
    this.time += deltaTime / 1000
    if (this.halfRate) {
      this.skipFrame = !this.skipFrame
      if (this.skipFrame) return
    }
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
          s += Math.sin(d * WAVE_K - time * DRIFT_SPEED + i * 1.1) / (1 + d * FALLOFF)
        }
        const amp = Math.pow(Math.min(1, Math.abs(s / SOURCES) * FIELD_GAIN), CONTRAST)
        data[p] = TINT_R
        data[p + 1] = TINT_G
        data[p + 2] = TINT_B
        // No dither. Re-rolling noise every frame on a buffer this small reads as
        // television static once it is upscaled, and at this peak alpha there are too
        // few alpha steps for banding to show anyway.
        data[p + 3] = amp * peak
      }
    }

    this.bufCtx.putImageData(this.img, 0, 0)
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.w, this.h)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = this.smoothingQuality
    ctx.drawImage(this.buf, 0, 0, this.w, this.h)
  }
}
