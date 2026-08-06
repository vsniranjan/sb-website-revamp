export function PreloaderOverlay() {
  return (
    <div className="preloader" id="preloader" aria-hidden="true">
      <div className="preloader__inner">
        <svg className="preloader__mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle className="preloader__circle" cx="32" cy="32" r="22" />
          <path className="preloader__bolt" d="M36 14 24 34h8l-4 16 12-20h-8l4-16Z" />
        </svg>
        <p className="preloader__label">
          <span className="preloader__counter" id="preloader-counter">
            00
          </span>{' '}
          / 100
        </p>
      </div>
    </div>
  )
}
