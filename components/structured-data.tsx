import { faqs } from '@/lib/details';
import { BRAND_LOGO_URL, BRAND_HERO_OG_URL } from '@/lib/brand';

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: 'Zunoon Club',
    alternateName: ['ઝુનૂન ક્લબ', 'Zunoon Life Experience Community'],
    url: 'https://zunoonclub.com',
    logo: BRAND_LOGO_URL,
    image: BRAND_HERO_OG_URL,
    description: 'Human 360° Growth & Life Experience Community in Surat, Gujarat. One Community • Six Clubs • Endless Experiences. Health, Sports, Social, Growth, Hobby & Celebration.',
    founder: {
      '@type': 'Person',
      name: 'Jainit Finaviya',
      jobTitle: 'Founder',
    },
    foundingDate: '2006',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    telephone: '+919712112110',
    priceRange: '₹2,100 / year',
    knowsAbout: [
      'Health & Fitness',
      'Sports & Tournaments',
      'Community & Social Volunteering',
      'Personal & Professional Growth',
      'Hobbies & Arts',
      'Festivals & Celebrations',
    ],
    sameAs: [
      'https://www.instagram.com',
      'https://wa.me/919712112110',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q[1], // Gujarati question
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a[1], // Gujarati answer
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://zunoonclub.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Six Clubs',
        item: 'https://zunoonclub.com/#clubs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'About Zunoon',
        item: 'https://zunoonclub.com/#about',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Membership',
        item: 'https://zunoonclub.com/#membership',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

