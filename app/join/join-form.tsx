'use client';
import {useEffect, useRef, useState} from 'react';
import {Phone, CheckCircle2, AlertCircle, RotateCcw} from 'lucide-react';
import {inr} from '@/lib/payments';
import {useContact} from '@/lib/use-contact';
import {WhatsAppIcon} from '@/components/icons';
import './join.css';

type Result = {
  reference: string;
  name?: string;
  phone?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: number;
  paymentId?: string;
  paidAt?: string;
  failureReason?: string;
  mode?: string;
};

type CheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type Checkout = {
  open: () => void;
  on: (event: string, handler: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => Checkout;
  }
}

async function api(path: string, body?: unknown) {
  const r = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: {'Content-Type': 'application/json'},
    ...(body ? {body: JSON.stringify(body)} : {}),
    cache: 'no-store'
  });
  const d = await r.json();
  if (!r.ok) throw Error(d.error || 'Please try again.');
  return d;
}

async function checkoutScript() {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => {
      s.remove();
      reject(Error('Could not load secure checkout. Check your connection and try again.'));
    };
    document.head.appendChild(s);
  });
}

const storageKey = 'zunoon-membership-reference';
const storageNameKey = 'zunoon-membership-name';
const storagePhoneKey = 'zunoon-membership-phone';

