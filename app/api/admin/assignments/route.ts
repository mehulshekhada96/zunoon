import {protect,failure,HttpError,noCache} from '@/lib/server/media';
import {isAssignmentSlot} from '@/lib/media';
import {collections} from '@/lib/server/mongodb';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 await protect(request);const {slot,assetId}=await request.json() as {slot:unknown;assetId:unknown};if(!isAssignmentSlot(slot))throw new HttpError(400,'Choose a valid image placement.');
 const db=await collections();if(assetId===null){await db.assignments.deleteOne({slot});return Response.json({success:true},{headers:noCache});}
 if(typeof assetId!=='string')throw new HttpError(400,'Choose an image.');
 const asset=await db.assets.findOne({id:assetId});if(!asset)throw new HttpError(404,'Image not found.');
 if(slot.startsWith('gallery.')&&slot!==`gallery.${assetId}`)throw new HttpError(400,'Invalid gallery placement.');
 const updatedAt=new Date().toISOString();await db.assignments.updateOne({slot},{$set:{assetId,updatedAt}},{upsert:true});
 return Response.json({success:true},{headers:noCache});
}catch(e){return failure(e)}}
