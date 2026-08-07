# Brief: Port the Event Poster Reel to another site

**Audience:** an AI coding agent working in a *different* repository.
**Goal:** reproduce the auto-scrolling event-poster reel exactly as it behaves on the IEEE MACE SB site.
**Source of truth:** this document. All code below is self-contained — you do **not** need access to the original repo.

---

## 0. TL;DR

A full-bleed horizontal strip of event posters that scrolls itself forever, right-to-left,
at a constant **64 CSS pixels per second** regardless of how many posters there are.
Posters are slightly rotated/offset ("pinned to a board" look), straighten on hover,
and the whole strip eases to a stop while the mouse is over it. Scrolling the page fast
temporarily speeds the reel up. `prefers-reduced-motion` swaps the marquee for a native
swipeable, snap-scrolling strip.

Three things to create:
1. A poster data list (image URL + intrinsic width/height + title + tag).
2. One CSS block (self-contained, works with or without a host design system).
3. One JS/TS module that runs the marquee.

Two implementations are given: **React** (§4) and **vanilla HTML/JS** (§5). Pick the one matching the target site; do not build both.

---

## 1. Behavior specification

Implement all of these. They are the reason the component looks good, not incidental detail.

| # | Behavior | Detail |
|---|---|---|
| B1 | Seamless infinite loop | The track contains the poster set **twice**. GSAP animates the track `xPercent: -50` linearly on `repeat: -1`. When the first set has fully exited, the animation restarts with the duplicate exactly where the original was — no visible seam. |
| B2 | Constant speed | `duration = firstSet.offsetWidth / 64` seconds. Adding posters makes the loop longer, **not** faster. Never hardcode a duration. |
| B3 | Hover pause | `mouseenter` tweens the loop's `timeScale` to `0` over 0.6s; `mouseleave` tweens it back to `1` over 0.6s. It eases — it does not snap. |
| B4 | Scroll-velocity boost | While not hovered, page scroll velocity raises `timeScale` up to a max of `4` (`1 + |velocity| / 2200`, clamped 1–4). A `gsap.ticker` callback decays it back toward `1` at 3% per frame. Boost only ever raises `timeScale`, never lowers it (`Math.max`). |
| B5 | Uniform rail, no cropping | Every poster is pinned to the same **height** (`--poster-h`) and derives its **width** from its own aspect ratio, passed inline as `--poster-ar`. Mixed portrait/square/landscape posters therefore hang from one rail with zero letterboxing. |
| B6 | Board scatter | Posters cycle through 4 rotation/offset variants (`--v1..--v4` by index % 4). Hovering a poster straightens it to `rotate(0) translateY(0)`. |
| B7 | Decode fade-in | Images start at `opacity: 0`; a `load` listener adds `.is-loaded` to fade them in. Behind them a drafting-paper grid hatch is visible until they decode — never a blank white box. |
| B8 | Approach preload | Posters sit off-screen to the right, so native lazy loading would fetch each one only as the marquee dragged it in — a visible blank. An `IntersectionObserver` with `rootMargin: '600px 0px'` on the reel flips every image to `loading="eager"` once, then disconnects. |
| B9 | Reduced motion | If `prefers-reduced-motion: reduce`, **skip the marquee entirely**, add `.is-static` to the reel, and let it be a native `overflow-x: auto` strip with `scroll-snap-type: x proximity`. The duplicate set is hidden via `[aria-hidden] { display: none }`. |
| B10 | Accessibility | The duplicate set is `aria-hidden="true"` and its images get `alt=""`. Real images get `alt="Event poster — {title}"`. The reel has `aria-label="Event posters"`. |

**Touch devices deliberately still run the marquee** — the hover pause is mouse-only by nature, so on a phone the reel reads as alive rather than as a strip that happens to be cut off. Do not add a touch branch.

---

## 2. Dependencies

```bash
npm i gsap
```

- **GSAP 3.13+** (tested on 3.15). ScrollTrigger ships in the free GSAP package.
- Nothing else. No carousel library, no Embla/Swiper/Keen — they fight the seamless loop.

ScrollTrigger **must be registered before use**:

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

If the target site already has a central GSAP setup module, register there and import from it instead of registering twice.

---

## 3. Shared pieces (needed by both implementations)

### 3.1 Poster data

Every poster needs its **intrinsic pixel width and height**. This is not optional — it drives `--poster-ar` (B5) and the `width`/`height` attributes that prevent layout shift.

