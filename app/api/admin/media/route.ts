import {protect,library,cloudReady,failure,HttpError,noCache,uploadCloud,rollbackCloud} from '@/lib/server/media';
import {mediaSections,isImageBytes} from '@/lib/media';
import {getDb} from '@/db';
import {mediaAssets,mediaAssignments} from '@/db/schema';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{await protect(request);const assets=await library();const assignments=await getDb().select().from(mediaAssignments);return Response.json({assets:assets.map(({createdBy,...a})=>a),assignments,configured:cloudReady()},{headers:noCache});}catch(e){return failure(e)}}
export async function POST(request:Request){try{
 const user=await protect(request);if(Number(request.headers.get('content-length')||0)>9*1024*1024)throw new HttpError(413,'Maximum upload size is 8 MB.');
 const data=await request.formData(),file=data.get('file'),section=String(data.get('section')||''),title=String(data.get('title')||'').trim(),alt=String(data.get('alt')||'').trim();
 if(!mediaSections.some(s=>s===section)||!title||title.length>100||!alt||alt.length>240)throw new HttpError(400,'Choose a section and enter a title and image description.');
 if(!(file instanceof File)||!file.size||file.size>8*1024*1024)throw new HttpError(400,'Choose a JPG, PNG or WebP image up to 8 MB.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||!isImageBytes(new Uint8Array(await file.slice(0,16).arrayBuffer())))throw new HttpError(400,'Only JPG, PNG and WebP images are supported.');
 const cloud=await uploadCloud(file,section);
 const asset={id:crypto.randomUUID(),section,title,alt,url:cloud.secure_url,publicId:cloud.public_id,bytes:cloud.bytes,createdAt:new Date().toISOString(),createdBy:user.userId};
 try{await getDb().insert(mediaAssets).values(asset);}catch(error){await rollbackCloud(cloud.public_id).catch(()=>{});throw error;}
 const {createdBy,...safe}=asset;void createdBy;return Response.json({asset:safe},{status:201,headers:noCache});
}catch(e){return failure(e)}}
