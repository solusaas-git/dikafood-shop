import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

// Disable static generation for the entire app during development
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'DikaFood - Authentic Moroccan Food Products',
  description: 'Discover authentic Moroccan food products from DikaFood. Premium quality olive oil, traditional spices, and gourmet ingredients.',
  keywords: 'moroccan food, olive oil, spices, authentic, premium, traditional',
  authors: [{ name: 'DikaFood Team' }],
  creator: 'DikaFood',
  publisher: 'DikaFood',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dikafood.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'ar-MA': '/ar',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'DikaFood - Authentic Moroccan Food Products',
    description: 'Discover authentic Moroccan food products from DikaFood. Premium quality olive oil, traditional spices, and gourmet ingredients.',
    url: 'https://dikafood.com',
    siteName: 'DikaFood',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DikaFood - Authentic Moroccan Food Products',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DikaFood - Authentic Moroccan Food Products',
    description: 'Discover authentic Moroccan food products from DikaFood. Premium quality olive oil, traditional spices, and gourmet ingredients.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <meta name="theme-color" content="#2D5016" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
