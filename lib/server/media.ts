import {sameOrigin} from './request-origin';
import {createHash} from 'node:crypto';
import {getAdminSession} from '@/lib/server/admin-auth';
import {collections} from '@/lib/server/mongodb';
import type {MediaAsset,PublicMedia} from '@/lib/media';

type Settings={CLOUDINARY_CLOUD_NAME?:string;CLOUDINARY_API_KEY?:string;CLOUDINARY_API_SECRET?:string;ADMIN_EMAILS?:string};
export function settings(){return process.env as Settings;}
export function cloudReady(){const s=settings();return Boolean(s.CLOUDINARY_CLOUD_NAME&&s.CLOUDINARY_API_KEY&&s.CLOUDINARY_API_SECRET);}
export const adminUser=getAdminSession;
export async function protect(request:Request){
 const user=await adminUser();if(!user)throw new HttpError(403,'Admin access required.');
 if(request.method!=='GET'&&!sameOrigin(request))throw new HttpError(403,'Please submit from this website.');
 return user;
}
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export function failure(error:unknown){if(error instanceof HttpError)return Response.json({error:error.message},{status:error.status});console.error('Media operation failed');return Response.json({error:'Unable to save images right now. Please retry.'},{status:500});}
export const noCache={'Cache-Control':'no-store'};
export async function library(){return (await collections()).assets.find({},{projection:{_id:0}}).sort({createdAt:-1}).limit(300).toArray();}
export async function publicMedia():Promise<PublicMedia>{
 const db=await collections();const assignments=await db.assignments.find({}).toArray();const assets=await db.assets.find({id:{$in:assignments.map(a=>a.assetId)}},{projection:{_id:0}}).toArray();const records=assignments.flatMap(a=>{const asset=assets.find(i=>i.id===a.assetId);return asset?[{slot:a.slot,asset}]:[]});
 const result:PublicMedia={values:{},why:{},clubs:{},community:{},gallery:[],gallerySections:[]};
 for(const {slot,asset} of records){if(slot.startsWith('values.'))result.values[slot.slice(7)]={url:asset.url,alt:asset.alt};else if(slot.startsWith('why.'))result.why[slot.slice(4)]={url:asset.url,alt:asset.alt};else if(slot.startsWith('clubs.'))result.clubs[slot.slice(6)]={url:asset.url,alt:asset.alt};else if(slot.startsWith('community.'))result.community[slot.slice(10)]={url:asset.url,alt:asset.alt};else if(slot==='founder.profile'||slot==='founder')result.founder={url:asset.url,alt:asset.alt};else if(slot.startsWith('gallery.')){const {createdBy,...safe}=asset;void createdBy;result.gallery.push(safe as MediaAsset);}}
 const directGallery=await db.assets.find({section:'gallery'},{projection:{_id:0}}).toArray();
 for(const a of directGallery){if(!result.gallery.some(g=>g.id===a.id)){const {createdBy,...safe}=a;void createdBy;result.gallery.push(safe as MediaAsset);}}
 result.gallery.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const rawSecs=await db.gallerySections.find({}).toArray();
 const customSecs=rawSecs.map(s=>s.name);
 const defaultSecs=['Donation','Volunteering','Music','Outdoors','Celebration','Community'];
 const allSecs=Array.from(new Set([...defaultSecs,...customSecs,...result.gallery.map(g=>g.category||'').filter(Boolean)]));
 result.gallerySections=allSecs;
 return result;
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
