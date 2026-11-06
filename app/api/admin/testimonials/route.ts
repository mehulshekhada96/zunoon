import {protect,failure,HttpError,noCache} from '@/lib/server/media';
import {collections} from '@/lib/server/mongodb';
import {defaultMemberReviews, MemberReview} from '@/lib/testimonials';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await protect(request);
    const db = await collections();
    let items = await db.testimonials.find({}).sort({order: 1, createdAt: -1}).toArray();
    
    if (items.length === 0) {
      await db.testimonials.insertMany(defaultMemberReviews);
      items = await db.testimonials.find({}).sort({order: 1, createdAt: -1}).toArray();
    }

    const clean = items.map(({_id, ...rest}) => rest as MemberReview);
    return Response.json({testimonials: clean}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

export async function POST(request: Request) {
  try {
    await protect(request);
    const body = await request.json() as Partial<MemberReview>;
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    const quote = typeof body.quote === 'string' ? body.quote.trim() : '';
    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Member Experience';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const role = typeof body.role === 'string' ? body.role.trim() : '';
    const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5 ? body.rating : 5;

    if (!author) throw new HttpError(400, 'Member name is required.');
    if (!quote) throw new HttpError(400, 'Member review / experience text is required.');

    const newRecord: MemberReview = {
      id: crypto.randomUUID(),
      author,
      role: role || undefined,
      category,
      title: title || undefined,
      quote,
      rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await collections();
    await db.testimonials.insertOne(newRecord);
    return Response.json({success: true, testimonial: newRecord}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

export async function PUT(request: Request) {
  try {
    await protect(request);
    const body = await request.json() as Partial<MemberReview> & {id: string};
    if (!body.id || typeof body.id !== 'string') throw new HttpError(400, 'Testimonial ID is required.');

    const author = typeof body.author === 'string' ? body.author.trim() : '';
    const quote = typeof body.quote === 'string' ? body.quote.trim() : '';
    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Member Experience';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const role = typeof body.role === 'string' ? body.role.trim() : '';
    const rating = typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5 ? body.rating : 5;

    if (!author) throw new HttpError(400, 'Member name is required.');
    if (!quote) throw new HttpError(400, 'Member review text is required.');

    const db = await collections();
    const updateDoc = {
      author,
      role: role || undefined,
      category,
      title: title || undefined,
      quote,
      rating,
      updatedAt: new Date().toISOString(),
    };

    const res = await db.testimonials.updateOne({id: body.id}, {$set: updateDoc});
    if (res.matchedCount === 0) throw new HttpError(404, 'Testimonial not found.');

    return Response.json({success: true, updated: updateDoc}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

export async function DELETE(request: Request) {
  try {
    await protect(request);
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new HttpError(400, 'Testimonial ID is required.');

    const db = await collections();
    const res = await db.testimonials.deleteOne({id});
    if (res.deletedCount === 0) throw new HttpError(404, 'Testimonial not found.');

    return Response.json({success: true, deletedId: id}, {headers: noCache});
  } catch (e) {
    return failure(e);
  }
}

