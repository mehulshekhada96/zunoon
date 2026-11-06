import {collections} from '@/lib/server/mongodb';
import {protect, HttpError} from '@/lib/server/media';
import {defaultContactSettings, type ContactSettings} from '@/lib/contact';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await protect(request);
    const col = (await collections()).contact;
    const doc = await col.findOne({_id: 'primary'});
    if (doc) {
      const {_id, ...data} = doc;
      return Response.json(data, {headers: {'Cache-Control': 'no-store'}});
    }
    return Response.json(defaultContactSettings, {headers: {'Cache-Control': 'no-store'}});
  } catch (e) {
    if (e instanceof HttpError) {
      return Response.json({error: e.message}, {status: e.status});
    }
    return Response.json({error: 'Failed to fetch contact settings'}, {status: 500});
  }
}

export async function PUT(request: Request) {
  try {
    await protect(request);
    const body = await request.json() as Partial<ContactSettings>;
    if (!body || typeof body !== 'object') {
      throw new HttpError(400, 'Invalid request body');
    }

    const rawWa = typeof body.whatsappNumber === 'string' ? body.whatsappNumber.replace(/\D/g, '') : '';
    if (rawWa.length < 10) {
      throw new HttpError(400, 'WhatsApp number must be at least 10 digits (including country code, e.g. 919712112110).');
    }

    const displayPhone = typeof body.displayPhone === 'string' && body.displayPhone.trim()
      ? body.displayPhone.trim().slice(0, 50)
      : defaultContactSettings.displayPhone;

    const telNumber = typeof body.telNumber === 'string' && body.telNumber.trim()
      ? body.telNumber.trim().slice(0, 30)
      : defaultContactSettings.telNumber;

    const instagramHandle = typeof body.instagramHandle === 'string'
      ? body.instagramHandle.trim().slice(0, 60)
      : defaultContactSettings.instagramHandle;

    const instagramUrl = typeof body.instagramUrl === 'string'
      ? body.instagramUrl.trim().slice(0, 200)
      : defaultContactSettings.instagramUrl;

    const addressEn = typeof body.addressEn === 'string' && body.addressEn.trim()
      ? body.addressEn.trim().slice(0, 200)
      : defaultContactSettings.addressEn;

    const addressGu = typeof body.addressGu === 'string' && body.addressGu.trim()
      ? body.addressGu.trim().slice(0, 200)
      : defaultContactSettings.addressGu;

    const addressHi = typeof body.addressHi === 'string' && body.addressHi.trim()
      ? body.addressHi.trim().slice(0, 200)
      : defaultContactSettings.addressHi;

    const updated: ContactSettings = {
      whatsappNumber: rawWa,
      displayPhone,
      telNumber,
      instagramHandle,
      instagramUrl,
      addressEn,
      addressGu,
      addressHi,
      updatedAt: new Date().toISOString()
    };

    const col = (await collections()).contact;
    await col.updateOne({_id: 'primary'}, {$set: updated}, {upsert: true});

    return Response.json({success: true, contact: updated}, {headers: {'Cache-Control': 'no-store'}});
  } catch (e) {
    if (e instanceof HttpError) {
      return Response.json({error: e.message}, {status: e.status});
    }
    return Response.json({error: 'Failed to update contact settings'}, {status: 500});
  }
}

