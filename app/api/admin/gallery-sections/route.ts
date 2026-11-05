import {protect,failure,HttpError,noCache} from '@/lib/server/media';
import {collections} from '@/lib/server/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await protect(request);
    const db = await collections();
    const rawSecs = await db.gallerySections.find({}).toArray();
    const customSecs = rawSecs.map(s => s.name);
    const defaultSecs = ['Donation', 'Volunteering', 'Music', 'Outdoors', 'Celebration', 'Community'];
    const assets = await db.assets.find({section: 'gallery'}).toArray();
    const assetCategories = assets.map(a => a.category || '').filter(Boolean);
    const all = Array.from(new Set([...defaultSecs, ...customSecs, ...assetCategories]));
    return Response.json({sections: all, custom: customSecs}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

export async function POST(request: Request) {
  try {
    await protect(request);
    const {name} = (await request.json()) as {name?: unknown};
    if (typeof name !== 'string' || !name.trim()) throw new HttpError(400, 'Section name is required.');
    const trimmed = name.trim();
    if (trimmed.length > 50) throw new HttpError(400, 'Section name must be under 50 characters.');

    const db = await collections();
    await db.gallerySections.updateOne(
      {name: trimmed},
      {$set: {name: trimmed, createdAt: new Date().toISOString()}},
      {upsert: true}
    );
    return Response.json({success: true, name: trimmed}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

export async function DELETE(request: Request) {
  try {
    await protect(request);
    const {name} = (await request.json()) as {name?: unknown};
    if (typeof name !== 'string' || !name.trim()) throw new HttpError(400, 'Section name is required.');
    const trimmed = name.trim();

    const db = await collections();
    await db.gallerySections.deleteOne({name: trimmed});
    return Response.json({success: true}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