```ts
// src/lib/posters.ts
export interface Poster {
  /** Public URL of the optimized image, e.g. '/gallery/error-404.webp' */
  src: string
  /** Rendered pixel size of that file. Used for aspect ratio + intrinsic size. */
  width: number
  height: number
  title: string
  /** Short kicker under the title, e.g. 'Computer Society · Contest' */
  tag: string
}

/**
 * Ordered for the reel — mix portrait and square on purpose so the strip
 * never reads as a uniform grid.
 */
export const posters: Poster[] = [
  { src: '/gallery/akiassc-2026.webp',        width: 720, height: 900,  title: 'AKIASSC 2026 — Industry & Entrepreneurship', tag: 'IAS · Student Conclave' },
  { src: '/gallery/error-404-debugging.webp', width: 720, height: 720,  title: 'Error 404 — Debugging Competition',          tag: 'Computer Society · Contest' },
  { src: '/gallery/environment-day.webp',     width: 720, height: 1082, title: 'World Environment Day',                      tag: 'SIGHT · Outreach' },
  // …replace with the target site's posters. 8–20 works well.
]
```

**Minimum 6 posters.** Below that the duplicated set may be narrower than the viewport and the seam becomes visible. If the target site has fewer, repeat the array until the set is at least ~2× viewport width.

### 3.2 CSS

Drop into a global stylesheet. It is **self-contained**: every design token falls back to a sane literal, so it works whether or not the target site defines `--space-6`, `--accent`, etc. If the host site *does* define them, the reel inherits its look automatically.

```css
/* ---------- event poster reel ----------
   Posters are pinned to one shared height and take their width from each
   image's own ratio (--poster-ar), so square and portrait plates hang from
   the same rail without cropping. */

.gallery__reel {
  /* tune these two to retheme the whole component */
  --poster-h: clamp(280px, 40vh, 420px);
  --poster-gap: var(--space-6, 32px);

  /* host tokens if present, literals otherwise */
  --reel-surface: var(--surface, #ffffff);
  --reel-text: var(--text, #1c1a16);
  --reel-text-faint: var(--text-faint, #a39c8c);
  --reel-accent: var(--accent-section, #2f6df6);
  --reel-border: var(--border, rgba(24, 20, 14, 0.14));
  --reel-border-strong: var(--border-strong, rgba(24, 20, 14, 0.22));
  --reel-border-faint: var(--border-faint, rgba(24, 20, 14, 0.08));
  --reel-radius: var(--radius-md, 12px);
  --reel-shadow: var(--shadow-lift, 0 10px 34px rgba(28, 24, 18, 0.14));
  --reel-mono: var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace);
  --reel-ease: var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));

  overflow: hidden;
  padding-block: var(--poster-gap);
  border-block: 1px solid var(--reel-border);
}

.gallery__track {
  display: flex;
  width: max-content;
  will-change: transform;
  align-items: flex-start;
}

.gallery__set {
  display: flex;
  gap: var(--poster-gap);
  padding-right: var(--poster-gap);
  align-items: flex-start;
}

.poster {
  flex: none;
  width: calc(var(--poster-h) * var(--poster-ar));
  transition: transform 450ms var(--reel-ease);
}

/* board scatter — index % 4 */
.poster--v1 { transform: rotate(-1.1deg); }
.poster--v2 { transform: rotate(0.9deg) translateY(24px); }
.poster--v3 { transform: rotate(0.4deg) translateY(12px); }
.poster--v4 { transform: rotate(-0.7deg) translateY(32px); }

.poster:hover { transform: rotate(0deg) translateY(0); }

.poster__frame {
  position: relative;
  aspect-ratio: var(--poster-ar);
  background: var(--reel-surface);
  border-radius: var(--reel-radius);
  overflow: hidden;
  border: 1px solid var(--reel-border-strong);
  transition:
    border-color 200ms var(--reel-ease),
    box-shadow 450ms var(--reel-ease);
}

/* drafting-paper hatch shows through until the poster decodes */
.poster__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(var(--reel-border-faint) 1px, transparent 1px) 0 0 / 100% 24px,
    linear-gradient(90deg, var(--reel-border-faint) 1px, transparent 1px) 0 0 / 24px 100%;
}

.poster:hover .poster__frame {
  border-color: var(--reel-accent);
  box-shadow: var(--reel-shadow);
}

.poster__img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 700ms var(--reel-ease);
}

.poster__img.is-loaded { opacity: 1; }

.poster__caption {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  margin-top: 12px;
}

.poster__index {
  font-family: var(--reel-mono);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  color: var(--reel-accent);
  line-height: 1.5;
}

.poster__title {
  font-family: var(--reel-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--reel-text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.poster__tag {
  grid-column: 2;
  font-family: var(--reel-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--reel-text-faint);
}

/* reduced motion: no marquee to carry posters past, so let the reel be swiped */
.gallery__reel.is-static {
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-inline: var(--gutter, clamp(20px, 4vw, 48px));
}

.gallery__reel.is-static .gallery__track { will-change: auto; }
.gallery__reel.is-static .gallery__set[aria-hidden] { display: none; }
.gallery__reel.is-static .poster { scroll-snap-align: center; }

@media (max-width: 900px) {
  .gallery__reel {
    --poster-h: 260px;
    --poster-gap: var(--space-5, 24px);
  }
}
```

