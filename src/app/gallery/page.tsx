import type { Metadata } from 'next'
import { SectionAnimations } from '@/components/animation/SectionAnimations'
import { GalleryReel } from '@/components/gallery/GalleryReel'
import { GalleryMarquee } from '@/components/gallery/GalleryMarquee'

export const metadata: Metadata = {
  description: 'A continuous reel of posters from our hackathons, workshops, conclaves, and outreach.',
}

export default function GalleryPage() {
  return (
    <SectionAnimations>
      <section className="gallery section section--full" id="gallery" aria-labelledby="gallery-heading">
        <div className="container">
          <header className="section__head">
            <p className="eyebrow">Visual Highlights</p>
            <h2 className="section__title" id="gallery-heading">
              Event <span className="outline">Gallery</span>
            </h2>
            <p className="section__subtext">
              A continuous reel of posters from our hackathons, workshops, conclaves, and outreach.
            </p>
          </header>
        </div>
        <GalleryReel />
        <GalleryMarquee />
      </section>
    </SectionAnimations>
  )
}
