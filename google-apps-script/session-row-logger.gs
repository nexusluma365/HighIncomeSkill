const SHEET_NAME = 'Q1';
const ARCHIVE_SHEET_NAME = 'Q1 Legacy Event Rows';
const SCRIPT_VERSION = 'session-row-logger-v2';

const HEADERS = [
  'Created At',
  'Updated At',
  'Session ID',
  'Name',
  'Email',
  'Goal',
  'Challenge',
  'Pages Viewed',
  'Work From Anywhere Choice',
  'Website + SEO Choice',
  'AI Automation Choice',
  'Selected Products',
  'Product Key',
  'Product Name',
  'Amount',
  'Payment Intent ID',
  'Payment Status',
  'Final Sale Agreement',
  'Download Product',
  'Download Status',
  'Last Event',
  'Last Page',
  'Source',
  'User Agent',
  'IP',
  'Metadata'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    setupHeaders_(sheet);

    const data = JSON.parse(e.postData.contents || '{}');
    const eventName = data.eventName || 'unknown_event';
    const payload = normalizePayload_(data);
    const sessionId = getSessionId_(payload);
    const rowNumber = findOrCreateSessionRow_(sheet, sessionId, payload.email);

    updateSessionRow_(sheet, rowNumber, eventName, payload);

    return json_({ ok: true, sessionId, rowNumber });
  } catch (error) {
    return json_({
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  }
}

function doGet() {
  return json_({
    ok: true,
    version: SCRIPT_VERSION,
    message: 'Nexus Luma funnel session logger is live. Each session updates one row.'
  });
}

function setupFunnelSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  setupHeaders_(sheet);
  sheet.autoResizeColumns(1, HEADERS.length);

  return 'Funnel session sheet is ready.';
}

function setupHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
  const currentHeaders = firstRow.map(value => String(value || '').trim());
  const hasHeaders = currentHeaders.some(Boolean);
  const hasSessionLayout = currentHeaders[0] === HEADERS[0] &&
    currentHeaders[1] === HEADERS[1] &&
    currentHeaders[2] === HEADERS[2];

  if (hasHeaders && !hasSessionLayout) {
    archiveLegacyRows_(sheet);
  }

  sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent().setFontWeight('normal');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function archiveLegacyRows_(sheet) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let archive = ss.getSheetByName(ARCHIVE_SHEET_NAME);

  if (!archive) {
    archive = ss.insertSheet(ARCHIVE_SHEET_NAME);
  }

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow > 0 && lastColumn > 0) {
    const archiveStartRow = archive.getLastRow() + 1;
    archive.getRange(archiveStartRow, 1).setValue(`Archived from ${SHEET_NAME} at ${new Date().toISOString()}`);
    const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    archive.getRange(archiveStartRow + 1, 1, values.length, values[0].length).setValues(values);
  }

  sheet.clear();
}

function normalizePayload_(data) {
  const payload = data.payload && typeof data.payload === 'object'
    ? Object.assign({}, data.payload)
    : Object.assign({}, data);

  if (data.row && Array.isArray(data.row)) {
    const hasSessionColumn = data.row.length >= 15;
    const offset = hasSessionColumn ? 1 : 0;
    payload.sessionId = payload.sessionId || (hasSessionColumn ? data.row[1] : '');
    payload.name = payload.name || data.row[2 + offset] || '';
    payload.email = payload.email || data.row[3 + offset] || '';
    payload.productKey = payload.productKey || data.row[4 + offset] || '';
    payload.productName = payload.productName || data.row[5 + offset] || '';
    payload.amount = payload.amount || data.row[6 + offset] || '';
    payload.paymentIntentId = payload.paymentIntentId || data.row[7 + offset] || '';
    payload.status = payload.status || data.row[8 + offset] || '';
    payload.page = payload.page || data.row[9 + offset] || '';
    payload.source = payload.source || data.row[10 + offset] || '';
    payload.userAgent = payload.userAgent || data.row[11 + offset] || '';
    payload.ip = payload.ip || data.row[12 + offset] || '';
  }

  payload.metadata = payload.metadata && typeof payload.metadata === 'object'
    ? payload.metadata
    : {};

  return payload;
}

function getSessionId_(payload) {
  return payload.sessionId ||
    payload.metadata.sessionId ||
    payload.paymentIntentId ||
    payload.email ||
    `session_${Date.now()}`;
}

