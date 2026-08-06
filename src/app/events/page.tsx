import type { Metadata } from 'next'
import { SectionAnimations } from '@/components/animation/SectionAnimations'
import { EventsList } from '@/components/events/EventsList'

export const metadata: Metadata = {
  description:
    'Flagship events and initiatives hosted by IEEE MACE SB — hackathons, speaker series, outreach, and humanitarian projects.',
}

export default function EventsPage() {
  return (
    <SectionAnimations>
      <section className="events section" id="events" aria-labelledby="events-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">Annual Calendar</p>
            <h2 className="section__title" id="events-heading">
              Major <span className="outline">Events</span> &amp; Initiatives
            </h2>
            <p className="section__subtext">
              Discover the flagship activities hosted by IEEE MACE SB that drive community collaboration,
              technical skill-building, and professional growth.
            </p>
          </header>
          <EventsList />
        </div>
      </section>
    </SectionAnimations>
  )
}
