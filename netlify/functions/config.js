const { products, formatPrice } = require('../shared/products');
const { jsonResponse } = require('../shared/google-sheets');

exports.handler = async () => {
  return jsonResponse(200, {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    products: Object.fromEntries(
      Object.entries(products).map(([key, product]) => [
        key,
        {
          key,
          name: product.name,
          price: formatPrice(product),
          fileName: product.fileName,
        },
      ])
    ),
  });
};
