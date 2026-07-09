const cents = (dollars) => Math.round(dollars * 100);
const defaultR2Bucket = 'digitalskills';
const defaultR2Prefix = 'digitalskillsproudct';

const products = {
  workFromHomeBundle: {
    key: 'workFromHomeBundle',
    name: 'AI & Digital Skills Bundle',
    shortName: 'Digital Skills Bundle',
    amount: cents(97),
    currency: 'usd',
    value: '$1,279',
    fileName: process.env.PRODUCT_WORK_FROM_HOME_FILE_NAME || 'Complete Digital Skill Bundle.zip',
    r2Bucket: process.env.PRODUCT_WORK_FROM_HOME_BUCKET || process.env.R2_BUCKET || defaultR2Bucket,
    r2FileKey: process.env.PRODUCT_WORK_FROM_HOME_FILE_KEY || process.env.R2_FILE_KEY_BUNDLE || `${defaultR2Prefix}/Complete Digital Skill Bundle.zip`,
  },
  aiAutomation: {
    key: 'aiAutomation',
    name: 'AI Automation System',
    shortName: 'AI Automation',
    amount: cents(297),
    currency: 'usd',
    value: '$297',
    fileName: process.env.PRODUCT_AI_AUTOMATION_FILE_NAME || 'Digital Skills Bundle + Automation .zip',
    r2Bucket: process.env.PRODUCT_AI_AUTOMATION_BUCKET || process.env.R2_BUCKET2 || process.env.R2_BUCKET || defaultR2Bucket,
    r2FileKey: process.env.PRODUCT_AI_AUTOMATION_FILE_KEY || process.env.R2_FILE_KEY_AI_ASSISTANT || `${defaultR2Prefix}/Digital Skills Bundle + Automation .zip`,
  },
  websiteSeo: {
    key: 'websiteSeo',
    name: 'Website + SEO Client Path',
    shortName: 'Website + SEO',
    amount: cents(47),
    currency: 'usd',
    value: '$47',
    fileName: process.env.PRODUCT_WEBSITE_SEO_FILE_NAME || 'Digital Skills Bundle + Website Template SEO.zip',
    r2Bucket: process.env.PRODUCT_WEBSITE_SEO_BUCKET || process.env.R2_BUCKET3 || process.env.R2_BUCKET2 || process.env.R2_BUCKET || defaultR2Bucket,
    r2FileKey: process.env.PRODUCT_WEBSITE_SEO_FILE_KEY || process.env.R2_FILE_KEY_WEBSITE_VOICE || `${defaultR2Prefix}/Digital Skills Bundle + Website Template SEO.zip`,
  },
};

function getProduct(productKey) {
  return products[productKey] || null;
}

function getProducts(productKeys) {
  return [...new Set(productKeys)].map(getProduct).filter(Boolean);
}

function calculateCheckoutAmount(productKeys) {
  const uniqueKeys = [...new Set(productKeys.filter(Boolean))];
  const isBundleCart = uniqueKeys.includes('workFromHomeBundle') && uniqueKeys.length > 1;

  if (!isBundleCart) {
    return getProducts(uniqueKeys).reduce((total, item) => total + item.amount, 0);
  }

  const bundleBase = products.workFromHomeBundle.amount;
  const creditCount = ['websiteSeo', 'aiAutomation'].filter((key) => uniqueKeys.includes(key)).length;
  const savings = Math.min(creditCount * cents(25), cents(50));

  return bundleBase - savings;
}

function resolveDownloadProduct(productKeys) {
  const keySet = new Set(productKeys.filter(Boolean));
  const hasWebsiteSeo = keySet.has('websiteSeo');
  const hasAiAutomation = keySet.has('aiAutomation');
  const selectedAddOnCount = [hasWebsiteSeo, hasAiAutomation].filter(Boolean).length;

  if (selectedAddOnCount === 0 || selectedAddOnCount === 2) {
    return products.workFromHomeBundle;
  }

  if (hasWebsiteSeo) {
    return products.websiteSeo;
  }

  if (hasAiAutomation) {
    return products.aiAutomation;
  }

  return products.workFromHomeBundle;
}

function formatPrice(product) {
  return `$${(product.amount / 100).toFixed(2)}`;
}

module.exports = {
  products,
  getProduct,
  getProducts,
  calculateCheckoutAmount,
  resolveDownloadProduct,
  formatPrice,
};
