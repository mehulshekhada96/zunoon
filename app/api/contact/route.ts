import {collections} from '@/lib/server/mongodb';
import {defaultContactSettings} from '@/lib/contact';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const col = (await collections()).contact;
    const doc = await col.findOne({_id: 'primary'});
    if (doc) {
      const {_id, ...data} = doc;
      return Response.json(data, {
        headers: {'Cache-Control': 'no-store'}
      });
    }
  } catch (e) {
    console.error('Error fetching contact settings:', e);
  }
  return Response.json(defaultContactSettings, {
    headers: {'Cache-Control': 'no-store'}
  });
}

