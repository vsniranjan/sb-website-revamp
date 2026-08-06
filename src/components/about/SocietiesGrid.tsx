import { chapters } from '@/lib/content'
import { accentByIndex, pad, chipAbbrev } from '@/lib/content-helpers'

export function SocietiesGrid() {
  return (
    <div className="chapters__grid" id="chapters-grid">
      {chapters.map((c, i) => (
        <article className="chip" data-reveal data-circuit data-accent={accentByIndex(i)} key={c.name}>
          <span className="chip__notch" aria-hidden="true" />
          <span className="chip__pins chip__pins--l" aria-hidden="true" />
          <span className="chip__pins chip__pins--r" aria-hidden="true" />
          <p className="chip__part" aria-hidden="true">{`IEEE-32041-${pad(i + 1)}`}</p>
          <p className="chip__abbrev" aria-hidden="true">
            {chipAbbrev(c.name)}
          </p>
          <h3 className="chip__title">{c.name}</h3>
          <p className="chip__body">{c.body}</p>
          <a className="chip__link" href={c.url} target="_blank" rel="noopener">
            Visit Society Portal
          </a>
        </article>
      ))}
    </div>
  )
}
