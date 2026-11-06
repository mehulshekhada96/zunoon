import {redirect} from 'next/navigation';import {getAdminSession} from '@/lib/server/admin-auth';import PaymentsAdmin from './payments-admin';
export const dynamic='force-dynamic';export const metadata={title:'Membership payments · Admin',robots:{index:false,follow:false}};
export default async function Page(){if(!await getAdminSession())redirect('/admin/login/');return <PaymentsAdmin/>}
