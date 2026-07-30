import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  BookOpen,
  Download,
  HelpCircle,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, getFunnelSessionId, logFunnelEvent } from '@/utils/funnelTracking';

type EbookStripeElementType = 'card' | 'cardNumber' | 'cardExpiry' | 'cardCvc';

interface EbookStripeCardElement {
  mount: (selectorOrElement: string | HTMLElement) => void;
  destroy: () => void;
}

interface EbookStripeElements {
  create: (type: EbookStripeElementType, options?: Record<string, unknown>) => EbookStripeCardElement;
}

interface EbookStripeClient {
  elements: () => EbookStripeElements;
  confirmCardPayment: (
    clientSecret: string,
    options: {
      payment_method: {
        card: EbookStripeCardElement;
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

const productKey = 'richRelationshipsEbook';
const productName = 'Rich Relationships Ebook';
const productPrice = '$27';

let stripeScriptPromise: Promise<EbookStripeClient> | null = null;

function getStripeFactory() {
  return (window as Window & { Stripe?: (publishableKey: string) => EbookStripeClient }).Stripe;
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
    return Promise.reject(new Error('Payment setup is unavailable right now.'));
  }
  const existingStripe = getStripeFactory();
  if (existingStripe) {
    return Promise.resolve(existingStripe(publishableKey));
  }
  if (!stripeScriptPromise) {
    stripeScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => {
        const stripeFactory = getStripeFactory();
        if (!stripeFactory) {
          reject(new Error('Stripe failed to load.'));
          return;
        }
        resolve(stripeFactory(publishableKey));
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// The 3 stages the CTA button walks through on click:
//   1. paying      -> confirm the card payment with Stripe
//   2. delivering  -> ask the backend to email the ebook to the address on file
//   3. redirecting -> hand off to the next step
type PaymentStage = 'idle' | 'paying' | 'delivering' | 'redirecting';

const STAGE_LABEL: Record<PaymentStage, string> = {
  idle: 'Send me This Ebook',
  paying: 'Confirming Payment...',
  delivering: 'Emailing Your Ebook...',
  redirecting: 'Redirecting...',
};

const ELEMENT_STYLE = {
  base: {
    color: '#f5f5f4',
    fontFamily: "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'left',
    '::placeholder': { color: '#6b6b6b' },
  },
  invalid: { color: '#ff6b4a' },
};

const CARD_BRANDS = [
  { name: 'Visa', icon: FaCcVisa },
  { name: 'Mastercard', icon: FaCcMastercard },
  { name: 'American Express', icon: FaCcAmex },
  { name: 'Discover', icon: FaCcDiscover },
];

export default function EbookCheckout() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const {
    visitorName,
    visitorEmail,
    setVisitorName,
    setVisitorEmail,
    setSelectedProductKeys,
    setPurchaseDownloads,
  } = funnel;
  const [name, setName] = useState(visitorName);
  const [email, setEmail] = useState(visitorEmail);
  const [stripe, setStripe] = useState<EbookStripeClient | null>(null);
  const [cardNumberElement, setCardNumberElement] = useState<EbookStripeCardElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [stage, setStage] = useState<PaymentStage>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldShakeButton, setShouldShakeButton] = useState(false);
  const cardNumberRef = useRef<HTMLDivElement | null>(null);
  const cardExpiryRef = useRef<HTMLDivElement | null>(null);
  const cardCvcRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<HTMLDivElement | null>(null);

  const isPaying = stage !== 'idle';

  function triggerButtonShake() {
    setShouldShakeButton(false);
    window.setTimeout(() => setShouldShakeButton(true), 0);
    window.setTimeout(() => setShouldShakeButton(false), 420);
  }

  useEffect(() => {
    let cancelled = false;
    const mounted: EbookStripeCardElement[] = [];

    getConfig()
      .then((config) => loadStripe(config.stripePublishableKey || ''))
      .then((stripeClient) => {
        if (cancelled || !cardNumberRef.current || !cardExpiryRef.current || !cardCvcRef.current) return;
        const elements = stripeClient.elements();

        const cardNumber = elements.create('cardNumber', { style: ELEMENT_STYLE, showIcon: true });
        const cardExpiry = elements.create('cardExpiry', { style: ELEMENT_STYLE });
        const cardCvc = elements.create('cardCvc', { style: ELEMENT_STYLE });

        try {
          cardNumber.mount(cardNumberRef.current);
          cardExpiry.mount(cardExpiryRef.current);
          cardCvc.mount(cardCvcRef.current);
        } catch (error) {
          [cardNumber, cardExpiry, cardCvc].forEach((element) => {
            try {
              element.destroy();
            } catch {
              // Stripe may already be cleaning up during hot reload.
            }
          });
          throw error;
        }

        mounted.push(cardNumber, cardExpiry, cardCvc);
        setStripe(stripeClient);
        setCardNumberElement(cardNumber);
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
      mounted.forEach((element) => {
        try {
          element.destroy();
        } catch {
          // Ignore Stripe cleanup errors after navigation.
        }
      });
    };
  }, []);

  // Stage 3: hand off to whatever comes after a successful purchase + email delivery.
  // Wire this up in VSCode — e.g. swap the navigate() target, add a modal, fire an
  // onboarding webhook, etc. Everything above it (payment + email) is already done
  // by the time this runs.
  function goToNextStep() {
    setStage('redirecting');
    navigate('/thankyou');
  }

  async function submitPayment() {
    if (isPaying) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !isValidEmail(cleanEmail)) {
      setErrorMessage('Name and a valid email address are required.');
      triggerButtonShake();
      return;
    }
    if (!stripe || !cardNumberElement) {
      setErrorMessage('Payment is still loading. Please wait.');
      triggerButtonShake();
      return;
    }

    setErrorMessage('');
    setVisitorName(cleanName);
    setVisitorEmail(cleanEmail);
    const sessionId = getFunnelSessionId();
    sessionStorage.removeItem('payment_confirmed');
    sessionStorage.removeItem('purchase_downloads');
    sessionStorage.removeItem('selected_product_keys');
    sessionStorage.removeItem('original_payment_intent_id');
    logFunnelEvent(
      'ebook_checkout_payment_started',
      buildFunnelTrackingPayload({ ...funnel, visitorName: cleanName, visitorEmail: cleanEmail, selectedProductKeys: [productKey] }, {
        page: '/ebook-checkout',
        productKey,
        productName,
        amount: productPrice,
        status: 'started',
      }),
    );

    // --- Stage 1: confirm payment ---------------------------------------
    setStage('paying');
    try {
      const createResponse = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: [productKey],
          name: cleanName,
          email: cleanEmail,
          sessionId,
        }),
      });
      const createData = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok || !createData.clientSecret) {
        throw new Error(createData.error || 'Payment setup failed.');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(createData.clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cleanName,
            email: cleanEmail,
          },
        },
      });

      if (error) {
        setErrorMessage(paymentFailureMessage(error));
        triggerButtonShake();
        logFunnelEvent(
          'ebook_checkout_payment_failed',
          buildFunnelTrackingPayload({ ...funnel, visitorName: cleanName, visitorEmail: cleanEmail, selectedProductKeys: [productKey] }, {
            page: '/ebook-checkout',
            productKey,
            productName,
            amount: productPrice,
            status: 'failed',
            metadata: { stripeError: error },
          }),
        );
        setStage('idle');
        return;
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setErrorMessage('Payment was not confirmed. Please try again.');
        triggerButtonShake();
        setStage('idle');
        return;
      }

      // --- Stage 2: email the ebook to the address on file ------------
      setStage('delivering');
      const confirmResponse = await fetch('/.netlify/functions/confirm-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: [productKey],
          paymentIntentId: paymentIntent.id,
          sessionId,
          // Tells the backend where to send the ebook. Your confirm-purchase
          // function should email a download link to this address.
          deliverTo: cleanEmail,
        }),
      });
      const confirmData = await confirmResponse.json().catch(() => ({}));
      if (!confirmResponse.ok || !Array.isArray(confirmData.downloads)) {
        throw new Error(confirmData.error || 'Purchase confirmed, but your download could not be prepared.');
      }

      setSelectedProductKeys([productKey]);
      setPurchaseDownloads(confirmData.downloads);
      logFunnelEvent(
        'ebook_checkout_payment_succeeded',
        buildFunnelTrackingPayload({ ...funnel, visitorName: cleanName, visitorEmail: cleanEmail, selectedProductKeys: [productKey] }, {
          page: '/ebook-checkout',
          productKey,
          productName,
          amount: productPrice,
          status: 'succeeded',
          metadata: {
            paymentIntentId: paymentIntent.id,
            downloadProductKeys: confirmData.downloads.map((download: { productKey: string }) => download.productKey),
            emailedTo: cleanEmail,
          },
        }),
      );
      sessionStorage.setItem('selected_product_keys', JSON.stringify([productKey]));
      sessionStorage.setItem('purchase_downloads', JSON.stringify(confirmData.downloads));
      sessionStorage.setItem('payment_confirmed', 'true');
      sessionStorage.setItem('original_payment_intent_id', paymentIntent.id);

      // --- Stage 3: next step ------------------------------------------
      goToNextStep();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected payment error.');
      triggerButtonShake();
      setStage('idle');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>
        {`
          @keyframes checkout-button-shake {
            0%, 100% { transform: translateX(0); }
            18% { transform: translateX(-8px); }
            36% { transform: translateX(8px); }
            54% { transform: translateX(-6px); }
            72% { transform: translateX(6px); }
          }
        `}
      </style>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.98)_0%,rgba(13,13,13,0.92)_43%,rgba(13,13,13,0.4)_100%)]" />
        <div className="absolute right-0 top-0 hidden h-full w-[52%] bg-[url('/assets/rich-relationships-ebook.png')] bg-contain bg-center bg-no-repeat opacity-95 lg:block" />
        <div
          ref={checkoutRef}
          className="relative z-10 mx-auto grid w-full max-w-[1180px] items-start gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-16"
        >
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold italic tracking-[0.01em] text-[#f0a93a]">
              <LockKeyhole size={16} />
              Secure Checkout
            </div>
            <h1 className="max-w-[520px] text-4xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
              Complete Your Purchase
            </h1>
            <p className="mt-4 max-w-[480px] text-base font-medium leading-relaxed text-white/70 sm:text-lg">
              You're one step away from building{' '}
              <span className="text-[#f0a93a]">stronger relationships</span> and a better future.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="mr-1 text-sm font-medium text-white/70">Secure payment</span>
              {CARD_BRANDS.map((brand) => (
                <span
                  key={brand.name}
                  className="grid h-8 min-w-[52px] place-items-center rounded-[4px] bg-white px-2 text-[#151515]"
                  aria-label={brand.name}
                  title={brand.name}
                >
                  <brand.icon size={34} aria-hidden="true" />
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <div className="relative flex min-h-[54px] items-center gap-3 rounded-[8px] border border-white/12 bg-[#151515] px-4 text-left">
                <div ref={cardNumberRef} className="min-w-0 flex-1 pr-8 text-left" />
                {!isReady && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-left text-[15px] font-medium text-white/40">Card number</span>}
                <LockKeyhole className="shrink-0 text-white/40" size={18} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex min-h-[54px] items-center rounded-[8px] border border-white/12 bg-[#151515] px-4 text-left">
                  <div ref={cardExpiryRef} className="min-w-0 flex-1 text-left" />
                  {!isReady && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-left text-[15px] font-medium text-white/40">MM / YY</span>}
                </div>
                <div className="relative flex min-h-[54px] items-center gap-2 rounded-[8px] border border-white/12 bg-[#151515] px-4 text-left">
                  <div ref={cardCvcRef} className="min-w-0 flex-1 pr-7 text-left" />
                  {!isReady && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-left text-[15px] font-medium text-white/40">CVC</span>}
                  <HelpCircle className="shrink-0 text-white/40" size={18} />
                </div>
              </div>

              <div className="flex min-h-[54px] items-center gap-3 rounded-[8px] border border-white/12 bg-[#151515] px-4">
                <User className="shrink-0 text-white/40" size={20} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name on card"
                  autoComplete="cc-name"
                  disabled={isPaying}
                  className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/40"
                />
              </div>

              <div className="flex min-h-[54px] items-center gap-3 rounded-[8px] border border-white/12 bg-[#151515] px-4">
                <Mail className="shrink-0 text-white/40" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  disabled={isPaying}
                  className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/40"
                />
              </div>

              {errorMessage && (
                <div className="rounded-[8px] border border-white/12 bg-[#151515] p-3 text-center text-sm font-semibold text-white">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                onClick={submitPayment}
                disabled={isPaying}
                className={`flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#dc2626] px-5 text-center text-[15px] font-black uppercase tracking-[0.01em] text-white transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-70 ${
                  shouldShakeButton ? '[animation:checkout-button-shake_0.38s_ease-in-out]' : ''
                }`}
              >
                {isPaying && <LoaderCircle className="h-5 w-5 animate-spin" />}
                {STAGE_LABEL[stage]}
              </button>

              <p className="mt-1 flex items-center justify-center gap-2 text-center text-sm font-medium text-white/50">
                <LockKeyhole size={15} />
                Your payment is 100% secure and encrypted.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block" aria-hidden="true" />
        </div>
      </section>

      <section className="bg-[#0d0d0d] px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Instant Access', copy: 'Get immediate access after purchase' },
            { icon: Download, title: 'Download & Read', copy: 'Read on any device, anytime, anywhere' },
            { icon: ShieldCheck, title: '100% Secure', copy: 'Your payment is safe and encrypted' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#2a1d0f] text-[#f0a93a]">
                  <Icon size={26} />
                </span>
                <span>
                  <span className="block text-base font-bold text-white">{item.title}</span>
                  <span className="mt-0.5 block text-sm font-medium leading-snug text-white/60">{item.copy}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mb-8 w-[calc(100%-2.5rem)] max-w-[1180px] rounded-[10px] border border-white/10 bg-[#111111] px-5 py-9 text-white sm:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
          Your Next Opportunity Could Come From One Conversation
        </h2>

        <div className="mx-auto mt-7 grid max-w-[1080px] gap-5 md:grid-cols-3">
          {[
            {
              title: 'Walk Into Every Room With Confidence',
              copy: 'Know exactly how to approach, connect with, and leave a lasting impression on influential people.',
            },
            {
              title: 'Build Relationships That Open Doors',
              copy: "Learn timeless principles used by successful entrepreneurs, executives, and leaders to create opportunities money alone can't buy.",
            },
            {
              title: 'Create a Network That Changes Your Future',
              copy: 'Your income, business, and success are often one relationship away. Learn how to become the person people genuinely want to help.',
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start justify-center gap-4 text-base font-medium leading-snug text-white/85 md:justify-start">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] bg-[#ef4b1e] text-white">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>
                <span className="block font-black text-white">{item.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-white/65">{item.copy}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[820px] items-center gap-5 rounded-[8px] border border-white/10 bg-[#0d0d0d] px-6 py-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-[#e0b23a] text-center">
            <span className="text-[10px] font-black leading-none text-[#e0b23a]">30</span>
            <span className="text-[9px] font-bold leading-tight text-[#e0b23a]">DAYS</span>
          </div>
          <div>
            <div className="text-base font-black text-[#e0b23a]">30-Day Satisfaction Guarantee</div>
            <p className="mt-1 text-sm font-medium leading-snug text-white/65">
              If this ebook doesn't add value to your life, let us know within 30 days and we'll make it right.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