### 3.3 The marquee module

Identical for both implementations. Import and call once per page-view.

```ts
// src/lib/poster-reel.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Poster travel speed, in CSS pixels per second — independent of poster count. */
const REEL_SPEED = 64

/** Posters fade in as they decode; nothing pops into a half-drawn frame. */
function trackImageLoads(track: HTMLElement): void {
  track.querySelectorAll<HTMLImageElement>('.poster__img').forEach((img) => {
    if (img.complete) img.classList.add('is-loaded')
    else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true })
  })
}

/**
 * Posters sit off to the right of the viewport, so lazy loading would only
 * fetch them as the marquee dragged each one in — a visible blank. Once the
 * reel itself is near, fetch the whole strip.
 */
function preloadOnApproach(reel: HTMLElement, track: HTMLElement): void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      track.querySelectorAll<HTMLImageElement>('.poster__img').forEach((img) => {
        img.loading = 'eager'
      })
      observer.disconnect()
    },
    { rootMargin: '600px 0px' },
  )
  observer.observe(reel)
}

/**
 * Seamless auto-scrolling poster reel; eases to a stop on hover.
 *
 * `staticReel` hands the strip to native scrolling instead of the marquee.
 * Reserved for reduced motion: touch devices run the marquee too, so the reel
 * reads as alive on a phone rather than as a strip that happens to be cut off.
 *
 * The hover pause is mouse-only by nature, so on touch `hovered` stays false
 * and the scroll-velocity boost drives the reel on its own.
 */
export function initGalleryMarquee(staticReel: boolean): void {
  const reel = document.getElementById('gallery-reel')
  const track = document.getElementById('gallery-track')
  if (!reel || !track) return

  trackImageLoads(track)
  preloadOnApproach(reel, track)

  if (staticReel) {
    // no marquee to carry posters past — hand the strip over to native scrolling
    reel.classList.add('is-static')
    return
  }

  const set = track.querySelector<HTMLElement>('.gallery__set')
  const loop = gsap.to(track, {
    xPercent: -50,
    duration: set ? set.offsetWidth / REEL_SPEED : 36,
    ease: 'none',
    repeat: -1,
  })

  let hovered = false
  reel.addEventListener('mouseenter', () => {
    hovered = true
    gsap.to(loop, { timeScale: 0, duration: 0.6 })
  })
  reel.addEventListener('mouseleave', () => {
    hovered = false
    gsap.to(loop, { timeScale: 1, duration: 0.6 })
  })

  // reel speeds up with scroll velocity; ticker decays it back to 1
  const clampBoost = gsap.utils.clamp(1, 4)
  ScrollTrigger.create({
    onUpdate: (self) => {
      if (hovered) return
      loop.timeScale(Math.max(loop.timeScale(), clampBoost(1 + Math.abs(self.getVelocity()) / 2200)))
    },
  })
  gsap.ticker.add(() => {
    if (hovered) return
    const ts = loop.timeScale()
    if (ts > 1) loop.timeScale(ts + (1 - ts) * 0.03)
  })
}
```

**IDs `gallery-reel` / `gallery-track` are contract.** If the target site already uses those IDs, rename in both the markup and this module — but keep them unique on the page; the module does a document-level lookup.

---

## 4. React / Next.js implementation

Server-render the markup, run the marquee from a tiny client component. Do **not** make the whole reel a client component — the posters are static content and should ship as HTML.

