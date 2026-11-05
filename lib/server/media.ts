import {env} from 'cloudflare:workers';
import {createHash} from 'node:crypto';
import {getAdminSession} from '@/lib/server/admin-auth';
import {getDb} from '@/db';
import {mediaAssets,mediaAssignments} from '@/db/schema';
import {eq,desc} from 'drizzle-orm';
import type {MediaAsset,PublicMedia} from '@/lib/media';

type Settings={CLOUDINARY_CLOUD_NAME?:string;CLOUDINARY_API_KEY?:string;CLOUDINARY_API_SECRET?:string;ADMIN_EMAILS?:string};
export function settings(){return env as unknown as Settings;}
export function cloudReady(){const s=settings();return Boolean(s.CLOUDINARY_CLOUD_NAME&&s.CLOUDINARY_API_KEY&&s.CLOUDINARY_API_SECRET);}
export const adminUser=getAdminSession;
export async function protect(request:Request){
 const user=await adminUser();if(!user)throw new HttpError(403,'Admin access required.');
 if(request.method!=='GET'&&request.headers.get('origin')!==new URL(request.url).origin)throw new HttpError(403,'Please submit from this website.');
 return user;
}
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export function failure(error:unknown){if(error instanceof HttpError)return Response.json({error:error.message},{status:error.status});console.error('Media operation failed');return Response.json({error:'Unable to save images right now. Please retry.'},{status:500});}
export const noCache={'Cache-Control':'no-store'};
export async function library(){return getDb().select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(300);}
export async function publicMedia():Promise<PublicMedia>{
 const records=await getDb().select({slot:mediaAssignments.slot,asset:mediaAssets}).from(mediaAssignments).innerJoin(mediaAssets,eq(mediaAssets.id,mediaAssignments.assetId));
 const result:PublicMedia={values:{},gallery:[]};
 for(const {slot,asset} of records){if(slot.startsWith('values.'))result.values[slot.slice(7)]={url:asset.url,alt:asset.alt};else if(slot.startsWith('gallery.')){const {createdBy,...safe}=asset;void createdBy;result.gallery.push(safe as MediaAsset);}}
 result.gallery.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));return result;
}
export async function uploadCloud(file:File,section:string){
 if(!cloudReady())throw new HttpError(503,'Cloudinary is not connected yet. Add its API secret in server settings.');
 const s=settings();const form=new FormData();form.set('file',file);form.set('public_id',`zunoon/${section}/${crypto.randomUUID()}`);form.set('overwrite','false');
 const r=await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(s.CLOUDINARY_CLOUD_NAME!)}/image/upload`,{method:'POST',headers:{Authorization:`Basic ${btoa(`${s.CLOUDINARY_API_KEY}:${s.CLOUDINARY_API_SECRET}`)}`},body:form,signal:AbortSignal.timeout(60000)});
 if(!r.ok)throw new HttpError(502,'Cloudinary upload failed. Check the account settings and try again.');
 const data=await r.json() as {secure_url:string;public_id:string;bytes:number;resource_type:string;format:string};
 if(data.resource_type!=='image'||!['jpg','jpeg','png','webp'].includes(data.format)||!data.secure_url?.startsWith(`https://res.cloudinary.com/${s.CLOUDINARY_CLOUD_NAME}/`))throw new HttpError(502,'Cloudinary returned an unsupported image.');
 return data;
}
export async function rollbackCloud(publicId:string){
 const s=settings(),timestamp=Math.floor(Date.now()/1000).toString();const signature=createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${s.CLOUDINARY_API_SECRET}`).digest('hex');
 await fetch(`https://api.cloudinary.com/v1_1/${s.CLOUDINARY_CLOUD_NAME}/image/destroy`,{method:'POST',body:new URLSearchParams({public_id:publicId,timestamp,signature,api_key:s.CLOUDINARY_API_KEY!}),signal:AbortSignal.timeout(10000)});
}