function findOrCreateSessionRow_(sheet, sessionId, email) {
  const sessionColumn = headerIndex_('Session ID');
  const emailColumn = headerIndex_('Email');
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    const values = sheet.getRange(2, sessionColumn, lastRow - 1, 1).getValues();
    for (let i = 0; i < values.length; i += 1) {
      if (String(values[i][0]) === String(sessionId)) {
        return i + 2;
      }
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (normalizedEmail) {
      const emailValues = sheet.getRange(2, emailColumn, lastRow - 1, 1).getValues();
      for (let i = 0; i < emailValues.length; i += 1) {
        if (String(emailValues[i][0] || '').trim().toLowerCase() === normalizedEmail) {
          return i + 2;
        }
      }
    }
  }

  const row = new Array(HEADERS.length).fill('');
  row[headerIndex_('Created At') - 1] = new Date().toISOString();
  row[headerIndex_('Session ID') - 1] = sessionId;
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function updateSessionRow_(sheet, rowNumber, eventName, payload) {
  const existing = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0];
  const row = existing.slice();
  const metadata = payload.metadata || {};

  setValue_(row, 'Updated At', new Date().toISOString());
  setValue_(row, 'Last Event', eventName);
  setValue_(row, 'Last Page', payload.page || metadata.route || currentValue_(row, 'Last Page'));
  setValue_(row, 'Source', payload.source || currentValue_(row, 'Source'));
  setValue_(row, 'User Agent', payload.userAgent || currentValue_(row, 'User Agent'));
  setValue_(row, 'IP', payload.ip || currentValue_(row, 'IP'));

  if (payload.name) setValue_(row, 'Name', payload.name);
  if (payload.email) setValue_(row, 'Email', payload.email);
  if (payload.productKey) setValue_(row, 'Product Key', payload.productKey);
  if (payload.productName) setValue_(row, 'Product Name', payload.productName);
  if (payload.amount) setValue_(row, 'Amount', payload.amount);
  if (payload.paymentIntentId) setValue_(row, 'Payment Intent ID', payload.paymentIntentId);
  if (payload.status) setValue_(row, 'Payment Status', payload.status);

  if (metadata.goalId) setValue_(row, 'Goal', metadata.goalId);
  if (metadata.challengeId) setValue_(row, 'Challenge', metadata.challengeId);
  if (metadata.selectedProductKeys) setValue_(row, 'Selected Products', stringifyList_(metadata.selectedProductKeys));
  if (metadata.downloadProductName) setValue_(row, 'Download Product', metadata.downloadProductName);
  if (metadata.downloadProductKey && !currentValue_(row, 'Download Product')) setValue_(row, 'Download Product', metadata.downloadProductKey);

  if (eventName === 'page_view') {
    appendPage_(row, payload.page || metadata.route || '');
  } else if (eventName === 'goal_selected') {
    setValue_(row, 'Goal', metadata.goalText || metadata.goalId || '');
  } else if (eventName === 'challenge_selected') {
    setValue_(row, 'Challenge', metadata.challengeText || metadata.challengeId || '');
  } else if (eventName === 'work_from_home_choice') {
    setValue_(row, 'Work From Anywhere Choice', choiceLabel_(metadata.workFromHomeInterested));
  } else if (eventName === 'website_seo_choice') {
    setValue_(row, 'Website + SEO Choice', choiceLabel_(metadata.websiteSeoAccepted));
  } else if (eventName === 'ai_automation_choice') {
    setValue_(row, 'AI Automation Choice', choiceLabel_(metadata.aiAutomationAccepted));
  } else if (eventName === 'final_sale_agreement_checked' || eventName === 'final_sale_agreement_unchecked') {
    setValue_(row, 'Final Sale Agreement', metadata.finalSaleAccepted ? 'Checked' : 'Unchecked');
  } else if (eventName === 'download_ready') {
    setValue_(row, 'Download Status', 'Ready');
  }

  setValue_(row, 'Metadata', JSON.stringify(metadata));
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([row]);
}

function appendPage_(row, page) {
  if (!page) return;
  const current = currentValue_(row, 'Pages Viewed');
  const pages = current ? current.split(' > ') : [];

  if (pages[pages.length - 1] !== page) {
    pages.push(page);
  }

  setValue_(row, 'Pages Viewed', pages.join(' > '));
}

function choiceLabel_(value) {
  if (value === true || value === 'true') return 'Yes';
  if (value === false || value === 'false') return 'No';
  return '';
}

function stringifyList_(value) {
  return Array.isArray(value) ? value.join(',') : String(value || '');
}

function currentValue_(row, header) {
  return row[headerIndex_(header) - 1] || '';
}

function setValue_(row, header, value) {
  row[headerIndex_(header) - 1] = value;
}

function headerIndex_(header) {
  return HEADERS.indexOf(header) + 1;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
