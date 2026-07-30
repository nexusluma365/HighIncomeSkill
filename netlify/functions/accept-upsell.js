const { products, getDownloadProductName } = require('../shared/products');
const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');
const { signDownloadToken } = require('../shared/download-token');

const downloadTokenTtlMs = 90 * 1000;
const originalProductKey = 'richRelationshipsEbook';
const upsellProductKey = 'workFromHomeBundle';

async function stripeRequest(path, params) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || 'Stripe request failed');
  }

  return data;
}

async function getPaymentIntent(paymentIntentId) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  const response = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntentId)}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || 'Unable to verify original payment');
  }

  return data;
}

function getMetadataKeys(intent) {
  return String(intent.metadata?.productKeys || intent.metadata?.productKey || '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const originalPaymentIntentId = String(body.originalPaymentIntentId || '').trim();
    const sessionId = String(body.sessionId || '').trim();

    if (!originalPaymentIntentId) {
      return jsonResponse(400, { error: 'Missing original payment reference' });
    }

    const originalIntent = await getPaymentIntent(originalPaymentIntentId);
    const originalKeys = getMetadataKeys(originalIntent);
    const originalSessionId = String(originalIntent.metadata?.sessionId || '').trim();

    if (originalIntent.status !== 'succeeded' || !originalKeys.includes(originalProductKey)) {
      return jsonResponse(403, { error: 'Original Rich Relationships purchase could not be verified.' });
    }

    if (originalSessionId && sessionId !== originalSessionId) {
      return jsonResponse(403, { error: 'Original purchase session could not be verified.' });
    }

    if (!originalIntent.customer || !originalIntent.payment_method) {
      return jsonResponse(409, {
        error: 'This order was not saved for one-click upgrades. Please contact support or use a standard checkout link.',
      });
    }

    const product = products[upsellProductKey];
    const receiptEmail = originalIntent.metadata?.customerEmail || originalIntent.receipt_email || '';
    const params = {
      amount: String(product.amount),
      currency: product.currency,
      customer: originalIntent.customer,
      payment_method: originalIntent.payment_method,
      off_session: 'true',
      confirm: 'true',
      description: product.name,
      receipt_email: receiptEmail,
      'metadata[productKey]': product.key,
      'metadata[productName]': product.name,
      'metadata[productKeys]': product.key,
      'metadata[downloadProductKey]': product.key,
      'metadata[downloadProductName]': product.name,
      'metadata[customerName]': originalIntent.metadata?.customerName || '',
      'metadata[customerEmail]': originalIntent.metadata?.customerEmail || originalIntent.receipt_email || '',
      'metadata[originalPaymentIntentId]': originalIntent.id,
      'metadata[sessionId]': sessionId || originalSessionId,
      'metadata[source]': 'one_click_upsell',
    };

    if (!receiptEmail) {
      delete params.receipt_email;
    }

    const intent = await stripeRequest('payment_intents', params);

    if (intent.status !== 'succeeded') {
      return jsonResponse(402, { error: 'The upsell charge was not completed.' });
    }

    const downloadProductName = getDownloadProductName([product.key], product);
    const downloadToken = signDownloadToken({
      productKey: product.key,
      paymentIntentId: intent.id,
      amount: intent.amount_received || product.amount,
      sessionId: sessionId || originalSessionId,
      exp: Date.now() + downloadTokenTtlMs,
    });

    const downloads = [{
      productKey: product.key,
      productName: downloadProductName,
      fileName: product.fileName,
      downloadUrl: `/.netlify/functions/download-product?token=${encodeURIComponent(downloadToken)}`,
    }];

    await appendSheetRow('one_click_upsell_confirmed', {
      sessionId: sessionId || originalSessionId,
      name: originalIntent.metadata?.customerName || '',
      email: originalIntent.metadata?.customerEmail || originalIntent.receipt_email || '',
      productKey: product.key,
      productName: product.name,
      amount: `$${(product.amount / 100).toFixed(2)}`,
      paymentIntentId: intent.id,
      status: intent.status,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
      metadata: {
        originalPaymentIntentId: originalIntent.id,
        downloadProductKey: product.key,
        downloadProductName,
        stripeCustomerId: originalIntent.customer,
      },
    }).catch((error) => console.error('sheet append failed', error));

    return jsonResponse(200, {
      paymentIntentId: intent.id,
      productKey: product.key,
      productName: product.name,
      amount: `$${(product.amount / 100).toFixed(2)}`,
      downloads,
      downloadUrl: downloads[0].downloadUrl,
      fileName: downloads[0].fileName,
    });
  } catch (error) {
    console.error('accept-upsell failed', error);
    return jsonResponse(500, { error: 'The Digital Skills Bundle upgrade could not be completed. Please try again or contact support.' });
  }
};
