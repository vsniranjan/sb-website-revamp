import { events } from '@/lib/content'
import { pad } from '@/lib/content-helpers'

export function EventsList() {
  return (
    <ol className="events__list" id="events-grid">
      {events.map((e, i) => (
        <li className="event-row" data-reveal key={e.title}>
          <span className="event-row__index" aria-hidden="true">
            {pad(i + 1)}
          </span>
          <div className="event-row__head">
            <h3 className="event-row__title">{e.title}</h3>
            <p className="event-row__tag">{e.tag}</p>
          </div>
          <p className="event-row__body">{e.body}</p>
        </li>
      ))}
    </ol>
  )
}
