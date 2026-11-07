import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/server/admin-auth';
import { adminUser } from '@/lib/server/media';
import MediaAdmin from '../media-admin';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Membership payments · Admin',
  robots: { index: false, follow: false }
};

export default async function Page() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login/');
  const user = await adminUser();
  return <MediaAdmin name={user?.email || session.email} initialTab="payments" />;
}
