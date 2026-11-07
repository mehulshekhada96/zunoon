import { Metadata } from 'next';
import { LegalPageView } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Zunoon Club',
  description: 'Official membership terms, community code of conduct, and guidelines for Zunoon Club, Surat.',
  alternates: {
    canonical: 'https://zunoonclub.com/terms'
  }
};

export default function TermsPage() {
  return <LegalPageView activeTab="terms" />;
}

