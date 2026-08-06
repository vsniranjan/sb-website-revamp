import Link from 'next/link'
import { SignalLostGame } from '@/components/not-found/SignalLostGame'

export default function NotFound() {
  return (
    <section className="not-found section" aria-labelledby="not-found-heading">
      <div className="container not-found__layout">
        <header className="section__head">
          <p className="eyebrow">Error 404</p>
          <h2 className="section__title" id="not-found-heading">
            <span className="outline">Signal</span> Lost
          </h2>
          <p className="section__subtext">
            That page doesn&apos;t exist — but since you&apos;re here, jump a few obstacles.
          </p>
        </header>
        <SignalLostGame />
        <Link className="btn btn--secondary" href="/">
          Back to safety
        </Link>
      </div>
    </section>
  )
}
