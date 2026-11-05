import {redirect} from 'next/navigation';
import {adminUser} from '@/lib/server/media';
import MediaAdmin from './media-admin';
export const dynamic='force-dynamic';
export const metadata={title:'Image library · Admin',robots:{index:false,follow:false}};
export default async function Admin(){const user=await adminUser();if(!user)redirect('/admin/login/');return <MediaAdmin name={user.email}/>;}
