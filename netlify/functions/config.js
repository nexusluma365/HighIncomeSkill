const { products, formatPrice } = require('../shared/products');
const { jsonResponse } = require('../shared/google-sheets');

const defaultStripePublishableKey = 'pk_live_51TeycBPJOp8s8XsSjWLZD8n3JweuczqhYYgoJKLkiNfogQUnveNxlB3YMOM8GPrBAd8YCWYNXxVv4vKdgcoftxoR00IsTaLRDD';

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
