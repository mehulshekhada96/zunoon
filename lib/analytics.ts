/**
 * Zunoon Club - Event Analytics Tracking Helper
 * Works seamlessly with Google Analytics (GA4), Google Tag Manager (GTM),
 * and Meta/Facebook Pixel when IDs are configured.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

export function trackEvent({ action, category, label, value, ...rest }: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 (gtag)
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }

  // Google Tag Manager (dataLayer)
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }

  // Meta Pixel (fbq)
  if (typeof window.fbq === 'function') {
    if (action === 'conversion' || action === 'whatsapp_lead') {
      window.fbq('track', 'Lead', { content_name: label, value: value || 2100, currency: 'INR' });
    } else {
      window.fbq('trackCustom', action, { label, category, value });
    }
  }

  // Developer mode logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${action}:`, { category, label, value, ...rest });
  }
}

