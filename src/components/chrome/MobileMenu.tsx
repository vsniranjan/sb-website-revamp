import Link from 'next/link'
import { NAV_LINKS } from '@/lib/nav-links'

export function MobileMenu() {
  return (
    <div className="menu" id="mobile-menu" aria-hidden="true">
      <nav aria-label="Mobile">
        <ul className="menu__links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="menu__link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <a className="btn btn--primary menu__cta" href="https://www.ieee.org" target="_blank" rel="noopener">
        Join IEEE
      </a>
    </div>
  )
}
