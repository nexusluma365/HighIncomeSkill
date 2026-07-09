const { getProducts, calculateCheckoutAmount, resolveDownloadProduct } = require('../shared/products');
const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');
const { signDownloadToken } = require('../shared/download-token');

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
      return jsonResponse(500, { error: `Missing Cloudflare R2 file settings for ${downloadProduct.name}` });
    }
    const cartName = selectedProducts.map((item) => item.shortName || item.name).join(' + ');

    await appendSheetRow('purchase_confirmed', {
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
        downloadProductName: downloadProduct.name,
        stripeAmountReceived: paidAmount,
        stripeCurrency: intent.currency,
      },
    }).catch((error) => console.error('sheet append failed', error));

    const downloadToken = signDownloadToken({
      productKey: downloadProduct.key,
      paymentIntentId: intent.id,
      amount: paidAmount,
    });

    const downloads = [{
      productKey: downloadProduct.key,
      productName: downloadProduct.name,
      fileName: downloadProduct.fileName,
      downloadUrl: `/.netlify/functions/download-product?token=${encodeURIComponent(downloadToken)}`,
    }];

    return jsonResponse(200, {
      downloadUrl: downloads[0]?.downloadUrl,
      fileName: downloads[0]?.fileName,
      productName: downloads[0]?.productName,
      downloads,
    });
  } catch (error) {
    console.error('confirm-purchase failed', error);
    return jsonResponse(500, { error: error.message || 'Unable to confirm purchase' });
  }
};
