'use client'

import { contactIcon } from '@/lib/content-icons'

const LINES = [
  {
    label: 'Student Branch Headquarters',
    value: 'Mar Athanasius College of Engineering, Kothamangalam, Kerala - 686666, India',
  },
  { label: 'Call Us', value: <a href="tel:+918921931121">+91 8921931121</a> },
  {
    label: 'Email Us',
    value: <a href="mailto:ieeemacesbofficial@gmail.com">ieeemacesbofficial@gmail.com</a>,
  },
]

export function ContactConsole() {
  return (
    <address className="console" data-reveal>
      <p className="console__head" aria-hidden="true">
        TRANSMISSION // IEEE-MACE-SB
      </p>
      {LINES.map((line, i) => {
        const Icon = contactIcon(i)
        return (
          <div className="console__line" key={line.label}>
            <p className="console__label">
              <Icon className="console__label-icon" size={14} weight="bold" aria-hidden="true" />
              {line.label}
            </p>
            <p className="console__value">{line.value}</p>
          </div>
        )
      })}
    </address>
  )
}
