interface FunnelTrackingState {
  goalId?: string;
  challengeId?: string;
  visitorName?: string;
  visitorEmail?: string;
  workFromHomeInterested?: boolean;
  addOnAccepted?: boolean;
  upsellAccepted?: boolean;
  selectedProductKeys?: string[];
}

interface TrackingExtra {
  page?: string;
  source?: string;
  productKey?: string;
  productName?: string;
  amount?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

type GoogleAnalyticsValue = string | number | boolean;
type GoogleAnalyticsParams = Record<string, GoogleAnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __nexusLumaGaLoaded?: string;
  }
}

function getGoogleAnalyticsMeasurementId() {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
}

export function loadGoogleAnalytics() {
  const measurementId = getGoogleAnalyticsMeasurementId();
  if (!measurementId || typeof window === 'undefined') return false;
  if (window.__nexusLumaGaLoaded === measurementId) return true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });

  if (!document.querySelector(`script[data-ga-measurement-id="${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaMeasurementId = measurementId;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
  });
  window.__nexusLumaGaLoaded = measurementId;
  return true;
}

function toGoogleAnalyticsParams(payload: Record<string, unknown>) {
  const params: GoogleAnalyticsParams = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      params[key] = value;
    }
  });

  const metadata = payload.metadata;
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    Object.entries(metadata as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        params[`metadata_${key}`] = value;
      }
    });
  }

  return params;
}

export function logGoogleAnalyticsEvent(eventName: string, payload: Record<string, unknown>) {
  if (!loadGoogleAnalytics() || !window.gtag) return;

  const params = toGoogleAnalyticsParams(payload);
  params.event_category = typeof payload.source === 'string' ? payload.source : 'skill_funnel';

  if (eventName === 'page_view') {
    window.gtag('event', 'page_view', {
      ...params,
      page_path: typeof payload.page === 'string' ? payload.page : window.location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    return;
  }

  window.gtag('event', eventName, params);
}

export function getFunnelSessionId() {
  const storageKey = 'nexus_luma_funnel_session_id';
  const fallbackKey = '__nexusLumaFunnelSessionId';

  try {
    const existing =
      localStorage.getItem(storageKey) ||
      sessionStorage.getItem(storageKey);
    if (existing) return existing;

    const generated = crypto.randomUUID
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(storageKey, generated);
    sessionStorage.setItem(storageKey, generated);
    return generated;
  } catch {
    const windowWithFallback = window as Window & { [fallbackKey]?: string };
    if (windowWithFallback[fallbackKey]) return windowWithFallback[fallbackKey];

    const generated = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    windowWithFallback[fallbackKey] = generated;
    return generated;
  }
}

export function buildFunnelTrackingPayload(funnel: FunnelTrackingState, extra: TrackingExtra = {}) {
  const sessionId = getFunnelSessionId();

  return {
    sessionId,
    name: funnel.visitorName || '',
    email: funnel.visitorEmail || '',
    productKey: extra.productKey || funnel.selectedProductKeys?.join(',') || '',
    productName: extra.productName || '',
    amount: extra.amount || '',
    status: extra.status || '',
    page: extra.page || '',
    source: extra.source || 'skill_funnel',
    metadata: {
      sessionId,
      goalId: funnel.goalId || '',
      challengeId: funnel.challengeId || '',
      workFromHomeInterested: funnel.workFromHomeInterested ?? '',
      websiteSeoAccepted: funnel.addOnAccepted,
      aiAutomationAccepted: funnel.upsellAccepted,
      selectedProductKeys: funnel.selectedProductKeys || [],
      ...extra.metadata,
    },
  };
}

export function logFunnelEvent(eventName: string, payload: Record<string, unknown>) {
  logGoogleAnalyticsEvent(eventName, payload);

  let body: string | Blob = '';
  try {
    body = JSON.stringify({ eventName, payload, ...payload });
  } catch {
    return;
  }

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      '/.netlify/functions/log-step',
      new Blob([body], { type: 'application/json' }),
    );
    if (sent) return;
  }

  void fetch('/.netlify/functions/log-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking should never interrupt the funnel.
  });
}
