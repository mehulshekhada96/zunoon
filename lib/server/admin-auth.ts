import {sameOrigin} from './request-origin';
import {cookies} from 'next/headers';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {collections} from '@/lib/server/mongodb';
const cookie='zunoon_admin';
const SESSION_SECONDS=86400; // 24 hours
const SESSION_MS=SESSION_SECONDS*1000;
const config=()=>process.env as {ADMIN_EMAILS?:string;ADMIN_PASSWORD?:string};
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function getAdminSession(){
 const token=(await cookies()).get(cookie)?.value;if(!token)return null;
 const session=await (await collections()).sessions.findOne({tokenHash:hash(token),expiresAt:{$gt:new Date()}});
 if(!session||!(config().ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).includes(session.email))return null;
 return {email:session.email,userId:session.email};
}
export async function login(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Please sign in from this website.'},{status:403});
 const settings=config();if(!settings.ADMIN_PASSWORD||settings.ADMIN_PASSWORD.length<12)return Response.json({error:'Admin login is awaiting secure configuration.'},{status:503});
 let input:{email?:unknown;password?:unknown};try{input=await request.json() as typeof input;if(!input)throw new Error()}catch{return Response.json({error:'Invalid login request.'},{status:400})}
 const email=typeof input.email==='string'?input.email.trim().toLowerCase().slice(0,254):'';
 const password=typeof input.password==='string'?input.password:'';
 if(password.length>1024)return Response.json({error:'Invalid email or password.'},{status:401});
 const window=Math.floor(Date.now()/900000),key=hash(`${email}:${window}`);
 const attempt=await (await collections()).attempts.findOneAndUpdate({key},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((window+1)*900000)}},{upsert:true,returnDocument:'after'});
 if(!attempt||attempt.count>10)return Response.json({error:'Too many attempts. Please wait 15 minutes.'},{status:429});
 const valid=timingSafeEqual(Buffer.from(hash(password),'hex'),Buffer.from(hash(settings.ADMIN_PASSWORD),'hex'));
 if(!valid||!(settings.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).includes(email))return Response.json({error:'Invalid email or password.'},{status:401});
 const token=randomBytes(32).toString('hex');
 const expiresAt=new Date(Date.now()+SESSION_MS);
 await (await collections()).sessions.insertOne({tokenHash:hash(token),email,expiresAt});
 const isHttps=new URL(request.url).protocol==='https:';
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':`${cookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}; Expires=${expiresAt.toUTCString()}${isHttps?'; Secure':''}`}});
}
export async function logout(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Invalid origin.'},{status:403});
 const token=(await cookies()).get(cookie)?.value;if(token)await (await collections()).sessions.deleteOne({tokenHash:hash(token)});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':`${cookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
}
