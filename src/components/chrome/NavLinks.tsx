'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/nav-links'

export function NavLinks() {
  const pathname = usePathname()
  return (
    <ul className="navbar__links" id="nav-links">
      {NAV_LINKS.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={`navbar__link${pathname === l.href ? ' is-active' : ''}`}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
