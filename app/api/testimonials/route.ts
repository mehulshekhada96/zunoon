import {NextResponse} from 'next/server';
import {collections} from '@/lib/server/mongodb';
import {defaultMemberReviews, MemberReview} from '@/lib/testimonials';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const {testimonials} = await collections();
    const items = await testimonials.find({}).sort({order: 1, createdAt: -1}).toArray();
    
    // If empty in MongoDB, seed initial reviews
    if (items.length === 0) {
      try {
        await testimonials.insertMany(defaultMemberReviews);
        return NextResponse.json({testimonials: defaultMemberReviews});
      } catch {
        return NextResponse.json({testimonials: defaultMemberReviews});
      }
    }

    const clean = items.map(({_id, ...rest}) => rest as MemberReview);
    return NextResponse.json({testimonials: clean});
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({testimonials: defaultMemberReviews});
  }
}

