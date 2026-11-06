import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Baloo_Bhai_2 } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@/components/analytics';
import { StructuredData } from '@/components/structured-data';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const gujarati = Baloo_Bhai_2({
  subsets: ['gujarati', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-gujarati',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#26392d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zunoonclub.com'),
  title: {
    default: 'Zunoon Club | A Celebration of Life · Human 360° Community',
    template: '%s | Zunoon Club',
  },
  description: 'ઝુનૂન ક્લબ — એક કમ્યુનિટી, છ ક્લબ, અનંત અનુભવો. હેલ્થ, સ્પોર્ટ્સ, સોશિયલ, હોબી, ગ્રોથ અને સેલિબ્રેશન. સુરત, ગુજરાત. વાર્ષિક મેમ્બરશિપ ₹2,100/-.',
  keywords: [
    'Zunoon Club',
    'ઝુનૂન ક્લબ',
    'Surat Community',
    'Life Experience Community',
    'Health Club Surat',
    'Sports Club Surat',
    'Social Club Surat',
    'Growth Club Surat',
    'Hobby Club Surat',
    'Celebration Club Surat',
    'Human 360 Growth',
    'Jainit Finaviya',
    'Surat Club Membership',
  ],
  authors: [{ name: 'Jainit Finaviya', url: 'https://wa.me/919712112110' }],
  creator: 'Zunoon Club',
  publisher: 'Zunoon Club',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://zunoonclub.com',
    languages: {
      'gu-IN': 'https://zunoonclub.com/?lang=gu',
      'en-IN': 'https://zunoonclub.com/?lang=en',
      'hi-IN': 'https://zunoonclub.com/?lang=hi',
      'x-default': 'https://zunoonclub.com',
    },
  },
  openGraph: {
    title: 'Zunoon Club | A Celebration of Life',
    description: 'Human 360° Growth & Life Experience Community in Surat. One Community • Six Clubs • Endless Experiences.',
    url: 'https://zunoonclub.com',
    siteName: 'Zunoon Club',
    locale: 'gu_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Zunoon Club Community - A Celebration of Life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zunoon Club | A Celebration of Life',
    description: 'One Community • Six Clubs • Endless Experiences. Surat, Gujarat.',
    images: ['/images/hero.webp'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={`${sans.variable} ${gujarati.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <StructuredData />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