```tsx
// src/components/gallery/GalleryReel.tsx  (server component — no 'use client')
import { posters, type Poster } from '@/lib/posters'

const pad = (n: number) => String(n).padStart(2, '0')

function PosterFigure({ poster, i, decorative }: { poster: Poster; i: number; decorative: boolean }) {
  const ratio = (poster.width / poster.height).toFixed(4)

  return (
    <figure className={`poster poster--v${(i % 4) + 1}`} style={{ '--poster-ar': ratio } as React.CSSProperties}>
      <div className="poster__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="poster__img"
          src={poster.src}
          width={poster.width}
          height={poster.height}
          loading="lazy"
          decoding="async"
          alt={decorative ? '' : `Event poster — ${poster.title}`}
        />
      </div>
      <figcaption className="poster__caption">
        <span className="poster__index" aria-hidden="true">{pad(i + 1)}</span>
        <span className="poster__title">{poster.title}</span>
        <span className="poster__tag">{poster.tag}</span>
      </figcaption>
    </figure>
  )
}

function PosterSet({ duplicate }: { duplicate: boolean }) {
  return (
    <div className="gallery__set" aria-hidden={duplicate || undefined}>
      {posters.map((poster, i) => (
        <PosterFigure
          key={`${duplicate ? 'dup' : 'real'}-${poster.src}`}
          poster={poster}
          i={i}
          decorative={duplicate}
        />
      ))}
    </div>
  )
}

export function GalleryReel() {
  return (
    <div className="gallery__reel" id="gallery-reel" aria-label="Event posters">
      <div className="gallery__track" id="gallery-track">
        <PosterSet duplicate={false} />
        <PosterSet duplicate={true} />
      </div>
    </div>
  )
}
```

```tsx
// src/components/gallery/GalleryMarquee.tsx
'use client'

import { useEffect, useRef } from 'react'
import { initGalleryMarquee } from '@/lib/poster-reel'

/** Wires the gallery reel's marquee loop — runs immediately on mount, once per page-view. */
export function GalleryMarquee() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    initGalleryMarquee(reducedMotion)
  }, [])

  return null
}
```

Usage — note the reel is **outside** any width-constrained container, so it bleeds full width:

```tsx
export default function GalleryPage() {
  return (
    <section id="gallery" aria-labelledby="gallery-heading">
      <div className="container">
        <header>
          <h2 id="gallery-heading">Event Gallery</h2>
          <p>A continuous reel of posters from our hackathons, workshops, conclaves, and outreach.</p>
        </header>
      </div>

      <GalleryReel />
      <GalleryMarquee />
    </section>
  )
}
```

The `ran` ref guard matters under React 18/19 StrictMode — without it the effect fires twice in dev and you get two overlapping loops at double speed.

---

## 5. Vanilla HTML / JS implementation

If the target site is not React, render the markup from the data instead of hand-writing 2× N figures.

```html
<section id="gallery" aria-labelledby="gallery-heading">
  <div class="container">
    <header>
      <h2 id="gallery-heading">Event Gallery</h2>
      <p>A continuous reel of posters from our events.</p>
    </header>
  </div>

  <div class="gallery__reel" id="gallery-reel" aria-label="Event posters">
    <div class="gallery__track" id="gallery-track"></div>
  </div>
</section>
```

```ts
// src/poster-reel-render.ts
import { posters, type Poster } from './posters'
import { initGalleryMarquee } from './poster-reel'

const pad = (n: number) => String(n).padStart(2, '0')

function figure(poster: Poster, i: number, decorative: boolean): string {
  const ratio = (poster.width / poster.height).toFixed(4)
  const alt = decorative ? '' : `Event poster — ${escapeHtml(poster.title)}`
  return `
    <figure class="poster poster--v${(i % 4) + 1}" style="--poster-ar:${ratio}">
      <div class="poster__frame">
        <img class="poster__img" src="${poster.src}" width="${poster.width}" height="${poster.height}"
             loading="lazy" decoding="async" alt="${alt}">
      </div>
      <figcaption class="poster__caption">
        <span class="poster__index" aria-hidden="true">${pad(i + 1)}</span>
        <span class="poster__title">${escapeHtml(poster.title)}</span>
        <span class="poster__tag">${escapeHtml(poster.tag)}</span>
      </figcaption>
    </figure>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

