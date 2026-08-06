import { aboutStats } from '@/lib/content'

export function AboutStats() {
  const [members, years, estd] = aboutStats
  return (
    <div className="about__stats" id="about-stats">
      <div className="gauge" data-reveal>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="gauge__track" cx="60" cy="60" r="48" />
          <circle className="gauge__fill" cx="60" cy="60" r="48" data-fill="0.78" />
          <line className="gauge__needle" x1="60" y1="60" x2="60" y2="18" data-fill="0.78" />
          <circle className="gauge__hub" cx="60" cy="60" r="3.4" />
        </svg>
        <p className="gauge__value">
          <span className="counter" data-counter={members.value}>
            0
          </span>
          {members.suffix}
        </p>
        <p className="gauge__label">{members.label}</p>
      </div>
      <div className="gauge" data-reveal>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="gauge__track" cx="60" cy="60" r="48" />
          <circle className="gauge__fill" cx="60" cy="60" r="48" data-fill="0.7" />
          <line className="gauge__needle" x1="60" y1="60" x2="60" y2="18" data-fill="0.7" />
          <circle className="gauge__hub" cx="60" cy="60" r="3.4" />
        </svg>
        <p className="gauge__value">
          <span className="counter" data-counter={years.value}>
            0
          </span>
          {years.suffix}
        </p>
        <p className="gauge__label">{years.label}</p>
      </div>
      <div className="seal" data-reveal>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="seal-orbit" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
          </defs>
          <g className="seal__rotor">
            <text className="seal__ring-text">
              <textPath href="#seal-orbit">{'ESTD 1988 · IEEE MACE SB · 32041 · '}</textPath>
            </text>
          </g>
          <circle className="seal__inner" cx="60" cy="60" r="30" />
          <path className="seal__bolt" d="M64 42 52 62h8l-4 16 12-20h-8l4-16Z" />
        </svg>
        <p className="gauge__value">{estd.value}</p>
        <p className="gauge__label">{estd.label}</p>
      </div>
    </div>
  )
}
