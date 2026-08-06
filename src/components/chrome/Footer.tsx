export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__giant" aria-hidden="true">
        {'IEEE MACE SB'}
      </p>
      <div className="container footer__layout">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer__logo" src="/logo.svg" alt="IEEE MACE SB" width={44} height={44} />
          <p className="footer__wordmark">
            IEEE <em>MACE SB</em>
          </p>
          <p className="footer__tagline">Student Branch</p>
          <p className="footer__blurb">
            Mar Athanasius College of Engineering Student Branch of IEEE. Promoting excellence and
            engineering innovation for the benefit of humanity since 1988.
          </p>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Useful Links</p>
          <ul>
            <li>
              <a href="https://www.ieee.org" target="_blank" rel="noopener">
                IEEE.org
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Connect Online</p>
          <ul className="footer__social">
            <li>
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter / X">
                Twitter / X
              </a>
            </li>
            <li>
              <a href="#" aria-label="Facebook">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" aria-label="YouTube">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <p>
          © <span id="footer-year">{new Date().getFullYear()}</span> IEEE MACE. All rights reserved.
        </p>
        <p>Designed and Developed by IEEE MACE SB WebTeam</p>
        <button className="footer__top" id="back-to-top">
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
