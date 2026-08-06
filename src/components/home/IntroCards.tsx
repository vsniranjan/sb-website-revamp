import { introCards } from '@/lib/content'
import { accentByIndex, pad } from '@/lib/content-helpers'

export function IntroCards() {
  return (
    <div className="intro__grid" id="intro-grid">
      {introCards.map((c, i) => (
        <article className="intro__panel" data-reveal data-accent={accentByIndex(i)} key={c.title}>
          <p className="intro__panel-side" aria-hidden="true">{`MODULE-${pad(i + 1)} // IEEE`}</p>
          <h3 className="intro__panel-title">{c.title}</h3>
          <p className="intro__panel-body">{c.body}</p>
        </article>
      ))}
    </div>
  )
}
