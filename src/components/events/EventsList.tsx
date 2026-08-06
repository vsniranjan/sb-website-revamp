'use client'

import { events } from '@/lib/content'
import { accentByIndex, pad } from '@/lib/content-helpers'
import { eventIcon } from '@/lib/content-icons'

export function EventsList() {
  return (
    <ol className="events__list" id="events-grid">
      {events.map((e, i) => {
        const Icon = eventIcon(e.tag)
        return (
          <li className="event-row" data-reveal data-circuit data-accent={accentByIndex(i)} key={e.title}>
            <span className="event-row__index" aria-hidden="true">
              {pad(i + 1)}
            </span>
            <div className="event-row__head">
              <h3 className="event-row__title">{e.title}</h3>
              <p className="event-row__tag">
                <Icon className="event-row__tag-icon" size={13} weight="bold" aria-hidden="true" />
                {e.tag}
              </p>
            </div>
            <p className="event-row__body">{e.body}</p>
          </li>
        )
      })}
    </ol>
  )
}
