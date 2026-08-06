'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CaretDown } from '@phosphor-icons/react'
import { execomFull } from '@/lib/content'
import { accentForName, initials, pad } from '@/lib/content-helpers'

/** Display order for the collapsible groups — independent of `execomFull`'s data order. */
const GROUP_ORDER = [
  'Webmasters',
  'Electronic Communications Coordinator',
  'Membership Development Coordinator',
  'Social Media Manager',
  'Program Coordinator',
  'Technical Coordinator',
  'Projects and Lab Coordinator',
  'Computer Society',
  'Communications Society',
  'Robotics and Automation Society',
  'Power and Energy Society',
  'Industry Applications Society',
  'IE/PELS Joint Chapter',
  'Signal Processing Society',
  'Women in Engineering (WiE)',
  'SIGHT',
  'Vehicular Technology Society',
]

const DEFAULT_OPEN: Record<string, boolean> = { Webmasters: true }

/** SVG ids can't contain spaces/slashes/parens — group names have all three. */
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function groupedMembers() {
  const byGroup = new Map<string, typeof execomFull>()
  for (const m of execomFull) {
    const list = byGroup.get(m.group)
    if (list) list.push(m)
    else byGroup.set(m.group, [m])
  }
  return GROUP_ORDER.map((group) => ({ group, members: byGroup.get(group) ?? [] })).filter(
    (g) => g.members.length > 0,
  )
}

export function ExecomGroups() {
  const groups = groupedMembers()
  const [open, setOpen] = useState<Record<string, boolean>>(DEFAULT_OPEN)

  return (
    <div className="execom-groups">
      {groups.map(({ group, members }) => {
        const isOpen = open[group] ?? false
        return (
          <div className="execom-group" key={group}>
            <button
              type="button"
              className="execom-group__header"
              aria-expanded={isOpen}
              onClick={() => setOpen((prev) => ({ ...prev, [group]: !prev[group] }))}
            >
              <span>{group}</span>
              <span className="execom-group__meta">
                <span className="execom-group__count">{members.length}</span>
                <CaretDown className="execom-group__chevron" size={14} weight="bold" aria-hidden="true" />
              </span>
            </button>
            <div className="execom-group__body">
              <div className="execom-group__body-inner">
                <div className="execom__grid">
                  {members.map((m, i) => {
                    const orbitId = `execom-orbit-${slugify(group)}-${i}`
                    return (
                      <article className="plate" data-circuit data-accent={accentForName(m.name)} key={m.name}>
                        <div className="plate__badge" aria-hidden="true">
                          <svg viewBox="0 0 120 120">
                            <defs>
                              <path
                                id={orbitId}
                                d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                              />
                            </defs>
                            <g className="plate__rotor">
                              <text className="plate__ring-text">
                                <textPath href={`#${orbitId}`}>{`IEEE MACE SB · EXECOM ${pad(i + 1)} · 32041 · `}</textPath>
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
                            <span>{m.designation}</span>
                          </p>
                          <p className="plate__row">
                            <b>CLASS</b>
                            <i />
                            <span>{m.class}</span>
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
