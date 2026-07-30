/**
 * Nexus Luma Rich Relationships + Digital Skills funnel tracker.
 *
 * Paste this file into Extensions > Apps Script from inside the Google Sheet,
 * then deploy as a Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Netlify sends this exact shape through GOOGLE_APPS_SCRIPT_URL:
 *   { eventName: "page_view", payload: { sessionId, page, status, metadata } }
 *
 * This script keeps one row per visitor session and updates that row as the
 * visitor moves through:
 *   Home -> Ebook opt-in -> $27 checkout -> Thank You -> Training ->
 *   $97 one-click upsell -> Bundle download -> Home.
 */

const SHEET_NAME = 'Q1';
const ARCHIVE_SHEET_NAME = 'Q1 Legacy Event Rows';
const SCRIPT_VERSION = 'digital-skills-funnel-tracker-v3';

const HEADERS = [
  'Created At',
  'Updated At',
  'Session ID',
  'Current Funnel Step',
  'Step Left Off',
  'Last Event',
  'Last Status',
  'Last Page',
  'Last Section',
  'Pages Viewed',
  'Sections Viewed',
  'Event Count',
  'Seconds In Funnel',
  'Seconds Since Last Event',
  'Name',
  'Email',
  'Phone',
  'Goal ID',
  'Goal Text',
  'Challenge ID',
  'Challenge Text',
  'Selected Products',
  'Product Key',
  'Product Name',
  'Amount',
  'Payment Intent ID',
  'Original Payment Intent ID',
  'Upsell Payment Intent ID',
  'Ebook Lead Submitted At',
  'Ebook Checkout Reached At',
  'Ebook Payment Started At',
  'Ebook Payment Succeeded At',
  'Ebook Payment Failed At',
  'Thank You Reached At',
  'Training Reached At',
  'Training Video Loaded At',
  'Training Video Played At',
  'Training Last Ping At',
  'Training Seconds Latest',
  'Training Seconds Max',
  'Training CTA Clicked At',
  'Upsell Reached At',
  'Upsell Accepted At',
  'Upsell Failed At',
  'Download Page Reached At',
  'Download Clicked At',
  'Download Ready At',
  'Download Link Expired At',
  'Download Product',
  'Download File Name',
  'Download Status',
  'Source',
  'User Agent',
  'IP',
  'Latest Metadata JSON',
  'Latest Raw JSON',
  'Event Timeline'
];

const ROUTE_STEPS = {
  '/': 'Home page',
  '/ebook': 'Rich Relationships ebook opt-in',
  '/ebook-checkout': '$27 Rich Relationships checkout',
  '/thankyou': 'Ebook purchase confirmed / training bridge',
  '/goal': 'Quiz: goal selected',
  '/challenge': 'Quiz: challenge selected',
  '/personalized': 'Personalized roadmap',
  '/pain': 'Problem education',
  '/future': 'Future pacing',
  '/lesson': 'Lesson before training',
  '/training': 'Training video',
  '/upsell': '$97 Digital Skills Bundle one-click upsell',
  '/download': 'Digital Skills Bundle download',
};

