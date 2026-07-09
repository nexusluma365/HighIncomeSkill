const { appendSheetRow, jsonResponse } = require('../shared/google-sheets');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const eventName = String(body.eventName || 'unknown_step').slice(0, 80);
    const payload = {
      ...body,
      userAgent: event.headers['user-agent'] || '',
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '',
    };

    await appendSheetRow(eventName, payload);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('log-step failed', error);
    return jsonResponse(200, { ok: true, warning: 'Step was not logged' });
  }
};
