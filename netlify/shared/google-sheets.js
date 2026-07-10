const crypto = require('crypto');

const tokenCache = {
  accessToken: '',
  expiresAt: 0,
};

const sheetHeaderCache = new Set();
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

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getPrivateKey() {
  return (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
}

function sheetsConfigured() {
  return Boolean(process.env.GOOGLE_APPS_SCRIPT_URL) || hasDirectSheetsConfig();
}

function hasDirectSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_SHEETS_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
}

function buildSheetRow(eventName, payload = {}) {
  return [
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
    payload.userAgent || '',
    payload.ip || '',
    JSON.stringify(payload.metadata || {}),
  ];
}

async function appendViaAppsScript(eventName, payload = {}) {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      eventName,
      headers: sheetHeaders,
      row: buildSheetRow(eventName, payload),
      payload,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || data.message || 'Unable to append row with Google Apps Script');
  }

  return { ok: true };
}

async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(getPrivateKey());
  const assertion = `${unsigned}.${base64url(signature)}`;

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Unable to authenticate with Google Sheets');
  }

  tokenCache.accessToken = data.access_token;
  tokenCache.expiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;
  return tokenCache.accessToken;
}

async function appendSheetRow(eventName, payload = {}) {
  if (!sheetsConfigured()) {
    return { skipped: true, reason: 'Google Sheets env vars are not configured' };
  }

  if (!hasDirectSheetsConfig() && process.env.GOOGLE_APPS_SCRIPT_URL) {
    return appendViaAppsScript(eventName, payload);
  }

  const accessToken = await getAccessToken();
  const sheetName = process.env.GOOGLE_SHEETS_TAB || 'Q1';
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  await ensureSheetHeaders({ accessToken, spreadsheetId, sheetName });

  const range = encodeURIComponent(`${sheetName}!A:Z`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const row = buildSheetRow(eventName, payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || 'Unable to append row to Google Sheets');
  }

  return { ok: true };
}

async function ensureSheetHeaders({ accessToken, spreadsheetId, sheetName }) {
  const cacheKey = `${spreadsheetId}:${sheetName}`;
  if (sheetHeaderCache.has(cacheKey)) return;

  const headerRange = encodeURIComponent(`${sheetName}!A1:N1`);
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}`;
  const getResponse = await fetch(getUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const current = await getResponse.json().catch(() => ({}));
  if (!getResponse.ok) {
    throw new Error(current.error?.message || 'Unable to read Google Sheets headers');
  }

  const firstRow = current.values?.[0] || [];
  if (firstRow.length > 0) {
    sheetHeaderCache.add(cacheKey);
    return;
  }

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}?valueInputOption=USER_ENTERED`;
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [sheetHeaders] }),
  });
  const updateData = await updateResponse.json().catch(() => ({}));
  if (!updateResponse.ok) {
    throw new Error(updateData.error?.message || 'Unable to write Google Sheets headers');
  }

  sheetHeaderCache.add(cacheKey);
}

module.exports = {
  appendSheetRow,
  jsonResponse,
};
