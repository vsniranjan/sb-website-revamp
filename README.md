# IEEE MACE SB — Website

Website for the **IEEE Student Branch at Mar Athanasius College of Engineering**, Kothamangalam, Kerala (Branch Code 32041).

A single-page site built as a technical drawing: a warm paper canvas with a blueprint hairline grid, a scroll-scrubbed 2D "living blueprint" backdrop, and every section rendered as a bespoke drafting component — schematic panels, instrument readouts, drafting sheets, an index ledger, IC-chip tiles, and a transmission console.

## Stack

- **[Vite](https://vite.dev)** + **TypeScript** — no UI framework, plain DOM
- **[GSAP](https://gsap.com)** — ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin for scroll-driven reveals and line-draw animation
- **2D canvas backdrop** — hand-rolled drafting scenes, no 3D dependency
- **[Fontsource](https://fontsource.org)** — self-hosted Space Grotesk, Inter, and IBM Plex Mono (no CDN)

## Getting started

```bash
npm install
npm run dev        # vite dev server
npm run build      # tsc --noEmit && vite build
npm run preview    # serve the production build
```

## Project structure

```
index.html            page markup — hero, about, contact and footer copy live here
public/logo.svg       branch mark, also used as the favicon
src/
  main.ts             entry point: renders content, boots GSAP and the backdrop
  content.ts          repeated card-grid data (events, chapters, execom, gallery, stats)
  render.ts           renders content.ts into the section mount points
  styles/
    tokens.css        colour, type, spacing, radius, shadow and motion tokens
    base.css          reset, typography, navbar, buttons, footer
    sections.css      per-section component styles
  animations/
    preloader.ts      loading counter and reveal
    reveals.ts        section reveals, hero intro, stat counters
    interactions.ts   navigation, mobile menu, gallery marquee
    flourishes.ts     gauges, rotors, callouts, ticker, cursor reticle
  backdrop/
    Blueprint.ts      canvas renderer for the drafting compositions
    sketches.ts       one composition per section
    scrollSync.ts     scrubs the backdrop against scroll position
docs/
  site-info.txt       source notes for the branch copy
```

## Accessibility and motion

`prefers-reduced-motion: reduce` skips the preloader, shows every section immediately, and renders the backdrop as a single static sketch. Body text sits at 7:1 or better against the paper background; the lighter tertiary ink is reserved for decorative labels.

## Credits

Designed and developed by the IEEE MACE SB WebTeam.
