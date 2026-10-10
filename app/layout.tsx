import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Zunoon Business Club | Bonding Becomes Business',
 description: 'Connect, learn and grow with Zunoon Business Club. Explore our ventures, Surat groups, business meetups and a community built on trust.',
 robots: { index: false, follow: false },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
