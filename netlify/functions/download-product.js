const { getProduct } = require('../shared/products');
const { verifyDownloadToken } = require('../shared/download-token');
const { createR2SignedDownloadUrl } = require('../shared/r2');
const { appendSheetRow } = require('../shared/google-sheets');

function textResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: message,
  };
}

exports.handler = async (event) => {
  try {
    const token = event.queryStringParameters?.token || '';
    const payload = verifyDownloadToken(token);
    const product = getProduct(payload.productKey);

    if (!product) {
      return textResponse(404, 'Download product not found.');
    }

    const signedUrl = createR2SignedDownloadUrl(product, { expires: 300 });

    await appendSheetRow('download_ready', {
      productKey: product.key,
      productName: product.name,
      paymentIntentId: payload.paymentIntentId || '',
      status: 'redirect_to_r2',
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
    }).catch((error) => console.error('sheet append failed', error));

    return {
      statusCode: 302,
      headers: {
        Location: signedUrl,
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  } catch (error) {
    console.error('download-product failed', error);
    return textResponse(403, error.message || 'Download link is invalid or expired.');
  }
};
