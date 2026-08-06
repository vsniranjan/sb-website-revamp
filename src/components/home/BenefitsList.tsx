import { benefits } from '@/lib/content'
import { pad } from '@/lib/content-helpers'

export function BenefitsList() {
  return (
    <div className="whyjoin__benefits" id="benefits-list">
      {benefits.map((b, i) => (
        <article className="callout" data-reveal key={b.title}>
          <span className="callout__index" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <span className="callout__leader" aria-hidden="true">
            <i />
          </span>
          <div className="callout__content">
            <h3 className="callout__title">{b.title}</h3>
            <p className="callout__body">{b.body}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
