import { useEffect, useMemo } from 'react';
import { Download as DownloadIcon, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/hooks/useFunnel';
import type { PurchaseDownload } from '@/context/FunnelContext';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

function getStoredDownloads() {
  try {
    const stored = sessionStorage.getItem('purchase_downloads');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as PurchaseDownload[] : [];
  } catch {
    return [];
  }
}

export default function Download() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const downloads = useMemo(() => {
    const bundleDownloads = funnel.purchaseDownloads.filter((download) => download.productKey === 'workFromHomeBundle');
    if (bundleDownloads.length > 0) return bundleDownloads;

    return getStoredDownloads().filter((download) => download.productKey === 'workFromHomeBundle');
  }, [funnel.purchaseDownloads]);
  const bundleDownload = downloads[0];

  useEffect(() => {
    if (!bundleDownload) {
      navigate('/thankyou', { replace: true });
      return;
    }

    logFunnelEvent(
      'digital_bundle_download_page_view',
      buildFunnelTrackingPayload(funnel, {
        page: '/download',
        source: 'one_click_upsell',
        productKey: bundleDownload.productKey,
        productName: bundleDownload.productName,
        status: 'viewed',
      }),
    );
  }, [bundleDownload]);

  function handleDownloadClick() {
    if (!bundleDownload) return;

    logFunnelEvent(
      'digital_bundle_download_click',
      buildFunnelTrackingPayload(funnel, {
        page: '/download',
        source: 'one_click_upsell',
        productKey: bundleDownload.productKey,
        productName: bundleDownload.productName,
        status: 'clicked',
      }),
    );
  }

  if (!bundleDownload) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#062b35] px-5 py-10 text-white sm:px-8">
      <section className="mx-auto w-full max-w-[920px] overflow-hidden rounded-xl bg-white text-center text-[#082b36] shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
        <div className="bg-[#eef7ff] px-5 py-10 sm:px-10 sm:py-14">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#0f7ee8] text-white shadow-[0_16px_34px_rgba(15,126,232,0.3)]">
            <ShieldCheck size={42} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0f7ee8]">
            Upgrade Confirmed
          </p>
          <h1 className="mx-auto mt-4 max-w-[780px] text-4xl font-black uppercase leading-tight text-[#073443] sm:text-5xl">
            Your Upgrade Is Complete!
          </h1>
          <div className="mx-auto mt-5 max-w-[720px] space-y-4 text-base font-semibold leading-relaxed text-[#31505a] sm:text-lg">
            <p>
              You now have everything you need to turn your new relationships into valuable skills, powerful offers, and paying clients.
            </p>
            <p>
              Your complete Digital Skills Bundle is ready. Click below to unlock your tools and start building.
            </p>
          </div>
        </div>

        <div className="px-5 py-9 sm:px-10 sm:py-12">
          <a
            href={bundleDownload.downloadUrl}
            onClick={handleDownloadClick}
            className="mx-auto inline-flex min-h-[76px] w-full max-w-[720px] items-center justify-center gap-3 rounded-xl bg-[#0f7ee8] px-5 py-5 text-center text-base font-black uppercase leading-tight text-white shadow-[0_18px_40px_rgba(15,126,232,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1594ff] sm:text-xl"
          >
            <DownloadIcon className="h-6 w-6 shrink-0" />
            Download MY DIGITAL SKILLS BUNDLE
          </a>
          <p className="mx-auto mt-5 max-w-[620px] text-sm font-semibold leading-relaxed text-[#5d7580]">
            If the download does not begin, press the button again. Your secure claim link is time limited.
          </p>
        </div>
      </section>
    </main>
  );
}
