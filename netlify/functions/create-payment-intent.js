const { getProducts, calculateCheckoutAmount, resolveDownloadProduct } = require('../shared/products');
const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');

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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const requestedKeys = Array.isArray(body.productKeys) && body.productKeys.length > 0
      ? body.productKeys
      : [body.productKey];
    const selectedProducts = getProducts(requestedKeys);
    if (selectedProducts.length === 0) {
      return jsonResponse(400, { error: 'Unknown product selected' });
    }
    const product = selectedProducts[0];
    const isCart = selectedProducts.length > 1;
    const cartName = isCart
      ? selectedProducts.map((item) => item.shortName || item.name).join(' + ')
      : product.name;
    const productKeys = selectedProducts.map((item) => item.key);
    const amount = calculateCheckoutAmount(productKeys);
    const downloadProduct = resolveDownloadProduct(productKeys);

    const metadata = {
      productKey: product.key,
      productName: cartName,
      productKeys: productKeys.join(','),
      downloadProductKey: downloadProduct.key,
      downloadProductName: downloadProduct.name,
      customerName: body.name || '',
      customerEmail: body.email || '',
    };

    const params = {
      amount: String(amount),
      currency: product.currency,
      description: cartName,
      receipt_email: body.email || '',
      'automatic_payment_methods[enabled]': 'true',
      'metadata[productKey]': metadata.productKey,
      'metadata[productName]': metadata.productName,
      'metadata[productKeys]': metadata.productKeys,
      'metadata[downloadProductKey]': metadata.downloadProductKey,
      'metadata[downloadProductName]': metadata.downloadProductName,
      'metadata[customerName]': metadata.customerName,
      'metadata[customerEmail]': metadata.customerEmail,
    };

    if (!params.receipt_email) {
      delete params.receipt_email;
    }

    const intent = await stripeRequest('payment_intents', params);

    await appendSheetRow('payment_intent_created', {
      name: body.name || '',
      email: body.email || '',
      productKey: productKeys.join(','),
      productName: cartName,
      amount: `$${(amount / 100).toFixed(2)}`,
      paymentIntentId: intent.id,
      status: intent.status,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
      metadata,
    }).catch((error) => console.error('sheet append failed', error));

    return jsonResponse(200, {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      productKey: product.key,
      productKeys,
      downloadProductKey: downloadProduct.key,
    });
  } catch (error) {
    console.error('create-payment-intent failed', error);
    return jsonResponse(500, { error: error.message || 'Payment setup failed' });
  }
};