function set(duplicate: boolean): string {
  const body = posters.map((p, i) => figure(p, i, duplicate)).join('')
  return `<div class="gallery__set"${duplicate ? ' aria-hidden="true"' : ''}>${body}</div>`
}

const track = document.getElementById('gallery-track')
if (track) {
  track.innerHTML = set(false) + set(true)
  initGalleryMarquee(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
}
```

Order matters: markup must exist in the DOM **before** `initGalleryMarquee` runs, because the loop duration is measured from `set.offsetWidth`.

---

## 6. Images

Posters are the page weight. Serve **one WebP per poster, 720px wide, quality 80** — no responsive tiers, no fallback formats (WebP is universal since ~2020). At `--poster-h` max 420px, 720px wide covers 2× DPR for portrait plates.

If the target site has an image pipeline already, use it and just record the output dimensions in `posters.ts`. Otherwise this script (requires ImageMagick 7, `magick` on PATH) converts a folder of sources:

```bash
mkdir -p public/gallery
for f in images/*.{jpg,jpeg,png}; do
  [ -e "$f" ] || continue
  out="public/gallery/$(basename "${f%.*}").webp"
  magick "$f" -auto-orient -colorspace sRGB -filter Lanczos -resize '720x>' \
    -strip -quality 80 -define webp:method=6 -define webp:sharp-yuv=true "$out"
  echo "$out $(magick identify -format '%w %h' "$out")"
done
```

`720x>` shrinks to 720 wide but leaves anything already narrower alone. The echoed `width height` per file is what goes into `posters.ts`.

**Wrong dimensions in `posters.ts` are the single most likely bug** — they distort `--poster-ar`, so the frame's `aspect-ratio` disagrees with the image and `object-fit: cover` silently crops. Read the real numbers off the generated files; never guess or copy them from the source images.

---

## 7. Acceptance checklist

Run the site and verify each. Do not report done on any unchecked item.

- [ ] Reel scrolls right-to-left continuously with **no visible seam or jump** at the loop point.
- [ ] Doubling the number of posters does **not** change how fast a poster crosses the screen.
- [ ] Mouse over the reel: it eases to a full stop within ~0.6s. Mouse out: it eases back to speed.
- [ ] Fast page scroll visibly speeds the reel up, and it coasts back down to normal on its own.
- [ ] Posters of different aspect ratios all share the same height, and none are cropped.
- [ ] Posters sit at slight varied angles; hovering one straightens it and lifts its shadow.
- [ ] Images fade in rather than popping; the grid hatch is visible behind an undecoded poster.
- [ ] Scroll to the reel from far above: posters are already loaded when it enters view — no blanks dragging in.
- [ ] With OS "reduce motion" on: no auto-scroll, the strip is swipeable/scrollable by hand, snaps to posters, and duplicates are **not** visible (poster count is N, not 2N).
- [ ] Screen reader announces each poster once, not twice.
- [ ] No console errors; no horizontal scrollbar on `<body>` (the reel clips its own overflow).
- [ ] Build/typecheck passes.

---

## 8. Gotchas — read before debugging

1. **Seam visible / reel jumps.** The two sets are not identical, or `padding-right` is on only one of them. Both `.gallery__set` elements must render the exact same children and the same trailing gap; `xPercent: -50` assumes the track is exactly two equal halves.
2. **Reel too fast or too slow.** You hardcoded a duration. It must be `set.offsetWidth / 64`.
3. **Double speed in dev only.** React StrictMode double-invoked the effect. That's what the `ran` ref guards.
4. **Duration goes stale on window resize.** `--poster-h` is a `clamp()`, so set width changes with viewport, but the loop was measured at mount. Known limitation, matches the original. If the target site needs it, kill and rebuild the loop on a debounced `resize` — do not try to retime the running tween.
5. **`will-change: transform` on the track is deliberate.** Removing it causes repaint jank on long strips. Do not "clean it up".
6. **Do not wrap the reel in a max-width container.** It is intentionally full-bleed; the section heading goes in the container, the reel goes outside it.
7. **Do not swap the `<img>` for a framework image component** (`next/image` etc.) without checking. Those inject their own wrappers and lazy behavior, which fight B7 and B8. The plain `<img>` with explicit `width`/`height` is intentional.
8. **`overflow: hidden` on `.gallery__reel` is what keeps the page from scrolling sideways.** If the host site has an ancestor with `overflow: visible` and a transform, verify no horizontal scrollbar appears on `<body>`.
