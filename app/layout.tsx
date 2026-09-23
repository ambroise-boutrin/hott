import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { CookieConsent } from '../components/cookie-consent'
import { SmoothScroll } from '../components/smooth-scroll'
import { PageTransition } from '../components/page-transition'
import { TranslationInit } from '../lib/i18n/TranslationInit'
import { Providers } from './providers'
import './globals.css'



const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HOTT — L\'élégance absolue',
  description:
    'HOTT — Équipement équestre ultra-luxe. Redéfinissez le lien avec votre cheval grâce à un savoir-faire d\'exception.',
  generator: 'v0.app',
  openGraph: {
    title: 'HOTT — L\'élégance absolue',
    description: 'HOTT — Équipement équestre ultra-luxe.',
    url: 'https://hott.com',
    siteName: 'HOTT',
    images: [
      {
        url: '/hott-hero.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOTT — L\'élégance absolue',
    description: 'HOTT — Équipement équestre ultra-luxe.',
    images: ['/hott-hero.png'],
  },
  icons: {
    icon: [
      {
        url: '/hott-logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/hott-logo.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} bg-black`}
    >
      <body className="antialiased bg-black text-white font-sans">
        <SmoothScroll>
          <Providers>
            <TranslationInit />
            <PageTransition />
            {children}
            <CookieConsent />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  )
}
