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
    id: 'default-1',
    url: '/images/group-joy.webp',
    alt: 'Zunoon members celebrating and sharing joyful moments together',
    title: 'A Celebration of Life',
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'default-2',
    url: '/images/celebration-clear.webp',
    alt: 'Community celebration and cultural gatherings at Zunoon Club',
    title: 'Vibrant Community Celebrations',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'default-3',
    url: '/images/outdoors.webp',
    alt: 'Outdoor adventures, sports and health activities',
    title: 'Health & Outdoor Experiences',
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'default-4',
    url: '/images/community-night.webp',
    alt: 'Community night gatherings and deep social connections',
    title: 'Deeper Friendships & Connections',
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'default-5',
    url: '/images/volunteering.webp',
    alt: 'Contributing to society and impactful volunteering experiences',
    title: 'Social Contribution & Volunteering',
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

