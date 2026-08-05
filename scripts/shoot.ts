/**
 * Screenshots the built site so changes can be reviewed without a human in the loop.
 *
 *   npm run build && npm run shoot
 *
 * Serves `dist/` on a throwaway port, then captures each viewport in `SHOTS` twice:
 * the first fold, and the full page. Output lands in `.shots/`, which is gitignored.
 *
 * The intro sequence is gated behind the preloader and a two second fade, so every
 * capture waits for the network to settle plus SETTLE_MS before shooting. Without
 * that the page is caught mid-animation and every screenshot looks broken.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { mkdir, rm } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const OUT = join(ROOT, '.shots')
const PORT = 8477

/** Long enough for the preloader to clear and the hero intro to finish. */
const SETTLE_MS = 4200

/** Anchored sections, in page order. */
const SECTIONS = ['about', 'events', 'gallery', 'chapters', 'contact'] as const

const SHOTS = [
  { name: 'phone', width: 390, height: 844, scale: 2 },
  { name: 'tablet', width: 820, height: 1180, scale: 1 },
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
] as const

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0])
  const file = join(DIST, normalize(path === '/' ? '/index.html' : path))
  // normalize() collapses any ../ before this check, so the guard holds
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end()
    return
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end()
  }
})

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
await new Promise<void>((resolve) => server.listen(PORT, resolve))

// Uses the system Chrome rather than a Playwright-managed build, so this needs no
// `npx playwright install` download to work.
const browser = await chromium.launch({ channel: 'chrome' })
const errors: string[] = []

for (const shot of SHOTS) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: shot.scale,
    // drives the touch branch in main.ts, which the desktop viewport would miss
    hasTouch: shot.name === 'phone',
    isMobile: shot.name === 'phone',
  })

  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${shot.name}] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[${shot.name}] ${e.message}`))

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(SETTLE_MS)
  await page.screenshot({ path: join(OUT, `${shot.name}-fold.png`) })

  /*
   * Per-section viewport captures rather than one `fullPage` shot.
   *
   * ScrollSmoother drives the desktop page through a transformed `#smooth-content`,
   * so the document is really a tall empty spacer with the content transformed into
   * view. A full-page capture of that renders twelve thousand pixels of background
   * and a sliver of content. Scrolling to each section and shooting the viewport is
   * what the reader actually sees, and it triggers the scroll reveals on the way.
   */
  for (const id of SECTIONS) {
    /*
     * Stepped rather than an instant jump. ScrollSmoother eases the content toward
     * the native scroll position, so a jump lands the transform somewhere between
     * the two; and ScrollTrigger needs intermediate positions to fire the reveals it
     * would otherwise skip straight past, which leaves the section blank.
     */
    await page.evaluate(async (anchor) => {
      const el = document.getElementById(anchor)
      if (!el) return
      const to = el.getBoundingClientRect().top + window.scrollY
      const from = window.scrollY
      for (let i = 1; i <= 24; i++) {
        window.scrollTo(0, from + (to - from) * (i / 24))
        await new Promise((r) => setTimeout(r, 40))
      }
    }, id)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: join(OUT, `${shot.name}-${id}.png`) })
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)

  // horizontal overflow is the mobile failure that keeps recurring, so measure it
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  console.log(
    `${shot.name.padEnd(8)} ${shot.width}x${shot.height}  overflow: ${overflow > 0 ? `${overflow}px OVERFLOWING` : 'none'}`,
  )
  await page.close()
}

await browser.close()
server.close()

if (errors.length) {
  console.log(`\n${errors.length} console error(s):`)
  for (const e of errors) console.log(`  ${e}`)
} else {
  console.log('\nno console errors')
}
console.log(`\nshots written to .shots/`)
