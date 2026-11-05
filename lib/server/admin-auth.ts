import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {eq,gt,and,sql} from 'drizzle-orm';
import {getDb} from '@/db';
import {adminSessions,loginAttempts} from '@/db/schema';
const cookie='zunoon_admin';
const config=()=>env as unknown as {ADMIN_EMAILS?:string;ADMIN_PASSWORD?:string};
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function getAdminSession(){
 const token=(await cookies()).get(cookie)?.value;if(!token)return null;
 const [session]=await getDb().select().from(adminSessions).where(and(eq(adminSessions.tokenHash,hash(token)),gt(adminSessions.expiresAt,Date.now()))).limit(1);
 if(!session||!(config().ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).includes(session.email))return null;
 return {email:session.email,userId:session.email};
}
export async function login(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Please sign in from this website.'},{status:403});
 const settings=config();if(!settings.ADMIN_PASSWORD||settings.ADMIN_PASSWORD.length<12)return Response.json({error:'Admin login is awaiting secure configuration.'},{status:503});
 let input:{email?:unknown;password?:unknown};try{input=await request.json() as typeof input;if(!input)throw new Error()}catch{return Response.json({error:'Invalid login request.'},{status:400})}
 const email=typeof input.email==='string'?input.email.trim().toLowerCase().slice(0,254):'';
 const password=typeof input.password==='string'?input.password:'';
 if(password.length>1024)return Response.json({error:'Invalid email or password.'},{status:401});
 const window=Math.floor(Date.now()/900000),key=hash(`${email}:${window}`);
 const [attempt]=await getDb().insert(loginAttempts).values({key,count:1,expiresAt:(window+1)*900000}).onConflictDoUpdate({target:loginAttempts.key,set:{count:sql`${loginAttempts.count}+1`}}).returning();
 if(attempt.count>10)return Response.json({error:'Too many attempts. Please wait 15 minutes.'},{status:429});
 const valid=timingSafeEqual(Buffer.from(hash(password),'hex'),Buffer.from(hash(settings.ADMIN_PASSWORD),'hex'));
 if(!valid||!(settings.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).includes(email))return Response.json({error:'Invalid email or password.'},{status:401});
 const token=randomBytes(32).toString('hex');await getDb().insert(adminSessions).values({tokenHash:hash(token),email,expiresAt:Date.now()+8*3600000});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':`${cookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
}
export async function logout(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403});
 const token=(await cookies()).get(cookie)?.value;if(token)await getDb().delete(adminSessions).where(eq(adminSessions.tokenHash,hash(token)));
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':`${cookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${new URL(request.url).protocol==='https:'?'; Secure':''}`}});
}
