import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Check, LockKeyhole, X } from 'lucide-react';
import productImage from '@/assets/media/product-image.png';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

type ProductKey = 'workFromHomeBundle' | 'aiAutomation' | 'websiteSeo';

interface CheckoutProduct {
  key: ProductKey;
  name: string;
  price: number;
  description: string;
  fileName: string;
}

interface StripeCardElement {
  mount: (selectorOrElement: string | HTMLElement) => void;
  destroy: () => void;
}

interface StripeElements {
  create: (type: 'card', options?: Record<string, unknown>) => StripeCardElement;
}

interface StripeClient {
  elements: () => StripeElements;
  confirmCardPayment: (
    clientSecret: string,
    options: {
      payment_method: {
        card: StripeCardElement;
        billing_details: {
          name?: string;
          email?: string;
        };
      };
    },
  ) => Promise<{
    error?: { message?: string; type?: string; code?: string; decline_code?: string };
    paymentIntent?: { id: string; status: string };
  }>;
}

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeClient;
  }
}

const checkoutProducts: CheckoutProduct[] = [
  {
    key: 'workFromHomeBundle',
    name: 'AI & Digital Skills Bundle',
    price: 97,
    fileName: 'Complete Digital Skill Bundle.zip',
    description: 'Start learning practical digital skills companies already pay for, with a roadmap, templates, scripts, prompts, and an action plan you can use from home.',
  },
  {
    key: 'websiteSeo',
    name: 'Website + SEO Client Path',
    price: 47,
    fileName: 'Digital Skills Bundle + Website Template SEO.zip',
    description: 'Add a clear client path for websites, visibility, local SEO, and service offers business owners already understand.',
  },
  {
    key: 'aiAutomation',
    name: 'AI Automation System',
    price: 297,
    fileName: 'Digital Skills Bundle + Automation .zip',
    description: 'Add AI workflows, prompts, follow-up systems, and automation resources that help you deliver faster and look more valuable.',
  },
];

const fallbackSelected: ProductKey[] = ['workFromHomeBundle'];
const addOnCredit = 25;
const socialProofNames = ['Samantha', 'Daren', 'Monica', 'Brandon', 'Alexis', 'Marcus', 'Tiffany'];

let stripeScriptPromise: Promise<StripeClient> | null = null;

function formatMoney(amount: number) {
  return `$${amount.toFixed(0)}`;
}

function calculateBundleTotal(selectedKeys: ProductKey[]) {
  const creditCount = ['websiteSeo', 'aiAutomation'].filter((key) => selectedKeys.includes(key as ProductKey)).length;
  return Math.max(47, 97 - creditCount * addOnCredit);
}

function buildSelectedOfferSummary(selectedKeys: ProductKey[]) {
  const hasWebsiteSeo = selectedKeys.includes('websiteSeo');
  const hasAiAutomation = selectedKeys.includes('aiAutomation');

  const parts = [
    'Instant access to the AI & Digital Skills Bundle: roadmap, templates, scripts, prompts, and a clear action plan.',
  ];

  if (hasWebsiteSeo) {
    parts.push('Website + SEO adds a client-ready path for sites, visibility, and local growth.');
  }

  if (hasAiAutomation) {
    parts.push('AI Automation adds prompts, workflows, and follow-up systems for faster delivery.');
  }

  if (!hasWebsiteSeo || !hasAiAutomation) {
    parts.push('Add both upgrades to unlock the full $50 savings.');
  } else {
    parts.push('Best deal selected: remote-friendly skills plus the full $50 savings.');
  }

  return parts.join(' ');
}

async function getConfig() {
  const response = await fetch('/.netlify/functions/config', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Payment setup is unavailable right now.');
  }
  return response.json() as Promise<{ stripePublishableKey?: string }>;
}

function loadStripe(publishableKey: string) {
  if (!publishableKey) {
    return Promise.reject(new Error('Stripe publishable key is missing.'));
  }
  if (window.Stripe) {
    return Promise.resolve(window.Stripe(publishableKey));
  }
  if (!stripeScriptPromise) {
    stripeScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        if (!window.Stripe) {
          reject(new Error('Stripe failed to load.'));
          return;
        }
        resolve(window.Stripe(publishableKey));
      };
      script.onerror = () => reject(new Error('Could not load Stripe.'));
      document.head.appendChild(script);
    });
  }
  return stripeScriptPromise;
}

