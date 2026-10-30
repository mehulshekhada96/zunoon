import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Zunoon Club | A Celebration of Life',
 description: 'One community. Six clubs. Explore health, sports, social contribution, growth, hobbies and celebrations with Zunoon Club. Annual membership ₹2,100.',
 robots: { index: false, follow: false },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="gu"><body>{children}</body></html>; }
