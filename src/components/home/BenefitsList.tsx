'use client'

import { benefits } from '@/lib/content'
import { accentByIndex, pad } from '@/lib/content-helpers'
import { benefitIcon } from '@/lib/content-icons'

export function BenefitsList() {
  return (
    <div className="whyjoin__benefits" id="benefits-list">
      {benefits.map((b, i) => {
        const Icon = benefitIcon(i)
        return (
          <article className="callout" data-reveal data-accent={accentByIndex(i)} key={b.title}>
            <span className="callout__index" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <span className="callout__leader" aria-hidden="true">
              <i />
            </span>
            <div className="callout__content">
              <h3 className="callout__title">
                <Icon className="callout__icon" size={20} weight="bold" aria-hidden="true" />
                {b.title}
              </h3>
              <p className="callout__body">{b.body}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
