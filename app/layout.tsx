import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Zunoon Club',
 description: 'The new Zunoon Club website is coming soon.',
 robots: { index: false, follow: false },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
