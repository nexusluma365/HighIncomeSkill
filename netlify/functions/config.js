const { products, formatPrice } = require('../shared/products');
const { jsonResponse } = require('../shared/google-sheets');

const defaultStripePublishableKey = 'pk_test_51TeycBPJOp8s8XsSvgsYs2KtFZt1F2fUg9W32bxS2rDcORtp4F89PUj54Dz1WJbhPS1i8vnouVLeSiUX9cWfzp4v00RLV2KMcT';

exports.handler = async () => {
  return jsonResponse(200, {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || defaultStripePublishableKey,
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
