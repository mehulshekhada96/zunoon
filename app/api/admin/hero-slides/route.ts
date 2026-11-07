import { protect, failure, HttpError, noCache, uploadCloud, rollbackCloud } from '@/lib/server/media';
import { isImageBytes } from '@/lib/media';
import { collections } from '@/lib/server/mongodb';
import { defaultHeroSlides, type HeroSlide } from '@/lib/hero-slides';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    await protect(request);
    const db = await collections();
    const slides = await db.heroSlides.find({}, { projection: { _id: 0 } }).sort({ order: 1, createdAt: -1 }).toArray();
    return Response.json({ slides }, { headers: noCache });
  } catch (e) {
    return failure(e);
  }
}

export async function POST(request: Request) {
  try {
    await protect(request);
    if (Number(request.headers.get('content-length') || 0) > 4.5 * 1024 * 1024) {
      throw new HttpError(413, 'Maximum upload size is 4.5 MB.');
    }

    const data = await request.formData();
    const file = data.get('file');
    const title = String(data.get('title') || '').trim();
    const alt = String(data.get('alt') || title || 'Zunoon Club Carousel Slide').trim();

    if (!(file instanceof File) || !file.size || file.size > 4.5 * 1024 * 1024) {
      throw new HttpError(400, 'Please select a JPG, PNG or WebP image up to 4.5 MB.');
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !isImageBytes(new Uint8Array(await file.slice(0, 16).arrayBuffer()))) {
      throw new HttpError(400, 'Only JPG, PNG and WebP images are supported.');
    }

    const cloud = await uploadCloud(file, 'hero');
    const db = await collections();
    const currentCount = await db.heroSlides.countDocuments();

    const slide: HeroSlide = {
      id: crypto.randomUUID(),
      url: cloud.secure_url,
      alt,
      title: title || undefined,
      order: currentCount,
      publicId: cloud.public_id,
      createdAt: new Date().toISOString()
    };

    try {
      await db.heroSlides.insertOne({ ...slide });
    } catch (dbErr) {
      if (cloud.public_id) {
        await rollbackCloud(cloud.public_id).catch(() => {});
      }
      throw dbErr;
    }

    return Response.json({ slide }, { status: 201, headers: noCache });
  } catch (e) {
    return failure(e);
  }
}

export async function DELETE(request: Request) {
  try {
    await protect(request);
    const { id } = await request.json() as { id?: unknown };
    if (typeof id !== 'string' || !id) {
      throw new HttpError(400, 'Slide ID is required.');
    }

    const db = await collections();
    const slide = await db.heroSlides.findOne({ id });
    if (!slide) {
      throw new HttpError(404, 'Slide not found.');
    }

    if (slide.publicId) {
      await rollbackCloud(slide.publicId).catch(err => console.error('Cloudinary delete error:', err));
    }

    await db.heroSlides.deleteOne({ id });
    return Response.json({ success: true }, { headers: noCache });
  } catch (e) {
    return failure(e);
  }
}

export async function PUT(request: Request) {
  try {
    await protect(request);
    const { slides } = await request.json() as { slides?: { id: string; order: number }[] };
    if (!Array.isArray(slides)) {
      throw new HttpError(400, 'Invalid slides payload.');
    }

    const db = await collections();
    for (const item of slides) {
      if (item && typeof item.id === 'string' && typeof item.order === 'number') {
        await db.heroSlides.updateOne({ id: item.id }, { $set: { order: item.order } });
      }
    }

    return Response.json({ success: true }, { headers: noCache });
  } catch (e) {
    return failure(e);
  }
}