function doGet() {
  setupFunnelSheet();
  return json_({
    ok: true,
    version: SCRIPT_VERSION,
    sheetName: SHEET_NAME,
    message: 'Digital Skills funnel session tracker is live.'
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const data = parseRequest_(e);
    const eventName = String(data.eventName || data.event || data.status || 'unknown_event').slice(0, 100);
    const payload = normalizePayload_(data);
    const sessionId = getSessionId_(payload);
    const sheet = getTrackingSheet_();

    setupHeaders_(sheet);

    const rowNumber = findOrCreateSessionRow_(sheet, sessionId, payload.email);
    updateSessionRow_(sheet, rowNumber, eventName, payload);

    return json_({
      ok: true,
      version: SCRIPT_VERSION,
      sessionId: sessionId,
      rowNumber: rowNumber,
      eventName: eventName
    });
  } catch (error) {
    return json_({
      ok: false,
      version: SCRIPT_VERSION,
      error: String(error && error.message ? error.message : error)
    });
  } finally {
    lock.releaseLock();
  }
}

function setupFunnelSheet() {
  const sheet = getTrackingSheet_();
  setupHeaders_(sheet);
  formatSheet_(sheet);
  return 'Digital Skills funnel sheet is ready.';
}

function testDigitalSkillsFunnelTracker() {
  const sessionId = 'test-session-' + Date.now();

  doPost({ postData: { contents: JSON.stringify({
    eventName: 'lead_form_success',
    payload: {
      sessionId: sessionId,
      name: 'Test Visitor',
      email: 'test@example.com',
      page: '/ebook',
      source: 'rich-relationships',
      status: 'checkout_redirect',
      metadata: { firstName: 'Test', phone: '555-555-5555' }
    }
  }) } });

  doPost({ postData: { contents: JSON.stringify({
    eventName: 'training_video_engagement',
    payload: {
      sessionId: sessionId,
      page: '/training',
      source: 'rich-relationships',
      status: 'heartbeat',
      metadata: { secondsOnTrainingPage: 45, reason: 'heartbeat' }
    }
  }) } });

  return doPost({ postData: { contents: JSON.stringify({
    eventName: 'one_click_upsell_accepted',
    payload: {
      sessionId: sessionId,
      page: '/upsell',
      source: 'post_purchase',
      productKey: 'workFromHomeBundle',
      productName: 'Work From Anywhere Bundle',
      amount: '$97',
      paymentIntentId: 'pi_test_123',
      status: 'accepted'
    }
  }) } });
}

function parseRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing POST body.');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('Invalid JSON body.');
  }
}

function normalizePayload_(data) {
  const payload = data.payload && typeof data.payload === 'object' && !Array.isArray(data.payload)
    ? Object.assign({}, data.payload)
    : Object.assign({}, data);

  payload.metadata = payload.metadata && typeof payload.metadata === 'object' && !Array.isArray(payload.metadata)
    ? payload.metadata
    : {};

  if (data.eventName && !payload.eventName) {
    payload.eventName = data.eventName;
  }

  return payload;
}

function getTrackingSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function setupHeaders_(sheet) {
  const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
  const existingHeaders = existing.map(function(value) {
    return String(value || '').trim();
  });
  const hasAnyHeader = existingHeaders.some(Boolean);
  const hasExpectedLayout = existingHeaders[0] === HEADERS[0] &&
    existingHeaders[1] === HEADERS[1] &&
    existingHeaders[2] === HEADERS[2] &&
    existingHeaders.indexOf('Training Seconds Max') !== -1;

  if (hasAnyHeader && !hasExpectedLayout) {
    archiveLegacyRows_(sheet);
  }

  sheet.getRange(1, 1, 1, Math.max(sheet.getMaxColumns(), HEADERS.length)).clearContent();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  formatSheet_(sheet);
}

function archiveLegacyRows_(sheet) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let archive = spreadsheet.getSheetByName(ARCHIVE_SHEET_NAME);

  if (!archive) {
    archive = spreadsheet.insertSheet(ARCHIVE_SHEET_NAME);
  }

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow > 0 && lastColumn > 0) {
    const startRow = archive.getLastRow() + 1;
    archive.getRange(startRow, 1).setValue('Archived from ' + SHEET_NAME + ' at ' + new Date().toISOString());
    const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    archive.getRange(startRow + 1, 1, values.length, values[0].length).setValues(values);
  }

  sheet.clear();
}

function formatSheet_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#07192f')
    .setFontColor('#ffffff')
    .setWrap(true);
  sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), HEADERS.length).setWrap(true);

  const widths = {
    1: 165,
    2: 165,
    3: 220,
    4: 260,
    5: 260,
    8: 170,
    9: 260,
    10: 360,
    11: 360,
    15: 180,
    16: 240,
    18: 160,
    19: 260,
    20: 160,
    21: 260,
    24: 260,
    26: 220,
    27: 220,
    28: 220,
    49: 260,
    53: 320,
    55: 520,
    56: 520,
    57: 720
  };

  Object.keys(widths).forEach(function(column) {
    sheet.setColumnWidth(Number(column), widths[column]);
  });
}

