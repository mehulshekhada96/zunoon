import {protect,library,cloudReady,failure,HttpError,noCache,uploadCloud,rollbackCloud} from '@/lib/server/media';
import {mediaSections,isImageBytes} from '@/lib/media';
import {collections} from '@/lib/server/mongodb';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(request:Request){try{await protect(request);const assets=await library();const assignments=await (await collections()).assignments.find({},{projection:{_id:0}}).toArray();return Response.json({assets:assets.map(({createdBy,...a})=>a),assignments,configured:cloudReady()},{headers:noCache});}catch(e){return failure(e)}}
export async function POST(request:Request){try{
 const user=await protect(request);if(Number(request.headers.get('content-length')||0)>4.4*1024*1024)throw new HttpError(413,'Maximum upload size is 4 MB.');
 const data=await request.formData(),file=data.get('file'),section=String(data.get('section')||'');
 const category=String(data.get('category')||'Community').trim();
 let title=String(data.get('title')||'').trim();
 let alt=String(data.get('alt')||'').trim();
 if(section==='gallery'){
  title=title||category||'Life at Zunoon';
  alt=alt||title||'Life at Zunoon photo';
 }
 if(!mediaSections.some(s=>s===section)||!title||title.length>100||!alt||alt.length>240)throw new HttpError(400,'Choose a section and enter a title and image description.');
 if(!(file instanceof File)||!file.size||file.size>4*1024*1024)throw new HttpError(400,'Choose a JPG, PNG or WebP image up to 4 MB.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||!isImageBytes(new Uint8Array(await file.slice(0,16).arrayBuffer())))throw new HttpError(400,'Only JPG, PNG and WebP images are supported.');
 const cloud=await uploadCloud(file,section);
 const asset={id:crypto.randomUUID(),section,category,title,alt,url:cloud.secure_url,publicId:cloud.public_id,bytes:cloud.bytes,createdAt:new Date().toISOString(),createdBy:user.userId};
 try{await (await collections()).assets.insertOne({...asset});}catch(error){await rollbackCloud(cloud.public_id).catch(()=>{});throw error;}
 const {createdBy,...safe}=asset;void createdBy;return Response.json({asset:safe},{status:201,headers:noCache});
}catch(e){return failure(e)}}
export async function DELETE(request:Request){try{
 await protect(request);
 const {id}=await request.json() as {id?:unknown};
 if(typeof id!=='string'||!id)throw new HttpError(400,'Image ID is required.');
 const db=await collections();
 const asset=await db.assets.findOne({id});
 if(!asset)throw new HttpError(404,'Image not found.');
 if(asset.publicId){
  await rollbackCloud(asset.publicId).catch(err=>console.error('Cloudinary delete error:',err));
 }
 await db.assets.deleteOne({id});
 await db.assignments.deleteMany({assetId:id});
 return Response.json({success:true},{headers:noCache});
}catch(e){return failure(e)}}
