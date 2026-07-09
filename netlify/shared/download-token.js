const crypto = require('crypto');

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getTokenSecret() {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY || '';
  if (!secret) {
    throw new Error('Missing DOWNLOAD_TOKEN_SECRET or STRIPE_SECRET_KEY');
  }
  return secret;
}

function signDownloadToken(payload) {
  const tokenPayload = {
    ...payload,
    exp: payload.exp || Date.now() + 15 * 60 * 1000,
  };
  const encodedPayload = base64url(JSON.stringify(tokenPayload));
  const signature = crypto
    .createHmac('sha256', getTokenSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyDownloadToken(token) {
  const [encodedPayload, signature] = String(token || '').split('.');
  if (!encodedPayload || !signature) {
    throw new Error('Invalid download token');
  }

  const expected = crypto
    .createHmac('sha256', getTokenSecret())
    .update(encodedPayload)
    .digest('base64url');

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid download token');
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (!payload.exp || Date.now() > Number(payload.exp)) {
    throw new Error('Download link expired');
  }

  return payload;
}

module.exports = {
  signDownloadToken,
  verifyDownloadToken,
};
