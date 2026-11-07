import {MongoClient} from 'mongodb';
import type {MediaAsset} from '@/lib/media';
import type {MemberReview} from '@/lib/testimonials';
import type {ContactSettings} from '@/lib/contact';
import type {HeroSlide} from '@/lib/hero-slides';
let connection:Promise<MongoClient>|undefined;
export async function database(){
 const uri=process.env.MONGODB_URI;if(!uri)throw new Error('MongoDB is not configured');
 connection??=new MongoClient(uri,{maxPoolSize:5,serverSelectionTimeoutMS:10000}).connect().catch(error=>{connection=undefined;throw error});
 return (await connection).db(process.env.MONGODB_DB||'zunoon_club');
}
export async function collections(){const db=await database();return {
 assets:db.collection<MediaAsset&{createdBy:string;category?:string}>('media_assets'),
 assignments:db.collection<{slot:string;assetId:string;updatedAt:string}>('media_assignments'),
 gallerySections:db.collection<{name:string;createdAt:string}>('gallery_sections'),
 sessions:db.collection<{tokenHash:string;email:string;expiresAt:Date}>('admin_sessions'),
 attempts:db.collection<{key:string;count:number;expiresAt:Date}>('login_attempts'),
 testimonials:db.collection<MemberReview>('testimonials'),
 contact:db.collection<ContactSettings&{_id:string}>('contact_settings'),
 heroSlides:db.collection<HeroSlide>('hero_slides')
};}
