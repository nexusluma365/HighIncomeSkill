const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');
const { createR2SignedDownloadUrl } = require('../shared/r2');

const defaultR2Bucket = 'digitalskills';
const defaultR2Prefix = 'digitalskillsproudct';

function normalizeR2FileKey(fileKey) {
  const trimmed = String(fileKey || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes('/')) return trimmed;
  return `${defaultR2Prefix}/${trimmed}`;
}

function getOrigin(event) {
  const configured = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (configured) return configured.replace(/\/$/, '');

  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host || '';
  return host ? `${protocol}://${host}` : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function getRichRelationshipsProduct() {
  const fileName = process.env.RICH_RELATIONSHIPS_FILE_NAME || 'Rich Relationships.pdf';

  return {
    key: 'richRelationshipsEbook',
    name: 'Rich Relationships Ebook',
    fileName,
    r2Bucket: process.env.RICH_RELATIONSHIPS_BUCKET || process.env.R2_BUCKET || defaultR2Bucket,
    r2FileKey: normalizeR2FileKey(
      process.env.RICH_RELATIONSHIPS_FILE_KEY || `${defaultR2Prefix}/${fileName}`,
    ),
  };
}

async function sendDeliveryEmail({ event, lead }) {
  const origin = getOrigin(event);
  const ebookProduct = getRichRelationshipsProduct();
  const ebookUrl = createR2SignedDownloadUrl(ebookProduct, {
    expires: Number(process.env.RICH_RELATIONSHIPS_DOWNLOAD_EXPIRES_SECONDS || 86400),
  });
  const emailPayload = {
    to: lead.email,
    subject: 'Your Rich Relationships Ebook Is Ready',
    bodyText: [
      `Hi ${lead.firstName},`,
      '',
      'Your free copy of Rich Relationships is ready.',
      '',
      'Strong relationships can improve your quality of life, open new doors and help you find people who need the value you can create.',
      '',
      'DOWNLOAD RICH RELATIONSHIPS',
      ebookUrl,
      '',
      'Your free training is also waiting for you.',
      '',
      'CONTINUE YOUR JOURNEY',
      `${origin}/goal`,
    ].join('\n'),
    buttons: [
      {
        label: 'DOWNLOAD RICH RELATIONSHIPS',
        url: ebookUrl,
      },
      {
        label: 'CONTINUE YOUR JOURNEY',
        url: `${origin}/goal`,
      },
    ],
  };

  if (!process.env.RICH_RELATIONSHIPS_EMAIL_WEBHOOK_URL) {
    throw new Error('Ebook delivery is not configured yet.');
  }

  const response = await fetch(process.env.RICH_RELATIONSHIPS_EMAIL_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.RICH_RELATIONSHIPS_EMAIL_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.RICH_RELATIONSHIPS_EMAIL_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(emailPayload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || data.message || 'Unable to send ebook email');
  }

  return {
    ok: true,
    delivery: 'r2_signed_url',
    productKey: ebookProduct.key,
    bucket: ebookProduct.r2Bucket,
    fileKey: ebookProduct.r2FileKey,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const lead = {
      firstName: String(body.firstName || '').trim().slice(0, 80),
      email: String(body.email || '').trim().toLowerCase().slice(0, 160),
      phone: String(body.phone || '').trim().slice(0, 40),
      source: 'rich-relationships',
      createdAt: body.createdAt || new Date().toISOString(),
    };

    if (!lead.firstName || !isValidEmail(lead.email)) {
      return jsonResponse(400, { error: 'First name and a valid email are required.' });
    }

    await appendSheetRow('rich_relationships_lead', {
      sessionId: body.sessionId || '',
      name: lead.firstName,
      email: lead.email,
      status: 'lead_received',
      page: '/ebook',
      source: lead.source,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
      metadata: {
        phone: lead.phone,
        createdAt: lead.createdAt,
      },
    });

    const emailResult = await sendDeliveryEmail({ event, lead });

    await appendSheetRow('rich_relationships_email_sent', {
      sessionId: body.sessionId || '',
      name: lead.firstName,
      email: lead.email,
      status: 'email_sent',
      page: '/ebook',
      source: lead.source,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
      metadata: {
        phone: lead.phone,
        createdAt: lead.createdAt,
        emailDelivery: emailResult,
      },
    });

    return jsonResponse(200, { ok: true, email: 'sent' });
  } catch (error) {
    console.error('submit-rich-relationships-lead failed', error);
    return jsonResponse(500, { error: error.message || 'Unable to send your ebook right now.' });
  }
};
