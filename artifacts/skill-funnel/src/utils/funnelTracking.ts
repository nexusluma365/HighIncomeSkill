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

export function getFunnelSessionId() {
  const storageKey = 'nexus_luma_funnel_session_id';
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;

    const generated = crypto.randomUUID
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(storageKey, generated);
    return generated;
  } catch {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
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
