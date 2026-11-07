import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, RefreshCw, Truck, Mail, Phone, MapPin } from 'lucide-react';
import '../app/legal.css';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'contact';

interface LegalPageProps {
  activeTab: LegalTab;
}

export function LegalPageView({ activeTab }: LegalPageProps) {
  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, href: '/privacy' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, href: '/terms' },
    { id: 'refund', label: 'Cancellation & Refund', icon: RefreshCw, href: '/refund' },
    { id: 'contact', label: 'Contact Us', icon: Mail, href: '/contact' }
  ];

  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <header className="legal-header">
          <Link href="/" className="legal-brand">
            <span className="legal-brand-logo">
              Zunoon <span>Club</span>
            </span>
          </Link>
          <Link href="/" className="legal-back-link">
            <ArrowLeft size={16} />
            <span>Back to website</span>
          </Link>
        </header>

        {/* Tab Navigation */}
        <nav className="legal-tabs" aria-label="Legal documents">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = t.id === activeTab;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`legal-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main Content Card */}
        <main className="legal-card">
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'refund' && <RefundContent />}
          {activeTab === 'contact' && <ContactContent />}
        </main>

        <footer className="legal-footer">
          <p>© 2026 Zunoon Club. Surat, Gujarat, India. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <div className="legal-meta">
        <span className="legal-meta-badge">Privacy &amp; Data Protection</span>
        <span>Last updated: November 2026</span>
      </div>
      <h1 className="legal-title">Privacy Policy</h1>
      <p className="legal-lead">
        At Zunoon Club, we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard your details when you join our community or use our website (zunoonclub.com).
      </p>

      <div className="legal-body">
        <section>
          <h2 className="legal-section-title">1. Information We Collect</h2>
          <p>When you register for Zunoon Club membership, we collect only the necessary details to manage your membership:</p>
          <ul>
            <li><strong>Personal Details:</strong> Full Name.</li>
            <li><strong>Contact Information:</strong> 10-digit Indian Mobile Phone Number.</li>
            <li><strong>Transaction Information:</strong> Payment reference ID, order ID, amount, and payment status generated through our authorized payment gateway.</li>
          </ul>
          <p>
            <em>Note: We do not collect or store sensitive banking credentials, credit/debit card numbers, CVVs, or UPI MPINs. All payments are handled directly by PCI-DSS compliant payment gateways.</em>
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">2. How We Use Your Information</h2>
          <p>We use your information exclusively for club-related activities, including:</p>
          <ul>
            <li>Verifying your annual membership registration and maintaining active records.</li>
            <li>Adding you to official Zunoon Club WhatsApp community groups and activity circles.</li>
            <li>Sending activity schedules, weekend meetup announcements, and event updates.</li>
            <li>Providing customer support and responding to your enquiries.</li>
            <li>Generating official membership receipts and reconciliation.</li>
          </ul>
        </section>

        <section>
          <h2 className="legal-section-title">3. Payment Security (Razorpay)</h2>
          <p>
            All online membership payments on Zunoon Club are securely processed through <strong>Razorpay Software Private Limited</strong>. Razorpay complies with the highest international security standards (PCI-DSS Level 1 certified). Your card, netbanking, and UPI credentials are encrypted and never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">4. Data Sharing &amp; Confidentiality</h2>
          <p>
            We strictly respect your privacy. <strong>We do not sell, rent, trade, or share your personal data with third-party advertisers or telemarketers.</strong> Your data is shared only with trusted operational providers (such as Razorpay for payments and WhatsApp for club communication) strictly to deliver your club membership services.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">5. Data Retention &amp; Your Rights</h2>
          <p>
            Your information is retained for the duration of your active membership and as required by Indian accounting and legal obligations. You may request to review, update, or delete your contact information by contacting us at any time.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">6. Grievance Officer &amp; Contact</h2>
          <p>If you have questions, feedback, or grievances regarding this Privacy Policy, please reach out to us:</p>
          <div className="legal-contact-box">
            <div className="legal-contact-item">
              <strong>Organization:</strong>
              <span>Zunoon Club</span>
            </div>
            <div className="legal-contact-item">
              <strong>Location:</strong>
              <span>Surat, Gujarat, India</span>
            </div>
            <div className="legal-contact-item">
              <strong>WhatsApp / Call:</strong>
              <a href="https://wa.me/919712112110" target="_blank" rel="noopener noreferrer">+91 97121 12110</a>
            </div>
            <div className="legal-contact-item">
              <strong>Instagram:</strong>
              <a href="https://www.instagram.com/zunoon_club/" target="_blank" rel="noopener noreferrer">@zunoon_club</a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <div className="legal-meta">
        <span className="legal-meta-badge">Terms of Service</span>
        <span>Last updated: November 2026</span>
      </div>
      <h1 className="legal-title">Terms &amp; Conditions</h1>
      <p className="legal-lead">
        Welcome to Zunoon Club. By completing your membership registration, making a payment, or participating in our community activities, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <div className="legal-body">
        <section>
          <h2 className="legal-section-title">1. About Zunoon Club</h2>
          <p>
            Zunoon Club is a life experience and community organisation founded in Surat, Gujarat by Jainit Finaviya. The club provides a holistic Human 360° platform across six dedicated clubs: Health Club, Sports Club, Social Club, Knowledge &amp; Growth Club, Hobby &amp; Creative Club, and Celebration Club.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">2. Membership Terms &amp; Validity</h2>
          <ul>
            <li><strong>Validity:</strong> The Zunoon Club membership is valid for exactly one (1) year from the date of payment receipt.</li>
            <li><strong>Non-Transferable:</strong> Memberships are personal to the registered individual and cannot be transferred, sold, or assigned to another person.</li>
            <li><strong>Inclusions:</strong> Membership grants access to official club groups, morning walking/yoga meetups, community discussions, and standard club sessions.</li>
            <li><strong>Separate Activity Charges:</strong> Certain specialized workshops, venue rentals, tournament entry fees, outdoor excursions, or festive celebrations may carry nominal participation fees, which will always be communicated in advance.</li>
          </ul>
        </section>

        <section>
          <h2 className="legal-section-title">3. Community Code of Conduct</h2>
          <p>Zunoon Club is built on friendship, mutual respect, and positive living. All members must adhere to our community code:</p>
          <ul>
            <li>Treat all fellow members, organizers, and guests with dignity, courtesy, and respect.</li>
            <li>No hate speech, harassment, vulgarity, political/religious provocation, or commercial spam in community groups.</li>
            <li>Follow safety and etiquette rules during outdoor sports, morning workouts, and club gatherings.</li>
            <li>Zunoon Club reserves the right to suspend or terminate the membership of any individual who violates community safety or conduct standards, without any refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="legal-section-title">4. Health &amp; Physical Activity Disclaimer</h2>
          <p>
            Members participate in morning walks, sports, fitness, and outdoor activities voluntarily and at their own discretion. Members are encouraged to consult a physician before undertaking strenuous physical exercise. Zunoon Club and its organizers shall not be liable for personal injuries or health complications arising from voluntary participation in general fitness sessions.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">5. Membership Activation &amp; Service Delivery</h2>
          <p>
            Upon successful payment verification by Razorpay, membership confirmation and digital receipts are generated instantly. Registered members are connected and onboarded to official Zunoon Club WhatsApp community groups within 24 to 48 hours. Zunoon Club provides digital and in-person community club services; no physical goods are shipped via postal courier.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">6. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with Zunoon Club shall be subject to the exclusive jurisdiction of the competent courts in <strong>Surat, Gujarat, India</strong>.
          </p>
        </section>
      </div>
    </>
  );
}

function RefundContent() {
  return (
    <>
      <div className="legal-meta">
        <span className="legal-meta-badge">Refund &amp; Cancellation</span>
        <span>Last updated: November 2026</span>
      </div>
      <h1 className="legal-title">Cancellation &amp; Refund Policy</h1>
      <p className="legal-lead">
        We strive to ensure complete clarity and transparency regarding our membership fees, activity charges, and refund processes.
      </p>

      <div className="legal-body">
        <section>
          <h2 className="legal-section-title">1. Annual Membership Fee</h2>
          <p>
            The annual membership fee (₹2,100/- per year, or as configured) covers immediate enrollment, community onboarding, digital membership registration, and ongoing community management.
          </p>
          <ul>
            <li>Once a membership is approved and activated, the annual membership fee is <strong>non-refundable</strong> and <strong>non-transferable</strong>.</li>
            <li>If you decide to leave the community or pause your attendance before the end of the 1-year period, no partial or pro-rated refund will be granted.</li>
          </ul>
        </section>

        <section>
          <h2 className="legal-section-title">2. Duplicate or Erroneous Transactions</h2>
          <p>
            If a technical error or network interruption occurs during payment processing, resulting in:
          </p>
          <ul>
            <li>An accidental duplicate payment (amount debited more than once for the same registration), or</li>
            <li>Payment debited from your bank account but not acknowledged on the website:</li>
          </ul>
          <p>
            Please notify us within <strong>7 days</strong> with your transaction receipt/reference ID. Once verified with our payment gateway (Razorpay), the excess amount will be refunded automatically to your original payment source within <strong>5 to 7 business days</strong>.
          </p>
        </section>

        <section>
          <h2 className="legal-section-title">3. Event-Specific Cancellation Policy</h2>
          <p>
            For separate ticketed workshops, special outings, or paid tournaments:
          </p>
          <ul>
            <li>If an event is cancelled or postponed by Zunoon Club due to bad weather, venue unavailability, or unforeseen circumstances, registered participants will receive a 100% refund or credit for the rescheduled date.</li>
            <li>Voluntary cancellations by the participant are subject to specific event guidelines stated at the time of registration.</li>
          </ul>
        </section>

        <section>
          <h2 className="legal-section-title">4. How to Request a Refund</h2>
          <p>To request assistance with an erroneous payment or duplicate charge, please contact our team:</p>
          <div className="legal-contact-box">
            <div className="legal-contact-item">
              <strong>WhatsApp Support:</strong>
              <a href="https://wa.me/919712112110" target="_blank" rel="noopener noreferrer">+91 97121 12110</a>
            </div>
            <div className="legal-contact-item">
              <strong>Required Details:</strong>
              <span>Full Name, Mobile Number, Payment ID, and Date of Transaction.</span>
            </div>
            <div className="legal-contact-item">
              <strong>Processing Window:</strong>
              <span>5 to 7 working days via Razorpay to original bank / UPI account.</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ContactContent() {
  return (
    <>
      <div className="legal-meta">
        <span className="legal-meta-badge">Contact Information</span>
        <span>Get in touch</span>
      </div>
      <h1 className="legal-title">Contact Us</h1>
      <p className="legal-lead">
        Have questions about Zunoon Club membership, upcoming events, or need assistance? We are here to help you.
      </p>

      <div className="legal-body">
        <div className="legal-contact-box">
          <div className="legal-contact-item">
            <strong>Club Name:</strong>
            <span>Zunoon Club (Human 360° Community)</span>
          </div>
          <div className="legal-contact-item">
            <strong>Founder:</strong>
            <span>Jainit Finaviya</span>
          </div>
          <div className="legal-contact-item">
            <strong>Headquarters:</strong>
            <span>Surat, Gujarat, India</span>
          </div>
          <div className="legal-contact-item">
            <strong>Phone / Call:</strong>
            <a href="tel:+919712112110">+91 97121 12110</a>
          </div>
          <div className="legal-contact-item">
            <strong>WhatsApp:</strong>
            <a href="https://wa.me/919712112110" target="_blank" rel="noopener noreferrer">+91 97121 12110</a>
          </div>
          <div className="legal-contact-item">
            <strong>Instagram:</strong>
            <a href="https://www.instagram.com/zunoon_club/" target="_blank" rel="noopener noreferrer">@zunoon_club</a>
          </div>
          <div className="legal-contact-item">
            <strong>Website:</strong>
            <a href="https://zunoonclub.com">zunoonclub.com</a>
          </div>
          <div className="legal-contact-item">
            <strong>Support Hours:</strong>
            <span>Monday – Saturday: 9:00 AM – 7:00 PM (IST)</span>
          </div>
        </div>
      </div>
    </>
  );
}

