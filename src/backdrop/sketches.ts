// Blueprint sketch definitions — one small, deliberate composition per section.
// Coordinates: x normalized by viewport width; y normalized by viewport height,
// measured FROM THE TOP OF THE SECTION (the engine anchors each sketch to its
// section's bounding rect, so drawings scroll with their content and always sit
// in that section's known empty zone — never on top of text).
//
// Zone convention: section heads are left-aligned and ≤40rem wide, so the
// top-right region (x 0.62–0.96, y 0.08–0.4) is reliably empty. The hero's
// right half is empty for its full height.

export type Prim =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; ticks?: boolean }
  | { kind: 'dash'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'arc'; cx: number; cy: number; r: number; a0: number; a1: number; dashed?: boolean }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'cross'; cx: number; cy: number; r: number }
  | { kind: 'pad'; cx: number; cy: number; r: number }
  | { kind: 'ticks'; cx: number; cy: number; r: number; count: number }
  | { kind: 'path'; pts: [number, number][] }
  | { kind: 'label'; x: number; y: number; text: string }

export type Sketch = { prims: Prim[]; mobilePrims?: number }

const TAU = Math.PI * 2

function bolt(cx: number, cy: number, s: number): Prim {
  return {
    kind: 'path',
    pts: [
      [cx + 0.24 * s, cy - 0.95 * s],
      [cx - 0.42 * s, cy + 0.14 * s],
      [cx + 0.02 * s, cy + 0.14 * s],
      [cx - 0.2 * s, cy + 0.95 * s],
      [cx + 0.46 * s, cy - 0.12 * s],
      [cx + 0.02 * s, cy - 0.12 * s],
      [cx + 0.24 * s, cy - 0.95 * s],
    ],
  }
}

/** 01 · hero — the branch mark being drafted, right half (empty for full height). */
const hero: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'arc', cx: 0.855, cy: 0.45, r: 0.19, a0: -Math.PI / 2, a1: TAU - Math.PI / 2 },
    { kind: 'cross', cx: 0.855, cy: 0.45, r: 0.02 },
    { kind: 'line', x1: 0.855, y1: 0.45, x2: 0.855 + 0.105, y2: 0.45 - 0.105 * 1.28, ticks: true },
    bolt(0.855, 0.45, 0.1),
    { kind: 'label', x: 0.9, y: 0.3, text: 'R 32041' },
    { kind: 'label', x: 0.79, y: 0.72, text: 'FIG. 01 — BRANCH MARK' },
  ],
}

/** 02 · intro — two linked modules, top-right zone. */
const intro: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'rect', x: 0.66, y: 0.1, w: 0.08, h: 0.11 },
    { kind: 'dash', x1: 0.74, y1: 0.155, x2: 0.81, y2: 0.155 },
    { kind: 'rect', x: 0.81, y: 0.19, w: 0.08, h: 0.11 },
    { kind: 'pad', cx: 0.81, cy: 0.155, r: 0.006 },
    { kind: 'label', x: 0.66, y: 0.07, text: 'MODULES' },
  ],
}

/** 03 · whyjoin — globe construction, top-right zone. */
const whyjoin: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'arc', cx: 0.79, cy: 0.24, r: 0.13, a0: 0, a1: TAU },
    { kind: 'ellipse', cx: 0.79, cy: 0.24, rx: 0.13, ry: 0.045 },
    { kind: 'ellipse', cx: 0.79, cy: 0.24, rx: 0.045, ry: 0.13 },
    { kind: 'label', x: 0.72, y: 0.44, text: '160+ COUNTRIES' },
  ],
}

/** 04 · about — 1961→1988 timeline, top-right zone. */
const about: Sketch = {
  mobilePrims: 4,
  prims: [
    { kind: 'dash', x1: 0.62, y1: 0.18, x2: 0.95, y2: 0.18 },
    { kind: 'line', x1: 0.68, y1: 0.155, x2: 0.68, y2: 0.205 },
    { kind: 'label', x: 0.655, y: 0.13, text: '1961' },
    { kind: 'line', x1: 0.86, y1: 0.155, x2: 0.86, y2: 0.205 },
    { kind: 'label', x: 0.835, y: 0.13, text: '1988' },
    { kind: 'pad', cx: 0.95, cy: 0.18, r: 0.007 },
  ],
}

