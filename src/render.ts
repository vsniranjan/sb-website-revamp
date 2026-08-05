// Renders bespoke section components from content.ts into their mount points.
import {
  aboutStats,
  benefits,
  chapters,
  events,
  execom,
  galleryPosters,
  introCards,
  type ExecomMember,
  type GalleryPoster,
} from './content'
import { posterSizes } from './gallery-manifest.generated'

function mount(id: string): HTMLElement {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Missing mount point #${id}`)
  return el
}

function initials(name: string): string {
  const clean = name.replace(/^Dr\.\s+/, '')
  const parts = clean.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Third spec row of an execom plate. Members who publish contact details get the
 * links; the ones who publish none — the counsellor — get their unit instead, so
 * every plate keeps the same three-row rhythm without a dead link or a blank.
 */
function contactRow(m: ExecomMember): string {
  const links = [
    m.email && `<a href="mailto:${m.email}" aria-label="Email ${m.name}">Email</a>`,
    m.phone &&
      `<a href="tel:${m.phone.replace(/\s+/g, '')}" aria-label="Call ${m.name}">Call</a>`,
  ].filter(Boolean)

  if (!links.length) {
    return `<p class="plate__row"><b>UNIT</b><i></i><span>${m.unit}</span></p>`
  }
  return `<p class="plate__row plate__row--links"><b>LINK</b><i></i><span>
            ${links.join('\n            ')}
          </span></p>`
}

/* ---------- poster reel ---------- */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * One poster plate. `--poster-ar` carries the image's own ratio so CSS can size the
 * frame from the reel's shared height — square and portrait posters, no crop.
 * `decorative` marks the duplicated set that only exists to close the marquee loop.
 */
function posterFigure(poster: GalleryPoster, i: number, decorative: boolean): string {
  const size = posterSizes[poster.slug]
  if (!size) {
    throw new Error(`No optimized image for "${poster.slug}" — run \`npm run gallery\``)
  }

  const ratio = (size.width / size.height).toFixed(4)
  const title = escapeHtml(poster.title)

  return `
    <figure class="poster poster--v${(i % 4) + 1}" style="--poster-ar:${ratio}">
      <div class="poster__frame">
        <img
          class="poster__img"
          src="/gallery/${poster.slug}.webp"
          width="${size.width}"
          height="${size.height}"
          loading="lazy"
          decoding="async"
          alt="${decorative ? '' : `Event poster — ${title}`}"
        />
      </div>
      <figcaption class="poster__caption">
        <span class="poster__index" aria-hidden="true">${pad(i + 1)}</span>
        <span class="poster__title">${title}</span>
        <span class="poster__tag">${escapeHtml(poster.tag)}</span>
      </figcaption>
    </figure>`
}

/* ---------- chapter chip abbreviations ---------- */

function chipAbbrev(name: string): string {
  const paren = name.match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  if (name.startsWith('Computer')) return 'CS'
  if (name.startsWith('IE/PELS')) return 'IE/PELS'
  if (name.startsWith('SIGHT')) return 'SIGHT'
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/* ---------- render ---------- */

export function renderContent(): void {
  // 02 · schematic triptych
  mount('intro-grid').innerHTML = introCards
    .map(
      (c, i) => `
      <article class="intro__panel" data-reveal>
        <p class="intro__panel-side" aria-hidden="true">MODULE-${pad(i + 1)} // IEEE</p>
        <h3 class="intro__panel-title">${c.title}</h3>
        <p class="intro__panel-body">${c.body}</p>
      </article>`,
    )
    .join('')

  // 03 · dimension-callout benefit rows
  mount('benefits-list').innerHTML = benefits
    .map(
      (b, i) => `
      <article class="callout" data-reveal>
        <span class="callout__index" aria-hidden="true">${pad(i + 1)}</span>
        <span class="callout__leader" aria-hidden="true"><i></i></span>
        <div class="callout__content">
          <h3 class="callout__title">${b.title}</h3>
          <p class="callout__body">${b.body}</p>
        </div>
      </article>`,
    )
    .join('')

  // whyjoin ruler ticks
  const ticks = document.querySelector('.whyjoin__ruler-ticks')
  if (ticks) {
    let t = ''
    for (let i = 0; i <= 40; i++) {
      const major = i % 5 === 0
      t += `<line x1="${i * 8}" y1="${major ? 16 : 27}" x2="${i * 8}" y2="38"/>`
    }
    ticks.innerHTML = t
  }

  // 04 · gauges + rotating seal
  const [members, years, estd] = aboutStats
  mount('about-stats').innerHTML = `
    <div class="gauge" data-reveal>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="gauge__track" cx="60" cy="60" r="48" />
        <circle class="gauge__fill" cx="60" cy="60" r="48" data-fill="0.78" />
        <line class="gauge__needle" x1="60" y1="60" x2="60" y2="18" data-fill="0.78" />
        <circle class="gauge__hub" cx="60" cy="60" r="3.4" />
      </svg>
      <p class="gauge__value"><span class="counter" data-counter="${members.value}">0</span>${members.suffix}</p>
      <p class="gauge__label">${members.label}</p>
    </div>
    <div class="gauge" data-reveal>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="gauge__track" cx="60" cy="60" r="48" />
        <circle class="gauge__fill" cx="60" cy="60" r="48" data-fill="0.7" />
        <line class="gauge__needle" x1="60" y1="60" x2="60" y2="18" data-fill="0.7" />
        <circle class="gauge__hub" cx="60" cy="60" r="3.4" />
      </svg>
      <p class="gauge__value"><span class="counter" data-counter="${years.value}">0</span>${years.suffix}</p>
      <p class="gauge__label">${years.label}</p>
    </div>
    <div class="seal" data-reveal>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="seal-orbit" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
        </defs>
        <g class="seal__rotor">
          <text class="seal__ring-text">
            <textPath href="#seal-orbit">ESTD 1988 · IEEE MACE SB · 32041&#160;·&#160;</textPath>
          </text>
        </g>
        <circle class="seal__inner" cx="60" cy="60" r="30" />
        <path class="seal__bolt" d="M64 42 52 62h8l-4 16 12-20h-8l4-16Z" />
      </svg>
      <p class="gauge__value">${estd.value}</p>
      <p class="gauge__label">${estd.label}</p>
    </div>`

  // 05 · index ledger rows
  mount('events-grid').innerHTML = events
    .map(
      (e, i) => `
      <li class="event-row" data-reveal>
        <span class="event-row__index" aria-hidden="true">${pad(i + 1)}</span>
        <div class="event-row__head">
          <h3 class="event-row__title">${e.title}</h3>
          <p class="event-row__tag">${e.tag}</p>
        </div>
        <p class="event-row__body">${e.body}</p>
      </li>`,
    )
    .join('')

  // 06 · drafting plates with ring-text badges
  mount('execom-grid').innerHTML = execom
    .map(
      (m, i) => `
      <article class="plate" data-reveal>
        <div class="plate__badge" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="plate-orbit-${i}" d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
            </defs>
            <g class="plate__rotor">
              <text class="plate__ring-text">
                <textPath href="#plate-orbit-${i}">IEEE MACE SB · EXECOM ${pad(i + 1)} · 32041 ·&#160;</textPath>
              </text>
            </g>
            <circle class="plate__ring" cx="60" cy="60" r="36" />
          </svg>
          ${
            m.photo
              ? `<img class="plate__photo" src="/team/${m.photo}" decoding="async" alt="" />`
              : `<span class="plate__monogram">${initials(m.name)}</span>`
          }
        </div>
        <div class="plate__spec">
          <p class="plate__row"><b>NAME</b><i></i><span>${m.name}</span></p>
          <p class="plate__row"><b>ROLE</b><i></i><span>${m.role}</span></p>
          ${contactRow(m)}
        </div>
      </article>`,
    )
    .join('')

  // 07 · event poster reel (set duplicated for a seamless loop)
  const posterSet = (duplicate: boolean) =>
    `<div class="gallery__set"${duplicate ? ' aria-hidden="true"' : ''}>${galleryPosters
      .map((poster, i) => posterFigure(poster, i, duplicate))
      .join('')}</div>`
  mount('gallery-track').innerHTML = posterSet(false) + posterSet(true)

  // 08 · IC-chip tiles
  mount('chapters-grid').innerHTML = chapters
    .map(
      (c, i) => `
      <article class="chip" data-reveal>
        <span class="chip__notch" aria-hidden="true"></span>
        <span class="chip__pins chip__pins--l" aria-hidden="true"></span>
        <span class="chip__pins chip__pins--r" aria-hidden="true"></span>
        <p class="chip__part" aria-hidden="true">IEEE-32041-${pad(i + 1)}</p>
        <p class="chip__abbrev" aria-hidden="true">${chipAbbrev(c.name)}</p>
        <h3 class="chip__title">${c.name}</h3>
        <p class="chip__body">${c.body}</p>
        <a class="chip__link" href="${c.url}" target="_blank" rel="noopener">Visit Society Portal</a>
      </article>`,
    )
    .join('')

  // ticker
  const tickerPhrases =
    'ADVANCING TECHNOLOGY FOR HUMANITY · SINCE 1988 · >.HACK(); · SPARC · STEM OUTREACH · HACK-HER · HACK-A-DDIT · LIGHT THE LIVES · CONNECT THE LIVES · '
  const tickerTrack = document.getElementById('ticker-track')
  if (tickerTrack) {
    tickerTrack.innerHTML = `<span>${tickerPhrases}</span><span aria-hidden="true">${tickerPhrases}</span>`
  }

  const year = document.getElementById('footer-year')
  if (year) year.textContent = String(new Date().getFullYear())
}
