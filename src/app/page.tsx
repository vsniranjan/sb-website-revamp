import Link from 'next/link'
import { SectionAnimations } from '@/components/animation/SectionAnimations'
import { HeroIntro } from '@/components/animation/HeroIntro'
import { IntroCards } from '@/components/home/IntroCards'
import { BenefitsList } from '@/components/home/BenefitsList'
import { RulerTicks } from '@/components/home/RulerTicks'

export default function HomePage() {
  return (
    <SectionAnimations>
      <HeroIntro>
        <p className="hero__margin-label" aria-hidden="true">
          EST. 1988 · KOTHAMANGALAM · 32041
        </p>
        <div className="container hero__layout">
          <p className="hero__badge eyebrow">IEEE MACE Student Branch</p>
          <h1 className="hero__title">
            Empowering Innovation, <span className="outline">Shaping&nbsp;Tomorrow.</span>
          </h1>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="https://www.ieee.org" target="_blank" rel="noopener">
              Join Us Today
            </a>
            <Link className="btn btn--secondary" href="/about">
              Explore Branch
            </Link>
          </div>
        </div>
        <Link className="hero__scrollcue" href="/about" aria-label="Scroll to About">
          <span className="hero__scrollcue-label">Scroll</span>
          <span className="hero__scrollcue-line" aria-hidden="true" />
        </Link>
      </HeroIntro>

      <section className="intro section" id="intro" aria-labelledby="intro-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">Foundation</p>
            <h2 className="section__title" id="intro-heading">
              Global <span className="outline">Tech</span> Leadership
            </h2>
            <p className="section__subtext">
              Understand the foundation of the world&apos;s largest technical professional organization
              dedicated to advancing technology.
            </p>
          </header>
          <div className="intro__board">
            <svg
              className="intro__traces"
              viewBox="0 0 1200 520"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="trace" d="M200 96 H384 V240 H400" />
              <path className="trace" d="M600 460 V336 H800 V240 H816" />
              <circle className="trace-pad" cx="200" cy="96" r="5" />
              <circle className="trace-pad" cx="600" cy="460" r="5" />
            </svg>
            <IntroCards />
          </div>
        </div>
      </section>

      <section className="whyjoin section" id="whyjoin" aria-labelledby="whyjoin-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">Membership Benefits</p>
            <h2 className="section__title" id="whyjoin-heading">
              Unlock a World of <span className="outline">Technical Opportunity</span>
            </h2>
            <p className="section__subtext">
              Joining IEEE is not just about a membership card — it is an investment in your career,
              your network, and your future. Student members gain immediate access to global resources,
              funding, and leadership roles.
            </p>
          </header>
          <div className="whyjoin__layout">
            <aside className="whyjoin__stat">
              <svg className="whyjoin__ruler" viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="38" x2="320" y2="38" />
                <RulerTicks />
              </svg>
              <p className="whyjoin__stat-value">
                <span className="counter" data-counter={500000}>
                  0
                </span>
                <span className="whyjoin__stat-plus">+</span>
              </p>
              <p className="whyjoin__stat-label">Members in Over 160 Countries</p>
              <p className="whyjoin__stat-note">Join the largest technical professional network in the world.</p>
            </aside>
            <BenefitsList />
          </div>
        </div>
      </section>
    </SectionAnimations>
  )
}