/** 05 · events — orbit diagram, top-right zone. */
const events: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'arc', cx: 0.8, cy: 0.22, r: 0.08, a0: 0, a1: TAU, dashed: true },
    { kind: 'arc', cx: 0.8, cy: 0.22, r: 0.14, a0: 0, a1: TAU, dashed: true },
    { kind: 'pad', cx: 0.8 + 0.14, cy: 0.22, r: 0.007 },
    { kind: 'pad', cx: 0.8 - 0.08, cy: 0.22, r: 0.007 },
    { kind: 'cross', cx: 0.8, cy: 0.22, r: 0.015 },
    { kind: 'label', x: 0.72, y: 0.42, text: '6 ORBITS / YR' },
  ],
}

/** 06 · execom — small org chart, top-right zone. */
const execom: Sketch = {
  mobilePrims: 4,
  prims: [
    { kind: 'arc', cx: 0.79, cy: 0.12, r: 0.022, a0: 0, a1: TAU },
    { kind: 'dash', x1: 0.79, y1: 0.142, x2: 0.79, y2: 0.2 },
    { kind: 'dash', x1: 0.7, y1: 0.2, x2: 0.88, y2: 0.2 },
    { kind: 'arc', cx: 0.7, cy: 0.24, r: 0.018, a0: 0, a1: TAU },
    { kind: 'arc', cx: 0.88, cy: 0.24, r: 0.018, a0: 0, a1: TAU },
    { kind: 'label', x: 0.72, y: 0.33, text: 'EXECOM 32041' },
  ],
}

/** 07 · gallery — two poster frames, top-right zone. */
const gallery: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'rect', x: 0.7, y: 0.08, w: 0.09, h: 0.21 },
    { kind: 'rect', x: 0.82, y: 0.13, w: 0.08, h: 0.18 },
    { kind: 'dash', x1: 0.66, y1: 0.34, x2: 0.94, y2: 0.34 },
    { kind: 'label', x: 0.7, y: 0.4, text: 'REEL — CONTINUOUS' },
  ],
}

/** 08 · chapters — chip outline with pins, top-right zone. */
const chapters: Sketch = {
  mobilePrims: 4,
  prims: [
    { kind: 'rect', x: 0.72, y: 0.1, w: 0.13, h: 0.2 },
    { kind: 'line', x1: 0.7, y1: 0.14, x2: 0.72, y2: 0.14 },
    { kind: 'line', x1: 0.7, y1: 0.26, x2: 0.72, y2: 0.26 },
    { kind: 'line', x1: 0.85, y1: 0.14, x2: 0.87, y2: 0.14 },
    { kind: 'line', x1: 0.85, y1: 0.26, x2: 0.87, y2: 0.26 },
    { kind: 'label', x: 0.72, y: 0.37, text: 'IC 32041 — 9 UNITS' },
  ],
}

/** 09 · contact — target rings, top-right zone. */
const contact: Sketch = {
  mobilePrims: 3,
  prims: [
    { kind: 'cross', cx: 0.79, cy: 0.22, r: 0.025 },
    { kind: 'arc', cx: 0.79, cy: 0.22, r: 0.09, a0: 0, a1: TAU },
    { kind: 'arc', cx: 0.79, cy: 0.22, r: 0.15, a0: 0, a1: TAU, dashed: true },
    { kind: 'label', x: 0.7, y: 0.44, text: '10.0594 N / 76.6295 E' },
  ],
}

export const SKETCHES: Sketch[] = [
  hero,
  intro,
  whyjoin,
  about,
  events,
  execom,
  gallery,
  chapters,
  contact,
]
