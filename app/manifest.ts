import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zunoon Club | A Celebration of Life',
    short_name: 'Zunoon Club',
    description: 'Human 360° Growth & Life Experience Community in Surat. One Community • Six Clubs • Endless Experiences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9fa',
    theme_color: '#22252a',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
