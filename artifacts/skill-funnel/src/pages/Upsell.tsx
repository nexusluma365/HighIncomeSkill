import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
} from 'lucide-react';
import productImage from '@/assets/media/digital-bundle-combined.png';
import { useFunnel } from '@/hooks/useFunnel';
import {
  buildFunnelTrackingPayload,
  logFunnelEvent,
} from '@/utils/funnelTracking';

const offerProductKey = 'workFromHomeBundle';
const offerProductName = 'Work From Anywhere Bundle';
const offerAmount = '$97';

const includedTools = [
  'A clear roadmap for turning conversations into paid opportunities',
  'Client-ready website, funnel, and digital-service paths',
  'AI prompts and workflows that remove the guesswork',
  'Ready-to-use offer templates, scripts, and checklists',
  'A step-by-step plan for finding and helping your first client',
  'Lifetime access to the complete digital training bundle',
];

export default function Upsell() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const { setSelectedProductKeys, setUpsellAccepted } = funnel;

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const hasPaidForRichRelationships =
      sessionStorage.getItem('payment_confirmed') === 'true';

    if (!hasPaidForRichRelationships) {
      navigate('/ebook', { replace: true });
      return;
    }

    logFunnelEvent(
      'one_click_upsell_view',
      buildFunnelTrackingPayload(funnel, {
        page: '/upsell',
        source: 'post_purchase',
        productKey: offerProductKey,
        productName: offerProductName,
        amount: offerAmount,
        status: 'viewed',
      }),
    );
  }, []);

  async function acceptOffer() {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const selectedKeys = [
        'richRelationshipsEbook',
        offerProductKey,
      ];

      /*
       * IMPORTANT:
       * Connect your secure one-click Stripe upsell endpoint here.
       *
       * The backend should:
       * 1. Verify the original paid order.
       * 2. Retrieve the authorized Stripe customer/payment method.
       * 3. Charge exactly $97.
       * 4. Return a verified success response.
       *
       * Example:
       *
       * const response = await fetch('/api/accept-upsell', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *   },
       *   body: JSON.stringify({
       *     productKey: offerProductKey,
       *     amount: 9700,
       *     currency: 'usd',
       *   }),
       * });
       *
       * if (!response.ok) {
       *   throw new Error('The additional purchase could not be completed.');
       * }
       */

      setUpsellAccepted(true);
      setSelectedProductKeys(selectedKeys);

      sessionStorage.setItem(
        'selected_product_keys',
        JSON.stringify(selectedKeys),
      );
      sessionStorage.setItem('upsell_accepted', 'true');

      logFunnelEvent(
        'one_click_upsell_accepted',
        buildFunnelTrackingPayload(
          {
            ...funnel,
            upsellAccepted: true,
            selectedProductKeys: selectedKeys,
          },
          {
            page: '/upsell',
            source: 'post_purchase',
            productKey: offerProductKey,
            productName: offerProductName,
            amount: offerAmount,
            status: 'accepted',
          },
        ),
      );

      navigate('/thankyou');
    } catch (error) {
      console.error('Upsell purchase failed:', error);

      logFunnelEvent(
        'one_click_upsell_failed',
        buildFunnelTrackingPayload(funnel, {
          page: '/upsell',
          source: 'post_purchase',
          productKey: offerProductKey,
          productName: offerProductName,
          amount: offerAmount,
          status: 'failed',
        }),
      );

      setIsProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#082b36]">
      <section className="relative overflow-hidden bg-[#062b35] px-5 py-12 text-white sm:px-8 sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#e8d46c]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8d46c]/30 bg-[#e8d46c]/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-[#e8d46c]" />

              <p className="text-xs font-black uppercase tracking-[0.13em] text-[#f4e797] sm:text-sm">
                Your ebook is on the way
              </p>
            </div>

            <h1 className="mt-6 max-w-[720px] text-4xl font-black uppercase leading-[0.98] sm:text-5xl lg:text-[60px]">
              Now Turn Your New Relationships Into Paying Clients
            </h1>

            <p className="mt-6 max-w-[680px] text-lg font-semibold leading-relaxed text-white/85 sm:text-xl">
              The ebook shows you how to build stronger relationships. This
              complete system gives you the tools to turn those relationships
              into real offers, paying clients, and new ways to earn.
            </p>

            <p className="mt-5 max-w-[680px] text-base font-bold leading-relaxed text-[#f4e797] sm:text-lg">
              No starting from scratch. No wondering what to offer. No guessing
              what to do next.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[520px]">
            <img
              src={productImage}
              alt="Work From Anywhere Bundle with digital tools, templates, prompts, and training"
              className="h-auto w-full object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[980px]">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ff3145]">
              Complete the next step
            </p>

            <h2 className="mx-auto mt-4 max-w-[850px] text-3xl font-black uppercase leading-tight text-[#073443] sm:text-4xl">
              You Built The Relationship. Now You Need A Simple Way To Create
              The Opportunity.
            </h2>

            <p className="mx-auto mt-5 max-w-[760px] text-base font-semibold leading-relaxed text-[#31505a] sm:text-lg">
              Get the roadmap, tools, prompts, and ready-to-use resources that
              help you move naturally from meeting the right people to offering
              something valuable they can pay you for.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {includedTools.map((item) => (
              <div
                key={item}
                className="flex min-h-[88px] items-center gap-4 rounded-xl border border-[#dcecee] bg-[#f7fbfc] px-5 py-5"
              >
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[#c4a92f]" />

                <p className="text-sm font-black leading-snug text-[#123b46] sm:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf5f6] px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="text-3xl font-black uppercase leading-tight text-[#073443] sm:text-4xl">
            Everything Is Already Laid Out For You
          </h2>

          <p className="mx-auto mt-5 max-w-[760px] text-base font-semibold leading-relaxed text-[#31505a] sm:text-lg">
            Choose what you want to offer, follow the steps, use the included
            templates, and start turning the relationships you build into
            income-producing opportunities.
          </p>

          <div className="mx-auto mt-8 max-w-[780px] rounded-2xl bg-white px-6 py-7 shadow-[0_18px_50px_rgba(8,43,54,0.1)] sm:px-9">
            <p className="text-xl font-black uppercase leading-tight text-[#073443] sm:text-2xl">
              Your Relationships Open The Door.
            </p>

            <p className="mt-2 text-xl font-black uppercase leading-tight text-[#c0a229] sm:text-2xl">
              These Tools Show You What To Do Next.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#062b35] px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#e8d46c]">
            One simple next step
          </p>

          <h2 className="mx-auto mt-4 max-w-[820px] text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
            Turn What You Learned Into Something You Can Use
          </h2>

          <p className="mx-auto mt-5 max-w-[720px] text-base font-semibold leading-relaxed text-white/80 sm:text-lg">
            Add the complete system to your purchase and get immediate access
            to the tools that help turn conversations into clients, offers, and
            income.
          </p>

          <div className="mx-auto mt-9 max-w-[780px]">
            <button
              type="button"
              onClick={acceptOffer}
              disabled={isProcessing}
              aria-describedby="upsell-charge-disclosure"
              className="group flex min-h-[76px] w-full items-center justify-center rounded-xl bg-[#ff3145] px-5 py-5 text-center text-base font-black uppercase leading-tight text-white shadow-[0_18px_40px_rgba(255,49,69,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff4052] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:text-lg"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-3">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Processing My Access...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  Yes-Show Me How To Turn Relationships Into Paying Clients
                  <ArrowRight className="hidden h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
                </span>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-white/70">
              <LockKeyhole className="h-4 w-4 shrink-0" />

              <p className="text-xs font-bold">
                Secure one-click order upgrade
              </p>
            </div>

            <p
              id="upsell-charge-disclosure"
              className="mx-auto mt-4 max-w-[720px] text-[11px] font-medium leading-relaxed text-white/60 sm:text-xs"
            >
              By clicking the button above, you authorize us to automatically
              charge the payment method used for your original order an
              additional $97 for the Work From Anywhere Bundle. Your click
              confirms your agreement to this additional charge. You will
              receive immediate access after the payment is approved. All sales
              are final, except where a refund or cancellation right is
              required by applicable law.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
