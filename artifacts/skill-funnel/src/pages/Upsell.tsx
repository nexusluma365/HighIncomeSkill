import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import productImage from '@/assets/media/digital-bundle-combined.png';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

const offerProductKey = 'workFromHomeBundle';
const offerProductName = 'Work From Anywhere Bundle';
const offerAmount = '$47';

const bonuses = [
  'Complete Digital Skills Roadmap',
  'Client-ready Website + SEO path',
  'AI automation prompts and workflows',
  'Templates, scripts, and resource library',
  'Step-by-step launch blueprint',
  'Lifetime access to the training bundle',
];

function UpgradeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex min-h-[64px] w-full max-w-[760px] items-center justify-center bg-[#ff3145] px-5 py-4 text-center text-sm font-black uppercase leading-tight text-white shadow-[0_16px_32px_rgba(255,49,69,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ff4052] active:translate-y-0 sm:text-base"
    >
      <span>
        <span className="block">Yes! I Want The Work From Anywhere Bundle For Just $47</span>
        <span className="mt-1 block">Click Here For Lifetime Access, Templates, AI Prompts, And Launch Blueprint</span>
      </span>
    </button>
  );
}

export default function Upsell() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const { setSelectedProductKeys, setUpsellAccepted } = funnel;

  useEffect(() => {
    const hasPaidForRichRelationships = sessionStorage.getItem('payment_confirmed') === 'true';

    if (!hasPaidForRichRelationships) {
      navigate('/ebook', { replace: true });
      return;
    }

    logFunnelEvent(
      'one_click_upsell_view',
      buildFunnelTrackingPayload(funnel, {
        page: '/upsell',
        source: 'post_training',
        productKey: offerProductKey,
        productName: offerProductName,
        amount: offerAmount,
        status: 'viewed',
      }),
    );
  }, []);

  function acceptOffer() {
    const selectedKeys = ['richRelationshipsEbook', offerProductKey];

    setUpsellAccepted(true);
    setSelectedProductKeys(selectedKeys);
    sessionStorage.setItem('selected_product_keys', JSON.stringify(selectedKeys));
    sessionStorage.setItem('upsell_accepted', 'true');

    logFunnelEvent(
      'one_click_upsell_accepted',
      buildFunnelTrackingPayload({ ...funnel, upsellAccepted: true, selectedProductKeys: selectedKeys }, {
        page: '/upsell',
        source: 'post_training',
        productKey: offerProductKey,
        productName: offerProductName,
        amount: offerAmount,
        status: 'accepted',
      }),
    );

    navigate('/thankyou');
  }

  return (
    <div className="min-h-screen bg-white text-[#082b36]">
      <section className="bg-[#062b35] px-5 py-7 sm:px-8">
        <UpgradeButton onClick={acceptOffer} />
      </section>

      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ff3145]">
              Special one-time upgrade
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[1.02] text-[#073443] sm:text-5xl">
              For Just $47 You Get The Complete Work From Anywhere Bundle
            </h1>
            <div className="mt-6 space-y-4 text-base font-semibold leading-relaxed text-[#1d3d46]">
              <p>
                You just finished the Rich Relationships training. Now add the practical digital skill system that helps you turn conversations into clear offers, useful assets, and paid opportunities.
              </p>
              <p>
                This upgrade gives you the roadmap, templates, prompts, and client paths in one place so you can move from learning to building without guessing what to do next.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[560px]">
            <img
              src={productImage}
              alt="Work From Anywhere Bundle product preview"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#e8f4f6] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-3xl font-black uppercase leading-tight text-[#073443] sm:text-4xl">
            Upgrade To The Work From Anywhere Experience And Get:
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {bonuses.map((bonus) => (
              <div key={bonus} className="flex min-h-[70px] items-center gap-3 bg-white px-5 py-4 shadow-[0_12px_24px_rgba(8,43,54,0.08)]">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[#dfc760]" />
                <p className="text-sm font-black leading-snug text-[#123b46] sm:text-base">{bonus}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xl font-black uppercase leading-tight text-[#073443]">
            Get the system that turns relationship momentum into a skill-based income path.
          </p>
          <p className="mt-3 text-center text-sm font-black text-[#1d3d46]">
            When you upgrade as a Work From Anywhere member
          </p>

          <div className="mt-7">
            <UpgradeButton onClick={acceptOffer} />
          </div>
        </div>
      </section>

      <section className="bg-[#062b35] px-5 py-14 text-white sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-3xl font-black uppercase leading-tight text-[#e8d46c] sm:text-4xl">
              Bundle Access Warning
            </h2>
            <p className="mt-6 max-w-[560px] text-base font-semibold leading-relaxed text-white/82">
              This upgrade is shown only after your Rich Relationships purchase and training step. Once you leave this page, the $47 member upgrade may not be available again in this flow.
            </p>
            <div className="mt-8 max-w-[560px] bg-[#f1d96f] p-4 text-center text-[#082b36]">
              <button
                type="button"
                onClick={acceptOffer}
                className="w-full text-sm font-black uppercase leading-tight transition hover:opacity-80 sm:text-base"
              >
                Yes! I Want The Work From Anywhere Experience
                <span className="mt-1 block text-xs font-bold normal-case sm:text-sm">
                  Click here for lifetime access, templates, prompts, and launch blueprint.
                </span>
              </button>
            </div>
          </div>

          <img
            src={productImage}
            alt="Digital product bundle preview"
            className="mx-auto h-auto w-full max-w-[560px] object-contain"
          />
        </div>
      </section>

      <section className="px-5 py-14 text-center sm:px-8">
        <p className="text-sm font-black uppercase text-[#ff3145]">
          For those who skip to the bottom, here is the summary:
        </p>
        <h2 className="mx-auto mt-4 max-w-[900px] text-3xl font-black uppercase leading-tight text-[#073443] sm:text-4xl">
          Everything You Get When You Upgrade Today
        </h2>
        <p className="mx-auto mt-5 max-w-[760px] text-base font-semibold leading-relaxed text-[#1d3d46]">
          Lifetime access to the Work From Anywhere Bundle, client path templates, AI automation resources, scripts, prompts, checklists, and a clear action plan for turning your new relationship skills into real offers.
        </p>
        <div className="mt-8">
          <UpgradeButton onClick={acceptOffer} />
        </div>
      </section>
    </div>
  );
}
