import { collections } from '@/lib/server/mongodb';
import { defaultHeroSlides, type HeroSlide } from '@/lib/hero-slides';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await collections();
    const slides = await db.heroSlides.find({}, { projection: { _id: 0 } }).sort({ order: 1, createdAt: -1 }).toArray();
    if (!slides || slides.length === 0) {
      return Response.json({ slides: defaultHeroSlides });
    }
    return Response.json({ slides });
  } catch (err) {
    console.error('Failed to load hero slides from DB:', err);
    return Response.json({ slides: defaultHeroSlides });
  }
}

