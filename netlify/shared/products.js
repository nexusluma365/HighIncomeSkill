const cents = (dollars) => Math.round(dollars * 100);

const products = {
  workFromHomeBundle: {
    key: 'workFromHomeBundle',
    name: 'AI & Digital Skills Bundle',
    shortName: 'Digital Skills Bundle',
    amount: cents(97),
    currency: 'usd',
    value: '$1,279',
    fileName: process.env.PRODUCT_WORK_FROM_HOME_FILE_NAME || 'AI Digital Skills Bundle.zip',
    r2Bucket: process.env.PRODUCT_WORK_FROM_HOME_BUCKET || process.env.R2_BUCKET || '',
    r2FileKey: process.env.PRODUCT_WORK_FROM_HOME_FILE_KEY || process.env.R2_FILE_KEY_BUNDLE || '',
  },
  aiAutomation: {
    key: 'aiAutomation',
    name: 'AI Automation System',
    shortName: 'AI Automation',
    amount: cents(297),
    currency: 'usd',
    value: '$297',
    fileName: process.env.PRODUCT_AI_AUTOMATION_FILE_NAME || 'AI Automation Toolkit.zip',
    r2Bucket: process.env.PRODUCT_AI_AUTOMATION_BUCKET || process.env.R2_BUCKET2 || process.env.R2_BUCKET || '',
    r2FileKey: process.env.PRODUCT_AI_AUTOMATION_FILE_KEY || process.env.R2_FILE_KEY_AI_ASSISTANT || '',
  },
  websiteSeo: {
    key: 'websiteSeo',
    name: 'Website + SEO Client Path',
    shortName: 'Website + SEO',
    amount: cents(47),
    currency: 'usd',
    value: '$47',
    fileName: process.env.PRODUCT_WEBSITE_SEO_FILE_NAME || 'Website SEO Template.zip',
    r2Bucket: process.env.PRODUCT_WEBSITE_SEO_BUCKET || process.env.R2_BUCKET3 || process.env.R2_BUCKET2 || process.env.R2_BUCKET || '',
    r2FileKey: process.env.PRODUCT_WEBSITE_SEO_FILE_KEY || process.env.R2_FILE_KEY_WEBSITE_VOICE || '',
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

function formatPrice(product) {
  return `$${(product.amount / 100).toFixed(2)}`;
}

module.exports = {
  products,
  getProduct,
  getProducts,
  calculateCheckoutAmount,
  formatPrice,
};
