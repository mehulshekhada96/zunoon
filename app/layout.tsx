import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Baloo_Bhai_2 } from 'next/font/google';
import './globals.css';

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
  title: 'Zunoon Club | A Celebration of Life · Human 360° Community',
  description: 'ઝુનૂન ક્લબ — એક કમ્યુનિટી, છ ક્લબ, અનંત અનુભવો. હેલ્થ, સ્પોર્ટ્સ, સોશિયલ, હોબી, ગ્રોથ અને સેલિબ્રેશન. સુરત, ગુજરાત. વાર્ષિક મેમ્બરશિપ ₹2,100/-.',
  keywords: ['Zunoon Club', 'ઝુનૂન ક્લબ', 'Surat Community', 'Life Experience Community', 'Health Club Surat', 'Sports Club Surat', 'Social Club Surat', 'Human 360 Growth'],
  authors: [{ name: 'Jainit Finaviya', url: 'https://wa.me/919712112110' }],
  creator: 'Zunoon Club',
  openGraph: {
    title: 'Zunoon Club | A Celebration of Life',
    description: 'Human 360° Growth & Life Experience Community in Surat. One Community • Six Clubs • Endless Experiences.',
    url: 'https://zunoonclub.com',
    siteName: 'Zunoon Club',
    locale: 'gu_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zunoon Club | A Celebration of Life',
    description: 'One Community • Six Clubs • Endless Experiences. Surat, Gujarat.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="gu" className={`${sans.variable} ${gujarati.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
