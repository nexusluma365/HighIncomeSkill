const { getProducts, calculateCheckoutAmount, resolveDownloadProduct, getDownloadProductName } = require('../shared/products');
const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');
const { signDownloadToken } = require('../shared/download-token');

const downloadTokenTtlMs = 7 * 24 * 60 * 60 * 1000;

function getOrigin(event) {
  const configured = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (configured) return configured.replace(/\/$/, '');

  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host || '';
  return host ? `${protocol}://${host}` : '';
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
    throw new Error(data.error?.message || 'Unable to verify payment');
  }

  return data;
}

async function sendPaidEbookEmail({ event, email, firstName, download }) {
  if (!email) return false;
  if (!process.env.RICH_RELATIONSHIPS_EMAIL_WEBHOOK_URL) {
    throw new Error('Ebook email delivery is not configured yet.');
  }

  const origin = getOrigin(event);
  const absoluteDownloadUrl = download.downloadUrl.startsWith('http')
    ? download.downloadUrl
    : `${origin}${download.downloadUrl}`;
  const emailPayload = {
    to: email,
    subject: 'Your Rich Relationships Ebook Is Ready',
    bodyText: [
      firstName ? `Hi ${firstName},` : 'Hi,',
      '',
      'Your Rich Relationships ebook purchase is confirmed.',
      '',
      'DOWNLOAD RICH RELATIONSHIPS',
      absoluteDownloadUrl,
      '',
      'You can also continue your journey here:',
      `${origin}/goal`,
    ].join('\n'),
    buttons: [
      {
        label: 'DOWNLOAD RICH RELATIONSHIPS',
        url: absoluteDownloadUrl,
      },
      {
        label: 'CONTINUE YOUR JOURNEY',
        url: `${origin}/goal`,
      },
    ],
  };

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

  return true;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.paymentIntentId) {
      return jsonResponse(400, { error: 'Missing payment reference' });
    }

    const intent = await getPaymentIntent(body.paymentIntentId);
    const metadataKeys = String(intent.metadata?.productKeys || intent.metadata?.productKey || '')
      .split(',')
      .map((key) => key.trim())
      .filter(Boolean);
    const requestedKeys = Array.isArray(body.productKeys) && body.productKeys.length > 0
      ? body.productKeys
      : body.productKey
        ? [body.productKey]
        : metadataKeys;
    const selectedProducts = getProducts(requestedKeys);
    if (selectedProducts.length === 0) {
      return jsonResponse(400, { error: 'Unknown product selected' });
    }
    const selectedKeys = selectedProducts.map((item) => item.key);
    const metadataKeySet = new Set(metadataKeys);
    const paidAmount = Number(intent.amount_received || intent.amount || 0);
    const expectedAmount = calculateCheckoutAmount(selectedKeys);

    if (intent.status !== 'succeeded') {
      return jsonResponse(402, { error: 'Payment has not been completed yet' });
    }
    if (selectedKeys.some((key) => !metadataKeySet.has(key)) || paidAmount < expectedAmount) {
      return jsonResponse(403, { error: 'Payment does not match the selected product' });
    }
    const downloadProduct = resolveDownloadProduct(selectedKeys);
    if (!downloadProduct.r2Bucket || !downloadProduct.r2FileKey) {
      return jsonResponse(500, { error: 'Your purchase was confirmed, but the download could not be prepared. Please contact support with your receipt.' });
    }
    const downloadProductName = getDownloadProductName(selectedKeys, downloadProduct);
    const cartName = selectedProducts.map((item) => item.shortName || item.name).join(' + ');

    await appendSheetRow('purchase_confirmed', {
      sessionId: body.sessionId || intent.metadata?.sessionId || '',
      name: intent.metadata?.customerName || '',
      email: intent.metadata?.customerEmail || intent.receipt_email || '',
      productKey: selectedKeys.join(','),
      productName: cartName,
      amount: `$${(expectedAmount / 100).toFixed(2)}`,
      paymentIntentId: intent.id,
      status: intent.status,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
      metadata: {
        downloadProductKey: downloadProduct.key,
        downloadProductName,
        stripeAmountReceived: paidAmount,
        stripeCurrency: intent.currency,
      },
    }).catch((error) => console.error('sheet append failed', error));

    const downloadToken = signDownloadToken({
      productKey: downloadProduct.key,
      paymentIntentId: intent.id,
      amount: paidAmount,
      sessionId: body.sessionId || intent.metadata?.sessionId || '',
      exp: Date.now() + downloadTokenTtlMs,
    });

    const downloads = [{
      productKey: downloadProduct.key,
      productName: downloadProductName,
      fileName: downloadProduct.fileName,
      downloadUrl: `/.netlify/functions/download-product?token=${encodeURIComponent(downloadToken)}`,
    }];
    const deliveryEmail = String(body.deliverTo || '').trim().toLowerCase();
    const emailDelivered = deliveryEmail
      ? await sendPaidEbookEmail({
          event,
          email: deliveryEmail,
          firstName: intent.metadata?.customerName || '',
          download: downloads[0],
        })
      : false;

    return jsonResponse(200, {
      downloadUrl: downloads[0]?.downloadUrl,
      fileName: downloads[0]?.fileName,
      productName: downloads[0]?.productName,
      downloads,
      emailDelivered,
    });
  } catch (error) {
    console.error('confirm-purchase failed', error);
    return jsonResponse(500, { error: 'Unable to confirm your download. Please refresh or contact support with your receipt.' });
  }
};
