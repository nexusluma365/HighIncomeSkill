import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFunnel } from '@/hooks/useFunnel';

interface DownloadItem {
  productKey: string;
  productName: string;
  fileName: string;
  downloadUrl: string;
}

function readStoredDownloads() {
  try {
    if (sessionStorage.getItem('payment_confirmed') !== 'true') {
      return [];
    }

    const rawDownloads = sessionStorage.getItem('purchase_downloads');
    if (rawDownloads) {
      const parsed = JSON.parse(rawDownloads);
      if (Array.isArray(parsed)) {
        return (parsed as DownloadItem[]).filter((item) => item.downloadUrl && item.downloadUrl !== '#');
      }
    }
  } catch {
    return [];
  }

  return [];
}

export default function ThankYou() {
  const { purchaseDownloads } = useFunnel();
  const downloadFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: string; delay: number; duration: number; color: string }[]
  >([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 2,
      color: ['#0f7ee8', '#2458d8', '#ffffff', '#6bd1ff'][Math.floor(Math.random() * 4)],
    }));
    setConfettiPieces(pieces);
  }, []);

  const downloads = useMemo(() => {
    const confirmedDownloads = purchaseDownloads.filter((item) => item.downloadUrl && item.downloadUrl !== '#');
    if (confirmedDownloads.length > 0) return confirmedDownloads;
    const stored = readStoredDownloads();
    if (stored.length > 0) return stored;
    return [];
  }, [purchaseDownloads]);
  const hasConfirmedDownloads = downloads.length > 0;
  const openDownload = (downloadUrl: string) => {
    if (downloadFrameRef.current) {
      downloadFrameRef.current.src = downloadUrl;
    } else {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col pb-12 pt-8">
      <iframe ref={downloadFrameRef} title="Secure download" className="hidden" />
      {hasConfirmedDownloads && confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -50, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight, opacity: 0, rotate: 360 }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          className="pointer-events-none absolute top-0 z-0 h-4 w-2 rounded-sm"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
          }}
        />
      ))}

      {!hasConfirmedDownloads ? (
        <section className="relative z-10 mx-auto flex w-full max-w-[720px] flex-col items-center rounded-[8px] border border-[#d7e6f4] bg-white px-6 py-10 text-center shadow-[0_22px_60px_rgba(6,19,34,0.28)] sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#07192f] text-white">
            <LockKeyhole size={32} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0f7ee8]">Purchase Required</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-[-0.03em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-6xl">
            No Confirmed Payment Found
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-base font-semibold leading-relaxed text-[#425d78]">
            Downloads are only available after a successful checkout. Return to the offer page and complete payment to unlock your file.
          </p>
          <a
            href="/offer"
            className="mt-7 inline-flex min-h-[56px] items-center justify-center rounded-[4px] bg-[#0f7ee8] px-8 text-base font-black uppercase tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(15,126,232,0.35)] transition hover:bg-[#1594ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
          >
            Return To Offer
          </a>
        </section>
      ) : (
      <section className="relative z-10 mx-auto w-full max-w-[900px] overflow-hidden rounded-[8px] border border-[#d7e6f4] bg-white shadow-[0_22px_60px_rgba(6,19,34,0.28)]">
        <div className="bg-[#eef7ff] px-6 py-8 text-center sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#0f7ee8] text-white shadow-[0_16px_34px_rgba(15,126,232,0.3)]">
            <ShieldCheck size={34} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0f7ee8]">Payment confirmed</p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none tracking-[-0.04em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-7xl">
            Thank You For Your Purchase
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg font-semibold leading-relaxed text-[#425d78]">
            Your selected digital product download is ready. Keep a copy on your computer for your records.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid gap-4">
            {downloads.map((item) => (
              <button
                key={item.productKey}
                type="button"
                onClick={() => openDownload(item.downloadUrl)}
                className="group flex min-h-[96px] w-full items-center gap-4 rounded-[8px] bg-[#0f7ee8] px-4 py-5 text-left text-white shadow-[0_16px_34px_rgba(15,126,232,0.26)] transition hover:-translate-y-0.5 hover:bg-[#1594ff] sm:justify-between sm:gap-5 sm:px-6"
              >
                <span className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-white/16 sm:h-14 sm:w-14">
                    <Download size={28} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-2xl font-black uppercase leading-[1.05] tracking-[0.01em] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-3xl">
                      Start Download
                    </span>
                    <span className="mt-1 block text-sm font-bold leading-snug text-[#d7ecff] sm:text-base">{item.productName}</span>
                    <span className="mt-1 block break-words text-xs font-semibold leading-snug text-[#c7e6ff] sm:text-sm">{item.fileName}</span>
                  </span>
                </span>
                <span className="hidden text-4xl font-black transition group-hover:translate-x-1 sm:block">→</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-5">
            <Sparkles className="mt-0.5 shrink-0 text-[#0f7ee8]" size={24} />
            <p className="text-sm font-semibold leading-relaxed text-[#425d78]">
              Click the download button above, save the zip file to your computer, then open it and start with the first file inside. Your roadmap is ready when you are.
            </p>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
