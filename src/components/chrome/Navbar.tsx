import Link from 'next/link'
import { NavLinks } from './NavLinks'

export function Navbar() {
  return (
    <header className="navbar" id="navbar">
      <div className="navbar__inner">
        <Link className="navbar__brand" href="/" aria-label="IEEE MACE SB — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="navbar__logo" src="/logo.svg" alt="IEEE MACE SB" width={40} height={40} />
          <span className="navbar__wordmark">
            IEEE <em>MACE SB</em>
          </span>
        </Link>
        <nav className="navbar__nav" aria-label="Primary">
          <NavLinks />
        </nav>
        <a className="btn btn--primary navbar__cta" href="https://www.ieee.org" target="_blank" rel="noopener">
          Join IEEE
        </a>
        <button
          className="navbar__burger"
          id="nav-burger"
          aria-expanded="false"
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
