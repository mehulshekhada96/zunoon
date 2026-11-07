import { Metadata } from 'next';
import { LegalPageView } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Contact Us | Zunoon Club',
  description: 'Get in touch with Zunoon Club, Surat. Contact numbers, WhatsApp support, and address.',
  alternates: {
    canonical: 'https://zunoonclub.com/contact'
  }
};

export default function ContactPage() {
  return <LegalPageView activeTab="contact" />;
}

