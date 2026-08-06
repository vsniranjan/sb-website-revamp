import Image from 'next/image'
import { execom } from '@/lib/content'
import { accentForName, initials, pad, ContactRow } from '@/lib/content-helpers'

export function TeamGrid() {
  return (
    <div className="execom__grid" id="execom-grid">
      {execom.map((m, i) => (
        <article className="plate" data-reveal data-circuit data-accent={accentForName(m.name)} key={m.name}>
          <div className="plate__badge" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path
                  id={`plate-orbit-${i}`}
                  d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                />
              </defs>
              <g className="plate__rotor">
                <text className="plate__ring-text">
                  <textPath href={`#plate-orbit-${i}`}>{`IEEE MACE SB · EXECOM ${pad(i + 1)} · 32041 · `}</textPath>
                </text>
              </g>
              <circle className="plate__ring" cx="60" cy="60" r="36" />
            </svg>
            {m.photo ? (
              <Image
                className="plate__photo"
                src={`/team/${m.photo}`}
                width={200}
                height={200}
                alt=""
              />
            ) : (
              <span className="plate__monogram">{initials(m.name)}</span>
            )}
          </div>
          <div className="plate__spec">
            <p className="plate__row">
              <b>NAME</b>
              <i />
              <span>{m.name}</span>
            </p>
            <p className="plate__row">
              <b>ROLE</b>
              <i />
              <span>{m.role}</span>
            </p>
            <ContactRow m={m} />
          </div>
        </article>
      ))}
    </div>
  )
}
