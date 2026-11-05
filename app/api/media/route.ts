import {publicMedia,failure,noCache} from '@/lib/server/media';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await publicMedia(),{headers:noCache})}catch(e){return failure(e)}}
