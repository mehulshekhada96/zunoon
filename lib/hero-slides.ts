export type HeroSlide = {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  order: number;
  publicId?: string;
  createdAt: string;
};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1794031813/zunoon/hero/b688e100-2582-4668-bb4b-f0c9832124c4.png',
    alt: 'AI-generated illustration of Indian adults sharing conversation in a courtyard',
    title: 'Find Your People',
    order: 0,
    createdAt: '2026-11-07T06:10:14.477Z'
  },
  {
    id: 'hero-2',
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1794031815/zunoon/hero/04649440-c032-4c03-873c-09a19ea6572d.png',
    alt: 'AI-generated illustration of a diverse adult walking group enjoying morning fitness',
    title: 'Move Together. Grow Together.',
    order: 1,
    createdAt: '2026-11-07T06:10:15.609Z'
  },
  {
    id: 'hero-3',
    url: 'https://res.cloudinary.com/snzzqy9i/image/upload/v1794031815/zunoon/hero/692df51e-6f58-4112-855f-ccf86f851ca5.png',
    alt: 'AI-generated illustration of community volunteers preparing grocery donation kits',
    title: 'Together, We Make a Difference',
    order: 2,
    createdAt: '2026-11-07T06:10:16.485Z'
  }
];