function findOrCreateSessionRow_(sheet, sessionId, email) {
  if (!sessionId) {
    throw new Error('Missing sessionId.');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const sessionColumn = col_('Session ID') + 1;
    const sessionValues = sheet.getRange(2, sessionColumn, lastRow - 1, 1).getValues();

    for (let index = 0; index < sessionValues.length; index += 1) {
      if (String(sessionValues[index][0]) === String(sessionId)) {
        return index + 2;
      }
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    if (cleanEmail) {
      const emailColumn = col_('Email') + 1;
      const emailValues = sheet.getRange(2, emailColumn, lastRow - 1, 1).getValues();

      for (let index = 0; index < emailValues.length; index += 1) {
        if (String(emailValues[index][0] || '').trim().toLowerCase() === cleanEmail) {
          return index + 2;
        }
      }
    }
  }

  const now = new Date();
  const row = new Array(HEADERS.length).fill('');
  row[col_('Created At')] = now;
  row[col_('Updated At')] = now;
  row[col_('Session ID')] = sessionId;
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function updateSessionRow_(sheet, rowNumber, eventName, payload) {
  const now = new Date();
  const range = sheet.getRange(rowNumber, 1, 1, HEADERS.length);
  const row = range.getValues()[0];
  const metadata = payload.metadata || {};
  const page = String(payload.page || metadata.route || '').trim();
  const sectionLabel = String(metadata.sectionLabel || metadata.sectionId || '').trim();
  const secondsSinceLastEvent = secondsBetween_(value_(row, 'Updated At'), now);
  const currentStep = deriveCurrentStep_(eventName, page, metadata);
  const stepLeftOff = deriveLeftOff_(eventName, page, metadata, currentStep);

  set_(row, 'Updated At', now);
  set_(row, 'Current Funnel Step', currentStep);
  set_(row, 'Step Left Off', stepLeftOff);
  set_(row, 'Last Event', eventName);
  set_(row, 'Last Status', payload.status || '');
  setIfPresent_(row, 'Last Page', page);
  setIfPresent_(row, 'Last Section', sectionLabel);
  set_(row, 'Event Count', number_(value_(row, 'Event Count')) + 1);
  set_(row, 'Seconds Since Last Event', secondsSinceLastEvent);
  set_(row, 'Seconds In Funnel', secondsBetween_(value_(row, 'Created At'), now));
  setIfPresent_(row, 'Source', payload.source);
  setIfPresent_(row, 'User Agent', payload.userAgent);
  setIfPresent_(row, 'IP', payload.ip);

  applyIdentity_(row, payload, metadata);
  applyProduct_(row, payload, metadata);
  applyEventSpecifics_(row, eventName, payload, metadata, now);
  appendPage_(row, page, eventName);
  appendSection_(row, page, sectionLabel, metadata, eventName);
  appendTimeline_(row, eventName, page, sectionLabel, payload.status, now);

  set_(row, 'Latest Metadata JSON', JSON.stringify(metadata));
  set_(row, 'Latest Raw JSON', JSON.stringify(payload));

  range.setValues([row]);
  colorStep_(sheet.getRange(rowNumber, col_('Current Funnel Step') + 1), currentStep);
}

function applyIdentity_(row, payload, metadata) {
  setIfPresent_(row, 'Name', payload.name || metadata.firstName || metadata.customerName);
  setIfPresent_(row, 'Email', payload.email || metadata.customerEmail);
  setIfPresent_(row, 'Phone', payload.phone || metadata.phone);
  setIfPresent_(row, 'Goal ID', metadata.goalId || payload.goalId);
  setIfPresent_(row, 'Goal Text', metadata.goalText || payload.goal);
  setIfPresent_(row, 'Challenge ID', metadata.challengeId || payload.challengeId);
  setIfPresent_(row, 'Challenge Text', metadata.challengeText || payload.challenge);
}

function applyProduct_(row, payload, metadata) {
  setIfPresent_(row, 'Selected Products', stringifyList_(metadata.selectedProductKeys || payload.selectedProductKeys));
  setIfPresent_(row, 'Product Key', payload.productKey || metadata.downloadProductKey);
  setIfPresent_(row, 'Product Name', payload.productName || metadata.downloadProductName);
  setIfPresent_(row, 'Amount', payload.amount);
  setIfPresent_(row, 'Payment Intent ID', payload.paymentIntentId || metadata.paymentIntentId);
  setIfPresent_(row, 'Original Payment Intent ID', metadata.originalPaymentIntentId);
  setIfPresent_(row, 'Upsell Payment Intent ID', metadata.upsellPaymentIntentId);
  setIfPresent_(row, 'Download Product', metadata.downloadProductName || payload.productName);
  setIfPresent_(row, 'Download File Name', payload.fileName || metadata.fileName);
}

function applyEventSpecifics_(row, eventName, payload, metadata, now) {
  const timestampMap = {
    lead_form_submit: 'Ebook Lead Submitted At',
    lead_form_success: 'Ebook Lead Submitted At',
    ebook_checkout_payment_started: 'Ebook Payment Started At',
    ebook_checkout_payment_succeeded: 'Ebook Payment Succeeded At',
    ebook_checkout_payment_failed: 'Ebook Payment Failed At',
    purchase_confirmed: 'Ebook Payment Succeeded At',
    training_page_view: 'Training Reached At',
    training_cta_click: 'Training CTA Clicked At',
    one_click_upsell_view: 'Upsell Reached At',
    one_click_upsell_accepted: 'Upsell Accepted At',
    one_click_upsell_failed: 'Upsell Failed At',
    digital_bundle_download_page_view: 'Download Page Reached At',
    digital_bundle_download_click: 'Download Clicked At',
    digital_bundle_download_link_expired: 'Download Link Expired At',
    download_ready: 'Download Ready At'
  };

  if (eventName === 'page_view' && payload.page === '/ebook-checkout') {
    set_(row, 'Ebook Checkout Reached At', now);
  }
  if (eventName === 'page_view' && payload.page === '/thankyou') {
    set_(row, 'Thank You Reached At', now);
  }
  if (eventName === 'training_video_play' && payload.status === 'loaded') {
    set_(row, 'Training Video Loaded At', now);
  }
  if (eventName === 'training_video_play' && payload.status === 'played') {
    set_(row, 'Training Video Played At', now);
  }
  if (eventName === 'training_video_engagement') {
    const seconds = number_(metadata.secondsOnTrainingPage);
    set_(row, 'Training Last Ping At', now);
    set_(row, 'Training Seconds Latest', seconds);
    set_(row, 'Training Seconds Max', Math.max(number_(value_(row, 'Training Seconds Max')), seconds));
  }

  const timestampHeader = timestampMap[eventName];
  if (timestampHeader) {
    set_(row, timestampHeader, now);
  }

  if (eventName === 'download_ready') {
    set_(row, 'Download Status', 'Redirected to secure file');
  } else if (eventName === 'digital_bundle_download_click') {
    set_(row, 'Download Status', 'Clicked download button');
  } else if (eventName === 'digital_bundle_download_link_expired') {
    set_(row, 'Download Status', 'Link expired before click');
  } else if (eventName === 'one_click_upsell_accepted') {
    set_(row, 'Download Status', 'Bundle access prepared');
  }
}

function deriveCurrentStep_(eventName, page, metadata) {
  if (eventName === 'lead_form_submit' || eventName === 'lead_form_success') return 'Ebook lead captured';
  if (eventName === 'ebook_checkout_payment_started') return 'Ebook checkout payment started';
  if (eventName === 'ebook_checkout_payment_succeeded' || eventName === 'purchase_confirmed') return 'Ebook purchased';
  if (eventName === 'ebook_checkout_payment_failed') return 'Ebook payment failed';
  if (eventName === 'goal_selected') return 'Quiz goal selected';
  if (eventName === 'challenge_selected') return 'Quiz challenge selected';
  if (eventName === 'training_video_play') return metadata && metadata.reason ? 'Training video' : 'Training video opened';
  if (eventName === 'training_video_engagement') return 'Training video engagement';
  if (eventName === 'training_cta_click') return 'Training completed / upsell requested';
  if (eventName === 'one_click_upsell_view') return 'Upsell viewed';
  if (eventName === 'one_click_upsell_accepted') return 'Upsell accepted';
  if (eventName === 'one_click_upsell_failed') return 'Upsell payment failed';
  if (eventName === 'digital_bundle_download_page_view') return 'Bundle download page';
  if (eventName === 'digital_bundle_download_click') return 'Bundle download clicked';
  if (eventName === 'download_ready') return 'Secure download delivered';
  if (eventName === 'digital_bundle_download_link_expired') return 'Bundle download expired';
  if (eventName === 'section_view') return 'Viewing section: ' + (metadata.sectionLabel || metadata.sectionId || page || 'unknown');
  if (ROUTE_STEPS[page]) return ROUTE_STEPS[page];
  return eventName || 'Unknown step';
}

function deriveLeftOff_(eventName, page, metadata, currentStep) {
  if (eventName === 'training_video_engagement') {
    return 'Training video: ' + number_(metadata.secondsOnTrainingPage) + ' seconds, ' + (metadata.reason || 'engagement');
  }
  if (eventName === 'section_view') {
    return (page || 'Page') + ' / ' + (metadata.sectionLabel || metadata.sectionId || 'section');
  }
  return currentStep;
}

function appendPage_(row, page, eventName) {
  if (!page || eventName !== 'page_view') return;

  const current = String(value_(row, 'Pages Viewed') || '');
  const pages = current ? current.split(' > ') : [];

  if (pages[pages.length - 1] !== page) {
    pages.push(page);
  }

  set_(row, 'Pages Viewed', pages.join(' > '));
}

function appendSection_(row, page, sectionLabel, metadata, eventName) {
  if (eventName !== 'section_view' || !sectionLabel) return;

  const sectionEntry = [
    page || metadata.route || 'unknown-page',
    sectionLabel
  ].join(': ');
  const current = String(value_(row, 'Sections Viewed') || '');
  const sections = current ? current.split(' > ') : [];

  if (sections[sections.length - 1] !== sectionEntry) {
    sections.push(sectionEntry);
  }

  set_(row, 'Sections Viewed', sections.join(' > '));
}

function appendTimeline_(row, eventName, page, sectionLabel, status, now) {
  const current = String(value_(row, 'Event Timeline') || '');
  const entry = [
    Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
    eventName,
    page || '',
    sectionLabel || '',
    status || ''
  ].filter(Boolean).join(' | ');
  const timeline = current ? current + '\n' + entry : entry;
  const maxLength = 48000;

  set_(row, 'Event Timeline', timeline.length > maxLength ? timeline.slice(timeline.length - maxLength) : timeline);
}

function getSessionId_(payload) {
  const metadata = payload.metadata || {};
  return String(
    payload.sessionId ||
    metadata.sessionId ||
    metadata.originalPaymentIntentId ||
    payload.paymentIntentId ||
    payload.email ||
    ''
  ).trim();
}

function secondsBetween_(startValue, endValue) {
  const start = startValue instanceof Date ? startValue.getTime() : Date.parse(startValue);
  const end = endValue instanceof Date ? endValue.getTime() : Date.parse(endValue);

  if (!start || !end) return '';
  return Math.max(0, Math.round((end - start) / 1000));
}

function stringifyList_(value) {
  if (Array.isArray(value)) return value.join(',');
  return String(value || '');
}

function number_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function col_(header) {
  const index = HEADERS.indexOf(header);
  if (index === -1) throw new Error('Unknown header: ' + header);
  return index;
}

function value_(row, header) {
  return row[col_(header)];
}

function set_(row, header, value) {
  row[col_(header)] = value;
}

function setIfPresent_(row, header, value) {
  if (value === undefined || value === null || value === '') return;
  set_(row, header, value);
}

function colorStep_(cell, step) {
  const stepText = String(step || '').toLowerCase();
  let color = '#ffffff';

  if (stepText.indexOf('failed') !== -1 || stepText.indexOf('expired') !== -1) {
    color = '#ffcdd2';
  } else if (stepText.indexOf('download') !== -1 || stepText.indexOf('accepted') !== -1 || stepText.indexOf('purchased') !== -1) {
    color = '#c8e6c9';
  } else if (stepText.indexOf('payment') !== -1 || stepText.indexOf('checkout') !== -1 || stepText.indexOf('upsell') !== -1) {
    color = '#fff3cd';
  } else if (stepText.indexOf('training') !== -1) {
    color = '#d7ecff';
  } else if (stepText.indexOf('quiz') !== -1 || stepText.indexOf('section') !== -1) {
    color = '#e8f5e9';
  }

  cell.setBackground(color);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
