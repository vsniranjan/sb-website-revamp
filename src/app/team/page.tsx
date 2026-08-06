import type { Metadata } from 'next'
import { SectionAnimations } from '@/components/animation/SectionAnimations'
import { TeamGrid } from '@/components/team/TeamGrid'
import { ExecomGroups } from '@/components/team/ExecomGroups'
import { execomFull } from '@/lib/content'

export const metadata: Metadata = {
  description:
    'Meet the executive committee driving the strategy, operations, and vision of IEEE MACE SB.',
}

export default function TeamPage() {
  return (
    <SectionAnimations>
      <section className="execom section" id="team" aria-labelledby="execom-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">Branch Leadership</p>
            <h2 className="section__title" id="execom-heading">
              Executive <span className="outline">Committee</span>
            </h2>
            <p className="section__subtext">
              Meet the office bearers and technical advisors driving the strategy, operations, and vision
              of IEEE MACE SB.
            </p>
          </header>
          <TeamGrid />
          <p className="execom-more-hint" data-reveal>
            <span aria-hidden="true">↓</span> {execomFull.length} more below
          </p>
        </div>
      </section>

      <section className="execom section" id="execom-full" aria-labelledby="execom-full-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">2026 Roster</p>
            <h2 className="section__title" id="execom-full-heading">
              Meet the Full <span className="outline">ExeCom</span>
            </h2>
            <p className="section__subtext">
              Beyond the core office bearers, IEEE MACE SB&apos;s Executive Committee brings together
              student volunteers across every domain, society, and affinity group.
            </p>
          </header>
          <ExecomGroups />
          <div className="execom__closing" data-reveal>
            <p>Looking to join our committees or get involved?</p>
            <a className="btn btn--secondary" href="/contact">
              Contact our team
            </a>
          </div>
        </div>
      </section>
    </SectionAnimations>
  )
}
