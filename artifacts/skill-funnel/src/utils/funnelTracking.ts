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

const appsScriptFallbackUrl = 'https://script.google.com/macros/s/AKfycbzlDP7jZEH4hIodDxcjWAwl-KQOhq51ELzEoOx-IxyXRzk0a1lEEbV366vmmGsberHp/exec';
const sheetHeaders = [
  'Timestamp',
  'Event',
  'Name',
  'Email',
  'Product Key',
  'Product Name',
  'Amount',
  'Payment Intent ID',
  'Status',
  'Page',
  'Source',
  'User Agent',
  'IP',
  'Metadata',
];

export function buildFunnelTrackingPayload(funnel: FunnelTrackingState, extra: TrackingExtra = {}) {
  return {
    name: funnel.visitorName || '',
    email: funnel.visitorEmail || '',
    productKey: extra.productKey || funnel.selectedProductKeys?.join(',') || '',
    productName: extra.productName || '',
    amount: extra.amount || '',
    status: extra.status || '',
    page: extra.page || '',
    source: extra.source || 'skill_funnel',
    metadata: {
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
  let body = '';
  try {
    body = JSON.stringify({ eventName, ...payload });
  } catch {
    return;
  }

  void fetch('/.netlify/functions/log-step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  })
    .then((response) => {
      if (!response.ok) sendAppsScriptFallback(eventName, payload);
    })
    .catch(() => {
      sendAppsScriptFallback(eventName, payload);
    });
}

function sendAppsScriptFallback(eventName: string, payload: Record<string, unknown>) {
  try {
    const row = [
      new Date().toISOString(),
      eventName,
      payload.name || '',
      payload.email || '',
      payload.productKey || '',
      payload.productName || '',
      payload.amount || '',
      payload.paymentIntentId || '',
      payload.status || '',
      payload.page || '',
      payload.source || '',
      navigator.userAgent || '',
      '',
      JSON.stringify(payload.metadata || {}),
    ];
    const url = new URL(appsScriptFallbackUrl);
    url.searchParams.set('data', JSON.stringify({ eventName, headers: sheetHeaders, row, payload }));

    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.src = url.toString();
  } catch {
    // Tracking should never interrupt the funnel.
  }
}
