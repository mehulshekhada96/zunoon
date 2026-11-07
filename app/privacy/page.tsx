import { Metadata } from 'next';
import { LegalPageView } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zunoon Club',
  description: 'Learn how Zunoon Club collects, protects, and handles personal data and membership payments securely.',
  alternates: {
    canonical: 'https://zunoonclub.com/privacy'
  }
};

export default function PrivacyPage() {
  return <LegalPageView activeTab="privacy" />;
}

