import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/sections.css'

import type { Metadata } from 'next'
import { PreloaderProvider } from '@/components/chrome/PreloaderContext'
import { PreloaderOverlay } from '@/components/chrome/PreloaderOverlay'
import { BootController } from '@/components/chrome/BootController'
import { Backdrop } from '@/components/chrome/Backdrop'
import { CircuitCursor } from '@/components/chrome/CircuitCursor'
import { SectionAccentSync } from '@/components/chrome/SectionAccentSync'
import { EasterEgg } from '@/components/chrome/EasterEgg'
import { Navbar } from '@/components/chrome/Navbar'
import { NavbarChrome } from '@/components/chrome/NavbarChrome'
import { MobileMenu } from '@/components/chrome/MobileMenu'
import { Ticker } from '@/components/chrome/Ticker'
import { Footer } from '@/components/chrome/Footer'

export const metadata: Metadata = {
  title: 'IEEE MACE SB',
  description:
    'IEEE Student Branch of Mar Athanasius College of Engineering, Kothamangalam. Bridging the gap between engineering theory and professional impact since 1988.',
  icons: { icon: '/logo.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PreloaderProvider>
          <PreloaderOverlay />
          <Backdrop />
          <CircuitCursor />
          <SectionAccentSync />
          <EasterEgg />
          <Navbar />
          <MobileMenu />
          <BootController />
          <NavbarChrome />
          <div id="content">
            {children}
            <Ticker />
            <Footer />
          </div>
        </PreloaderProvider>
      </body>
    </html>
  )
}
