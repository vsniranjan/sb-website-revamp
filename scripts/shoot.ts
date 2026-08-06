/**
 * Screenshots the built site so changes can be reviewed without a human in the loop.
 *
 *   npm run build && npm run shoot
 *
 * Starts `next start` on a throwaway port, then for each viewport in `SHOTS`
 * visits every route in `ROUTES` and captures the full page. Output lands in
 * `.shots/`, which is gitignored.
 *
 * The intro sequence is gated behind the preloader and a two second fade, so
 * the first capture waits for the network to settle plus SETTLE_MS before
 * shooting. Every route after that shares the same tab session, so the
 * preloader/hero intro correctly skip on the rest (see BootController).
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type Page } from 'playwright'

const ROOT = new URL('..', import.meta.url).pathname
const OUT = join(ROOT, '.shots')
const PORT = 8477

/** Long enough for the preloader to clear and the hero intro to finish. */
const SETTLE_MS = 4200

const ROUTES = ['/', '/about', '/events', '/team', '/gallery', '/playground', '/contact'] as const

const SHOTS = [
  { name: 'phone', width: 390, height: 844, scale: 2 },
  { name: 'tablet', width: 820, height: 1180, scale: 1 },
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
] as const

function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url)
        if (res.ok || res.status < 500) {
          resolve()
          return
        }
      } catch {
        // server not up yet
      }
      if (Date.now() > deadline) {
        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`))
        return
      }
      setTimeout(attempt, 200)
    }
    void attempt()
  })
}

/**
 * Steps through the whole page rather than jumping straight to the bottom.
 * ScrollTrigger needs intermediate positions to fire the reveals it would
 * otherwise skip straight past, which leaves cards/sections blank in a
 * `fullPage` screenshot taken cold.
 */
async function triggerReveals(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const to = document.documentElement.scrollHeight - window.innerHeight
    const steps = 24
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, (to * i) / steps)
      await new Promise((r) => setTimeout(r, 40))
    }
  })
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

async function main(): Promise<void> {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const server: ChildProcess = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: ROOT,
    stdio: 'pipe',
  })
  server.on('error', (e) => {
    throw e
  })

  try {
    await waitForServer(`http://localhost:${PORT}/`, 30000)

    // Uses the system Chrome rather than a Playwright-managed build, so this
    // needs no `npx playwright install` download to work.
    const browser = await chromium.launch({ channel: 'chrome' })
    const errors: string[] = []

    for (const shot of SHOTS) {
      const page = await browser.newPage({
        viewport: { width: shot.width, height: shot.height },
        deviceScaleFactor: shot.scale,
        // drives the touch branch in Backdrop.tsx, which the desktop viewport would miss
        hasTouch: shot.name === 'phone',
        isMobile: shot.name === 'phone',
      })

      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`[${shot.name}] ${m.text()}`)
      })
      page.on('pageerror', (e) => errors.push(`[${shot.name}] ${e.message}`))

      let first = true
      for (const route of ROUTES) {
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(first ? SETTLE_MS : 500)
        first = false

        await triggerReveals(page)
        const name = route === '/' ? 'home' : route.slice(1)
        await page.screenshot({ path: join(OUT, `${shot.name}-${name}.png`), fullPage: true })
      }

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

    if (errors.length) {
      console.log(`\n${errors.length} console error(s):`)
      for (const e of errors) console.log(`  ${e}`)
    } else {
      console.log('\nno console errors')
    }
    console.log(`\nshots written to .shots/`)
  } finally {
    server.kill()
  }
}

await main()