export default function JoinForm() {
  const contact = useContact();
  const [config, setConfig] = useState<{feePaise: number; enabled: boolean; configured: boolean; mode: string} | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [reference, setReference] = useState('');
  const successful = useRef(false);

  function resetForm() {
    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageNameKey);
    sessionStorage.removeItem(storagePhoneKey);
    setReference('');
    setResult(null);
    setName('');
    setPhone('');
    setError('');
    successful.current = false;
  }

  function getWhatsAppUrl(res: Result, memberName: string, memberPhone: string) {
    const cleanNum = contact.whatsappNumber.replace(/\D/g, '') || '919712112110';
    const finalName = res.name || memberName || 'Member';
    const finalPhone = res.phone || memberPhone || '—';
    const msg = [
      'Hello Zunoon Club!',
      '',
      'I have completed my Annual Membership payment on the website.',
      '',
      '*Membership Details:*',
      `• Name: ${finalName}`,
      `• Mobile: ${finalPhone}`,
      `• Amount: ${inr(res.amount)}`,
      `• Payment ID: ${res.paymentId || '—'}`,
      `• Reference: ${res.reference}`,
      '',
      'Please confirm my membership. Thank you!'
    ].join('\n');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  }

  async function check(ref: string, closed = false) {
    try {
      const d = await api('/api/payments/status/', {reference: ref, closed});
      setResult(d);
      successful.current = d.status === 'SUCCESS';
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    api('/api/payments/config/').then(setConfig).catch(e => setError(e.message));
    // Clear old completed references so returning users can fill a fresh form
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      api('/api/payments/status/', {reference: saved, closed: false})
        .then(d => {
          if (d.status === 'PENDING') {
            setReference(saved);
            setResult(d);
            const savedName = sessionStorage.getItem(storageNameKey);
            const savedPhone = sessionStorage.getItem(storagePhoneKey);
            if (savedName) setName(savedName);
            if (savedPhone) setPhone(savedPhone);
          } else {
            // Already paid or failed: clean session so fresh form is open
            sessionStorage.removeItem(storageKey);
            sessionStorage.removeItem(storageNameKey);
            sessionStorage.removeItem(storagePhoneKey);
          }
        })
        .catch(() => {
          sessionStorage.removeItem(storageKey);
        });
    }
  }, []);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await checkoutScript();
      const ref = reference || crypto.randomUUID();
      setReference(ref);
      sessionStorage.setItem(storageKey, ref);
      sessionStorage.setItem(storageNameKey, name);
      sessionStorage.setItem(storagePhoneKey, phone);

      const order = await api('/api/payments/order/', {name, phone, requestId: ref});
      if (order.status === 'SUCCESS') {
        await check(ref);
        return;
      }
      setResult({reference: ref, status: 'PENDING', amount: order.amount, mode: order.mode});
      if (!window.Razorpay) throw Error('Secure checkout unavailable.');

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Zunoon Club',
        description: 'Annual membership · 1 year',
        prefill: {name, contact: phone},
        theme: {color: '#264d39'},
        handler: async (response: CheckoutResponse) => {
          try {
            const d = await api('/api/payments/verify/', {reference: ref, ...response});
            setResult(d);
            successful.current = d.status === 'SUCCESS';
            setError('');
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            if (!successful.current) void check(ref, true);
            else setBusy(false);
          }
        }
      });
      checkout.on('payment.failed', () => {
        void check(ref);
      });
      checkout.open();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="join-page">
      <a href="/" className="join-brand">
        Zunoon Club<span>A celebration of life</span>
      </a>
      <section className="join-card">
        {result?.status === 'SUCCESS' ? (
          <div className="join-success-card" role="status">
            <div className="join-success-header">
              <div className="join-success-icon-wrap">
                <CheckCircle2 size={34} />
              </div>
              <div>
                <span className="join-success-badge">MEMBERSHIP CONFIRMED</span>
              </div>
              <h2 className="join-success-title">Payment Successful!</h2>
              <p className="join-success-subtitle">
                Thank you for joining Zunoon Club. Your annual membership is confirmed.
              </p>
            </div>

            <div className="join-receipt-box">
              <div className="join-receipt-header">
                <span>MEMBERSHIP RECEIPT</span>
                <span className="join-receipt-tag">PAID · ACTIVE</span>
              </div>

              <div className="join-receipt-grid">
                <div className="join-receipt-item">
                  <span className="receipt-label">Member Name</span>
                  <strong className="receipt-val">{result.name || name || 'Member'}</strong>
                </div>
                {(result.phone || phone) && (
                  <div className="join-receipt-item">
                    <span className="receipt-label">Mobile Number</span>
                    <strong className="receipt-val">{result.phone || phone}</strong>
                  </div>
                )}
                <div className="join-receipt-item">
                  <span className="receipt-label">Amount Paid</span>
                  <strong className="receipt-val receipt-amount">{inr(result.amount)}</strong>
                </div>
                <div className="join-receipt-item">
                  <span className="receipt-label">Payment ID</span>
                  <span className="receipt-code">{result.paymentId || '—'}</span>
                </div>
                <div className="join-receipt-item">
                  <span className="receipt-label">Reference ID</span>
                  <span className="receipt-code">{result.reference}</span>
                </div>
                <div className="join-receipt-item">
                  <span className="receipt-label">Validity</span>
                  <span className="receipt-val">1 Year · 6 Clubs Included</span>
                </div>
              </div>
            </div>

            <div className="join-success-actions">
              <a
                href={getWhatsAppUrl(result, name, phone)}
                className="join-wa-action-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={20} />
                <span>Send Details to WhatsApp</span>
              </a>

              <button
                type="button"
                className="join-reset-btn"
                onClick={resetForm}
              >
                <RotateCcw size={15} />
                <span>Register Another Member / નવી નોંધણી</span>
              </button>
            </div>

            <div className="join-back-wrap">
              <a href="/" className="join-back-link">
                ← Return to Zunoon Homepage
              </a>
            </div>
          </div>
        ) : (
          <>
            <span className="join-eyebrow">ANNUAL MEMBERSHIP</span>
            <h1>Find your people.<br />Join Zunoon.</h1>
            <p>એક કમ્યુનિટી. નવા સંબંધો, અનુભવો અને વિકાસ.</p>
            {config && <div className="join-price">{inr(config.feePaise)}<small> / year</small></div>}
            
            {error && (
              <div className="join-error-box" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="join-notice-box" role="status">
                <strong>{result.status === 'FAILED' ? 'Payment failed' : 'Payment pending confirmation'}</strong>
                <p>
                  {result.status === 'FAILED'
                    ? result.failureReason || 'Your payment was not completed.'
                    : 'If an amount was debited, check status before making another payment.'}
                </p>
                <small>Reference: {result.reference}</small>
              </div>
            )}

            {reference && (
              <div className="join-recovery">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    void check(reference);
                  }}
                >
                  Check payment status
                </button>
                <p style={{display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 0'}}>
                  <Phone size={13} style={{color: '#205c38'}} />
                  <span>Contact <a href={`tel:${contact.telNumber}`}>{contact.displayPhone}</a> with this reference if you need help.</span>
                </p>
              </div>
            )}

            <form onSubmit={pay}>
              <label>
                Full name / પૂરું નામ
                <input
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  disabled={busy}
                  placeholder="Enter your full name"
                  onChange={e => setName(e.target.value)}
                />
              </label>
              <label>
                Mobile number / મોબાઇલ નંબર
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  placeholder="10-digit Indian mobile number"
                  value={phone}
                  disabled={busy}
                  onChange={e => setPhone(e.target.value)}
                />
              </label>
              <p className="join-small">
                Membership is valid for 1 year. Activity &amp; event charges may apply separately. By proceeding, you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>,{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a> &amp;{' '}
                <a href="/refund" target="_blank" rel="noopener noreferrer">Refund Policy</a>.
              </p>
              <button className="join-pay" disabled={busy || !config?.enabled || !config?.configured}>
                {busy ? 'Checking payment…' : reference ? 'Resume secure payment' : config ? 'Pay ' + inr(config.feePaise) + ' & join' : 'Loading…'}
              </button>
              {config && !config.enabled && <p>Online registration is currently paused.</p>}
              {config && !config.configured && <p>Online payments are being configured. Please contact the team.</p>}
            </form>
          </>
        )}
      </section>
    </main>
  );
}
