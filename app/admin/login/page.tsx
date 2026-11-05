import {redirect} from 'next/navigation';
import {adminUser} from '@/lib/server/media';
import LoginForm from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admin Sign in · Zunoon Club',
  robots: {index: false, follow: false}
};

export default async function LoginPage() {
  const user = await adminUser();
  if (user) {
    redirect('/admin/');
  }
  return <LoginForm />;
}
