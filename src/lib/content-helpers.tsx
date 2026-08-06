import type { ExecomMember } from './content'

export function initials(name: string): string {
  const clean = name.replace(/^Dr\.\s+/, '')
  const parts = clean.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Third spec row of a team plate. Members who publish contact details get the
 * links; the ones who publish none — the counsellor — get their unit instead, so
 * every plate keeps the same three-row rhythm without a dead link or a blank.
 */
export function ContactRow({ m }: { m: ExecomMember }) {
  const links = [
    m.email && (
      <a key="email" href={`mailto:${m.email}`} aria-label={`Email ${m.name}`}>
        Email
      </a>
    ),
    m.phone && (
      <a key="phone" href={`tel:${m.phone.replace(/\s+/g, '')}`} aria-label={`Call ${m.name}`}>
        Call
      </a>
    ),
  ].filter(Boolean)

  if (!links.length) {
    return (
      <p className="plate__row">
        <b>UNIT</b>
        <i />
        <span>{m.unit}</span>
      </p>
    )
  }
  return (
    <p className="plate__row plate__row--links">
      <b>LINK</b>
      <i />
      <span>{links}</span>
    </p>
  )
}

export function chipAbbrev(name: string): string {
  const paren = name.match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  if (name.startsWith('Computer')) return 'CS'
  if (name.startsWith('IE/PELS')) return 'IE/PELS'
  if (name.startsWith('SIGHT')) return 'SIGHT'
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
