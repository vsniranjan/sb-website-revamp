import { galleryPosters, type GalleryPoster } from '@/lib/content'
import { posterSizes } from '@/lib/gallery-manifest.generated'
import { pad } from '@/lib/content-helpers'

function PosterFigure({ poster, i, decorative }: { poster: GalleryPoster; i: number; decorative: boolean }) {
  const size = posterSizes[poster.slug]
  if (!size) {
    throw new Error(`No optimized image for "${poster.slug}" — run \`npm run gallery\``)
  }
  const ratio = (size.width / size.height).toFixed(4)

  return (
    <figure className={`poster poster--v${(i % 4) + 1}`} style={{ '--poster-ar': ratio } as React.CSSProperties}>
      <div className="poster__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="poster__img"
          src={`/gallery/${poster.slug}.webp`}
          width={size.width}
          height={size.height}
          loading="lazy"
          decoding="async"
          alt={decorative ? '' : `Event poster — ${poster.title}`}
        />
      </div>
      <figcaption className="poster__caption">
        <span className="poster__index" aria-hidden="true">
          {pad(i + 1)}
        </span>
        <span className="poster__title">{poster.title}</span>
        <span className="poster__tag">{poster.tag}</span>
      </figcaption>
    </figure>
  )
}

function PosterSet({ duplicate }: { duplicate: boolean }) {
  return (
    <div className="gallery__set" aria-hidden={duplicate || undefined}>
      {galleryPosters.map((poster, i) => (
        <PosterFigure key={`${duplicate ? 'dup' : 'real'}-${poster.slug}`} poster={poster} i={i} decorative={duplicate} />
      ))}
    </div>
  )
}

export function GalleryReel() {
  return (
    <div className="gallery__reel" id="gallery-reel" aria-label="Event posters">
      <div className="gallery__track" id="gallery-track">
        <PosterSet duplicate={false} />
        <PosterSet duplicate={true} />
      </div>
    </div>
  )
}
