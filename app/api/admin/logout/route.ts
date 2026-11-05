import {logout} from '@/lib/server/admin-auth';
import {failure} from '@/lib/server/media';
export async function POST(request:Request){try{return await logout(request)}catch(e){return failure(e)}}
