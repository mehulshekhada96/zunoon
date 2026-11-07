import { Metadata } from 'next';
import { LegalPageView } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Zunoon Club',
  description: 'Understand cancellation terms, duplicate payment resolution, and refund procedures for Zunoon Club.',
  alternates: {
    canonical: 'https://zunoonclub.com/refund'
  }
};

export default function RefundPage() {
  return <LegalPageView activeTab="refund" />;
}

