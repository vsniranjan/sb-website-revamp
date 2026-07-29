// Renders bespoke section components from content.ts into their mount points.
import {
  aboutStats,
  benefits,
  chapters,
  events,
  execom,
  galleryPosters,
  introCards,
} from './content'

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

/* ---------- generative poster motifs (blueprint schematics) ---------- */

function motifWaveform(): string {
  const pts: string[] = []
  for (let x = 0; x <= 200; x += 4) {
    const y = 130 + Math.sin(x / 14) * 34 * Math.sin(x / 90)
    pts.push(`${x},${y.toFixed(1)}`)
  }
  const dots = [30, 70, 110, 150, 190]
    .map((x) => {
      const y = 130 + Math.sin(x / 14) * 34 * Math.sin(x / 90)
      return `<circle cx="${x}" cy="${y.toFixed(1)}" r="2.6" class="motif-pad"/>`
    })
    .join('')
  return `<polyline points="${pts.join(' ')}" class="motif-line"/>
    <line x1="0" y1="130" x2="200" y2="130" class="motif-faint"/>${dots}`
}

function motifCircuit(): string {
  return `
    <rect x="72" y="96" width="56" height="56" class="motif-line"/>
    <path d="M72 110 H28 V54 H10" class="motif-line"/>
    <path d="M72 138 H44 V206 H10" class="motif-line"/>
    <path d="M128 110 H164 V60 H190" class="motif-line"/>
    <path d="M128 138 H156 V196 H190" class="motif-line"/>
    <path d="M100 96 V40" class="motif-line"/>
    <path d="M100 152 V220" class="motif-line"/>
    <circle cx="10" cy="54" r="3.4" class="motif-pad"/>
    <circle cx="10" cy="206" r="3.4" class="motif-pad"/>
    <circle cx="190" cy="60" r="3.4" class="motif-pad"/>
    <circle cx="190" cy="196" r="3.4" class="motif-pad"/>
    <circle cx="100" cy="40" r="3.4" class="motif-pad"/>
    <circle cx="100" cy="220" r="3.4" class="motif-pad"/>`
}

function motifRadial(): string {
  const arcs = [26, 44, 62, 80]
    .map(
      (r) =>
        `<path d="M ${100 - r} 130 A ${r} ${r} 0 0 1 ${100 + r} 130" class="motif-line"/>`,
    )
    .join('')
  return `${arcs}
    <line x1="100" y1="130" x2="100" y2="52" class="motif-line"/>
    <circle cx="100" cy="130" r="4" class="motif-pad"/>
    <line x1="20" y1="130" x2="180" y2="130" class="motif-faint"/>`
}

function motifMatrix(): string {
  let dots = ''
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 6; c++) {
      const on = (r * 6 + c) % 4 === 0
      dots += `<circle cx="${40 + c * 24}" cy="${70 + r * 20}" r="${on ? 3.2 : 1.4}" class="${on ? 'motif-pad' : 'motif-dot'}"/>`
    }
  }
  return `${dots}<line x1="24" y1="216" x2="176" y2="56" class="motif-faint"/>`
}

const MOTIFS = [motifWaveform, motifCircuit, motifRadial, motifMatrix]

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
        <span class="intro__panel-ghost" aria-hidden="true">${pad(i + 1)}</span>
        <p class="intro__panel-side" aria-hidden="true">MODULE-${pad(i + 1)} // IEEE</p>
        <h3 class="intro__panel-title">${c.title}</h3>
        <p class="intro__panel-body">${c.body}</p>
        <span class="intro__panel-pin" aria-hidden="true"></span>
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
              ? `<img class="plate__photo" src="${m.photo}" alt="" loading="lazy" />`
              : `<span class="plate__monogram">${initials(m.name)}</span>`
          }
        </div>
        <div class="plate__spec">
          <p class="plate__row"><b>NAME</b><i></i><span>${m.name}</span></p>
          <p class="plate__row"><b>ROLE</b><i></i><span>${m.role}</span></p>
          <p class="plate__row plate__row--links"><b>LINK</b><i></i><span>
            <a href="mailto:${m.email}">Email</a>
            <a href="${m.linkedin}" aria-label="LinkedIn profile of ${m.name}">LinkedIn</a>
          </span></p>
        </div>
      </article>`,
    )
    .join('')

  // 07 · generative poster reel (track duplicated for seamless loop)
  const posterCards = (hidden: boolean) =>
    `<div class="gallery__set" ${hidden ? 'aria-hidden="true"' : ''}>${galleryPosters
      .map(
        (title, i) => `
        <figure class="poster poster--v${(i % 4) + 1}">
          <div class="poster__art" aria-hidden="true">
            <span class="poster__num">${pad(i + 1)}</span>
            <svg class="poster__lines" viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet">
              ${MOTIFS[i % MOTIFS.length]()}
            </svg>
            <span class="poster__stamp">IEEE-SB-${pad(i + 1)}</span>
          </div>
          <figcaption class="poster__title">${title}</figcaption>
        </figure>`,
      )
      .join('')}</div>`
  mount('gallery-track').innerHTML = posterCards(false) + posterCards(true)

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
