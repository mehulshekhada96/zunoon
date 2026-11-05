import {protect,failure,HttpError,noCache} from '@/lib/server/media';
import {isAssignmentSlot} from '@/lib/media';
import {getDb} from '@/db';
import {mediaAssignments,mediaAssets} from '@/db/schema';
import {eq} from 'drizzle-orm';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 await protect(request);const {slot,assetId}=await request.json() as {slot:unknown;assetId:unknown};if(!isAssignmentSlot(slot))throw new HttpError(400,'Choose a valid image placement.');
 const db=getDb();if(assetId===null){await db.delete(mediaAssignments).where(eq(mediaAssignments.slot,slot));return Response.json({success:true},{headers:noCache});}
 if(typeof assetId!=='string')throw new HttpError(400,'Choose an image.');
 const [asset]=await db.select().from(mediaAssets).where(eq(mediaAssets.id,assetId)).limit(1);if(!asset)throw new HttpError(404,'Image not found.');
 if(slot.startsWith('gallery.')&&slot!==`gallery.${assetId}`)throw new HttpError(400,'Invalid gallery placement.');
 const updatedAt=new Date().toISOString();await db.insert(mediaAssignments).values({slot,assetId,updatedAt}).onConflictDoUpdate({target:mediaAssignments.slot,set:{assetId,updatedAt}});
 return Response.json({success:true},{headers:noCache});
}catch(e){return failure(e)}}
