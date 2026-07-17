import { getFunnelSessionId } from '@/utils/funnelTracking';

export interface RichRelationshipsLead {
  firstName: string;
  email: string;
  phone?: string;
  source: 'rich-relationships';
  createdAt: string;
}

export async function submitRichRelationshipsLead(lead: RichRelationshipsLead) {
  const response = await fetch('/.netlify/functions/submit-rich-relationships-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, sessionId: getFunnelSessionId() }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || 'Unable to send your ebook right now.');
  }

  return data;
}