function paymentFailureMessage(error?: { message?: string; type?: string; code?: string; decline_code?: string }) {
  const raw = `${error?.message || ''} ${error?.code || ''} ${error?.decline_code || ''}`.toLowerCase();
  if (
    error?.type === 'card_error' ||
    error?.type === 'validation_error' ||
    raw.includes('declin') ||
    raw.includes('incorrect') ||
    raw.includes('insufficient') ||
    raw.includes('expired') ||
    raw.includes('cvc')
  ) {
    return 'Sorry, payment did not go through. Please try again or use another card.';
  }
  return error?.message || 'Payment could not be completed. Please try again.';
}

export default function Upsell() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const {
    visitorName,
    visitorEmail,
    addOnAccepted,
    upsellAccepted,
    setSelectedProductKeys,
    setPurchaseDownloads,
  } = funnel;

  const initialSelection = useMemo(() => {
    const keys: ProductKey[] = ['workFromHomeBundle'];
    if (addOnAccepted) keys.push('websiteSeo');
    if (upsellAccepted) keys.push('aiAutomation');
    return [...new Set(keys)].length > 0 ? [...new Set(keys)] : fallbackSelected;
  }, [addOnAccepted, upsellAccepted]);

  const [selected, setSelected] = useState<ProductKey[]>(initialSelection);
  const [finalSaleAccepted, setFinalSaleAccepted] = useState(false);
  const [stripe, setStripe] = useState<StripeClient | null>(null);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchaseBubbleName, setPurchaseBubbleName] = useState('');
  const cardHostRef = useRef<HTMLDivElement | null>(null);

  const selectedProducts = checkoutProducts.filter((product) => selected.includes(product.key));
  const total = calculateBundleTotal(selected);
  const savings = 97 - total;
  const selectedCreditCount = ['websiteSeo', 'aiAutomation'].filter((key) => selected.includes(key as ProductKey)).length;
  const hasBestDeal = selected.includes('websiteSeo') && selected.includes('aiAutomation');
  const selectedOfferSummary = buildSelectedOfferSummary(selected);

  useEffect(() => {
    let cancelled = false;
    let mountedCard: StripeCardElement | null = null;

    getConfig()
      .then((config) => loadStripe(config.stripePublishableKey || ''))
      .then((stripeClient) => {
        if (cancelled || !cardHostRef.current) return;
        const elements = stripeClient.elements();
        const card = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              color: '#07192f',
              fontFamily: "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif",
              fontSize: '16px',
              fontWeight: '600',
              '::placeholder': { color: '#9db0c5' },
            },
            invalid: { color: '#b91c1c' },
          },
        });
        try {
          card.mount(cardHostRef.current);
        } catch (error) {
          try {
            card.destroy();
          } catch {
            // Ignore Stripe cleanup errors after a failed mount.
          }
          throw error;
        }
        mountedCard = card;
        setStripe(stripeClient);
        setCardElement(card);
        setIsReady(true);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(error.message || 'Payment setup is unavailable.');
          setIsReady(false);
        }
      });

    return () => {
      cancelled = true;
      if (mountedCard) {
        try {
          mountedCard.destroy();
        } catch {
          // Stripe may already have unmounted during navigation or hot reload.
        }
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: number;
    let index = 0;

    const showNextPurchase = () => {
      const name = socialProofNames[index % socialProofNames.length];
      index += 1;
      setPurchaseBubbleName(name);
      window.setTimeout(() => setPurchaseBubbleName(''), 4500);
      timeoutId = window.setTimeout(showNextPurchase, 14000 + Math.random() * 8000);
    };

    timeoutId = window.setTimeout(showNextPurchase, 7000 + Math.random() * 5000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function toggleProduct(productKey: ProductKey) {
    if (productKey === 'workFromHomeBundle') return;

    setSelected((current) => {
      if (current.includes(productKey)) {
        const next = current.filter((key) => key !== productKey);
        logFunnelEvent(
          'checkout_product_removed',
          buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: next }, {
            page: '/upsell',
            productKey,
            productName: checkoutProducts.find((product) => product.key === productKey)?.name || '',
            amount: formatMoney(calculateBundleTotal(next)),
            status: 'removed',
            metadata: { selectedProductKeys: next },
          }),
        );
        return next;
      }
      const next = [...current, productKey];
      logFunnelEvent(
        'checkout_product_added',
        buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: next }, {
          page: '/upsell',
          productKey,
          productName: checkoutProducts.find((product) => product.key === productKey)?.name || '',
          amount: formatMoney(calculateBundleTotal(next)),
          status: 'added',
          metadata: { selectedProductKeys: next },
        }),
      );
      return next;
    });
  }

  async function submitPayment() {
    if (isPaying) return;
    if (selectedProducts.length === 0) {
      setErrorMessage('Choose at least one product to continue.');
      return;
    }
    if (!stripe || !cardElement) {
      setErrorMessage('Payment is still loading. Please wait.');
      return;
    }
    if (!finalSaleAccepted) {
      setErrorMessage('Please agree that all purchases are final.');
      return;
    }
    setIsPaying(true);
    setErrorMessage('');
    logFunnelEvent(
      'checkout_payment_started',
      buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: selected }, {
        page: '/upsell',
        productKey: selected.join(','),
        productName: selectedProducts.map((product) => product.name).join(' + '),
        amount: formatMoney(total),
        status: 'started',
        metadata: { selectedProductKeys: selected },
      }),
    );

    try {
      const createResponse = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: selected,
          name: visitorName || undefined,
          email: visitorEmail || undefined,
        }),
      });
      const createData = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok || !createData.clientSecret) {
        throw new Error(createData.error || 'Payment setup failed.');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(createData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: visitorName || undefined,
            email: visitorEmail || undefined,
          },
        },
      });

      if (error) {
        setErrorMessage(paymentFailureMessage(error));
        logFunnelEvent(
          'checkout_payment_failed',
          buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: selected }, {
            page: '/upsell',
            productKey: selected.join(','),
            productName: selectedProducts.map((product) => product.name).join(' + '),
            amount: formatMoney(total),
            status: 'failed',
            metadata: { stripeError: error },
          }),
        );
        setIsPaying(false);
        return;
      }
      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setErrorMessage('Payment was not confirmed. Please try again.');
        logFunnelEvent(
          'checkout_payment_unconfirmed',
          buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: selected }, {
            page: '/upsell',
            productKey: selected.join(','),
            productName: selectedProducts.map((product) => product.name).join(' + '),
            amount: formatMoney(total),
            status: paymentIntent?.status || 'missing_payment_intent',
          }),
        );
        setIsPaying(false);
        return;
      }

      const confirmResponse = await fetch('/.netlify/functions/confirm-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: selected,
          paymentIntentId: paymentIntent.id,
        }),
      });
      const confirmData = await confirmResponse.json().catch(() => ({}));
      if (!confirmResponse.ok || !Array.isArray(confirmData.downloads)) {
        throw new Error(confirmData.error || 'Purchase confirmed, but downloads could not be prepared.');
      }

      setSelectedProductKeys(selected);
      setPurchaseDownloads(confirmData.downloads);
      logFunnelEvent(
        'checkout_payment_succeeded',
        buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: selected }, {
          page: '/upsell',
          productKey: selected.join(','),
          productName: selectedProducts.map((product) => product.name).join(' + '),
          amount: formatMoney(total),
          status: 'succeeded',
          metadata: {
            paymentIntentId: paymentIntent.id,
            downloadProductKeys: confirmData.downloads.map((download: { productKey: string }) => download.productKey),
          },
        }),
      );
      sessionStorage.setItem('selected_product_keys', JSON.stringify(selected));
      sessionStorage.setItem('purchase_downloads', JSON.stringify(confirmData.downloads));
      navigate('/thankyou');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected payment error.');
      setIsPaying(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <section className="relative mx-auto w-full max-w-[1020px] overflow-hidden rounded-[18px] bg-white text-[#15151d] shadow-[0_20px_46px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={() => navigate('/offer')}
          className="absolute right-5 top-5 z-20 grid h-8 w-8 place-items-center rounded-full border border-[#ececf2] bg-white text-[#333347] transition hover:bg-[#f7f7fb]"
          aria-label="Close checkout"
        >
          <X size={16} />
        </button>

        <div className="grid min-h-[560px] lg:grid-cols-[1fr_1fr]">
          <div className="p-5 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-black tracking-[-0.04em] text-black sm:text-4xl">Cart</h1>
            <p className="mt-2 max-w-[480px] text-sm font-semibold leading-relaxed text-[#7d7d88]">
              Your AI & Digital Skills Bundle is ready. Add Website + SEO and AI Automation to build a stronger remote-skill toolkit and unlock the full $50 instant bundle savings.
            </p>

            <div className="mt-5 grid gap-3">
              {checkoutProducts.map((product, index) => {
                const checked = selected.includes(product.key);
                const locked = product.key === 'workFromHomeBundle';
                const detailLabel = locked ? '$97' : checked ? 'Included Today' : 'Removed Today';
                const valueLabel = locked ? 'base access' : 'Value $25';
                const discount = locked ? 'locked' : 'value $25';
                return (
                  <div key={product.key} className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[10px] border border-[#ececf2] bg-white p-3 shadow-[0_8px_18px_rgba(20,20,30,0.035)] sm:grid-cols-[auto_1fr_auto]">
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.key)}
                      disabled={locked}
                      className={`grid h-7 w-7 place-items-center rounded-[5px] border transition ${
                        checked
                          ? 'border-[#302d49] bg-[#302d49] text-white'
                          : 'border-[#d6d6df] bg-white text-transparent hover:border-[#302d49]'
                      } ${locked ? 'cursor-not-allowed' : ''}`}
                      aria-pressed={checked}
                      aria-label={`${checked ? 'Remove' : 'Add'} ${product.name}`}
                    >
                      {locked ? <LockKeyhole size={13} /> : <Check size={15} strokeWidth={4} />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-black tracking-[-0.02em] text-[#1f1f27] sm:text-base">{product.name}</h2>
                        <span className="rounded-[6px] bg-[#302d49] px-2 py-1 text-[10px] font-black uppercase tracking-[0.04em] text-white">{discount}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold leading-snug text-[#92929e] sm:text-xs">
                        <span>{product.description}</span>
                      </div>
                    </div>

                    <div className="col-start-2 min-w-[90px] text-left sm:col-start-auto sm:text-right">
                      <div className="text-sm font-black text-[#1f1f27] sm:text-base">{detailLabel}</div>
                      <div className="mt-0.5 text-xs text-[#a0a0aa] sm:text-sm">{valueLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-[#ececf2] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-[#1f1f27]">Subtotal</span>
                <span className="text-base font-black text-[#1f1f27]">$97</span>
              </div>
            </div>

            <div className="mt-4 rounded-[10px] border border-[#ececf2] bg-[#f8f8fb] p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-black text-[#1f1f27]">Instant Bundle Savings</div>
                  <p className="mt-1 text-xs leading-relaxed text-[#8f8f9b] sm:text-sm">
                    {hasBestDeal
                      ? 'Best deal unlocked. Your full bundle discount is active today.'
                      : `Add ${2 - selectedCreditCount} more bundle item${2 - selectedCreditCount === 1 ? '' : 's'} to unlock the $47 total.`}
                  </p>
                </div>
                <div className="text-xl font-black text-[#25a67e] sm:text-2xl">-{formatMoney(savings)}</div>
              </div>
            </div>

            <div className="mt-4 border-t border-[#ececf2] pt-4">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-base font-black text-[#1f1f27]">Total Due Today</div>
                  <p className="mt-1 max-w-[280px] text-xs leading-snug text-[#a0a0aa] sm:text-sm">
                    AI & Digital Skills Bundle with your selected instant-access digital resources.
                  </p>
                </div>
                <div className="text-lg font-black text-[#1f1f27] sm:text-xl">{formatMoney(total)}</div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#ececf2] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black tracking-[-0.04em] text-black sm:text-2xl">Total due today</span>
                <span className="text-2xl font-black tracking-[-0.04em] text-black sm:text-3xl">{formatMoney(total)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ececf2] p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="overflow-hidden rounded-[12px] border border-[#ececf2] bg-[#f8f8fb] shadow-[0_12px_24px_rgba(20,20,30,0.06)]">
              <img src={productImage} alt="Digital product bundle preview" className="h-auto w-full object-cover" />
            </div>
            <p className="mt-3 text-xs font-semibold leading-relaxed text-[#777783] sm:text-sm">
              {selectedOfferSummary}
            </p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-base font-black text-[#1f1f27]">Credit card information</span>
                <span className="text-sm font-bold text-[#a0a0aa]">Stripe secured</span>
              </div>
              <div
                className="relative min-h-[56px] rounded-[10px] border border-[#ececf2] bg-white px-4 py-[19px] shadow-sm outline-none transition focus-within:border-[#302d49] focus-within:ring-4 focus-within:ring-[#302d49]/10"
              >
                <div ref={cardHostRef} />
                {!isReady && (
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#b2b2bc]">
                    Loading secure card field...
                  </div>
                )}
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-[10px] border border-[#ececf2] bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setFinalSaleAccepted((current) => {
                    const next = !current;
                    logFunnelEvent(
                      next ? 'final_sale_agreement_checked' : 'final_sale_agreement_unchecked',
                      buildFunnelTrackingPayload({ ...funnel, selectedProductKeys: selected }, {
                        page: '/upsell',
                        status: next ? 'checked' : 'unchecked',
                        metadata: { finalSaleAccepted: next },
                      }),
                    );
                    return next;
                  });
                }}
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
                  finalSaleAccepted ? 'border-[#302d49] bg-[#302d49] text-white' : 'border-[#d6d6df] bg-white text-transparent'
                }`}
                aria-pressed={finalSaleAccepted}
                aria-label="Agree that all purchases are final"
              >
                <Check size={10} strokeWidth={4} />
              </button>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.08em] text-[#1f1f27]">Digital Product Delivery</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[#777783]">
                  All products are delivered electronically after successful payment. Because this is an instant-access digital product, all sales are final.
                  No refunds, exchanges, credits, or cancellations are provided except where required by law. Payments are securely processed through Stripe.
                  We do not store your credit card information.
                </span>
              </span>
            </label>

            {errorMessage && (
              <div className="mt-6 rounded-[14px] border border-red-200 bg-red-50 p-3 text-center text-sm font-black text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              onClick={submitPayment}
              disabled={isPaying || selectedProducts.length === 0}
              className="mt-5 h-12 w-full rounded-[6px] bg-[#302d49] text-base font-semibold text-white transition hover:bg-[#25223a] disabled:pointer-events-none disabled:opacity-60"
            >
              {isPaying ? 'Processing...' : 'Get Instant Access'}
            </button>

            <div className="mt-4 rounded-[8px] border border-[#ececf2] bg-[#f8f8fb] px-3 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-[0.06em] text-[#1f1f27]">
                🔒 Secure Checkout Powered by Stripe
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-[#777783]">
                256-bit SSL Encryption • Instant Digital Delivery • Your Payment Information Is Never Stored on Our Servers
              </p>
            </div>
          </div>
        </div>
      </section>

      {purchaseBubbleName && (
        <div className="fixed bottom-5 left-5 z-50 flex h-20 w-[330px] animate-[slideUpPurchase_0.35s_ease-out] items-center justify-around gap-[15px] overflow-hidden rounded-[8px] bg-white px-[15px] py-[10px] shadow-[rgba(149,157,165,0.2)_0px_8px_24px]">
          <svg className="absolute left-[-31px] top-8 w-20 rotate-90 fill-[#04e4003a]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z" fillOpacity="1" />
          </svg>

          <div className="ml-2 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-[#04e40048]">
            <svg className="h-[17px] w-[17px] text-[#269b24]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
              <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
            </svg>
          </div>

          <div className="z-10 flex flex-1 flex-col items-start justify-center">
            <p className="m-0 text-[17px] font-bold text-[#269b24]">{purchaseBubbleName} just purchased</p>
            <p className="m-0 text-sm text-[#555]">Digital bundle unlocked</p>
          </div>

          <button
            type="button"
            onClick={() => setPurchaseBubbleName('')}
            className="z-10 text-[#555] transition hover:text-[#222]"
            aria-label="Dismiss purchase notification"
          >
            <svg className="h-[18px] w-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="none" stroke="currentColor" aria-hidden="true">
              <path fill="currentColor" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
