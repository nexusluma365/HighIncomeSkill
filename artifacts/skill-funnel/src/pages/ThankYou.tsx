import { useEffect, useMemo, useState } from 'react';
import { Download, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFunnel } from '@/hooks/useFunnel';

interface DownloadItem {
  productKey: string;
  productName: string;
  fileName: string;
  downloadUrl: string;
}

const fallbackProducts: Record<string, DownloadItem> = {
  workFromHomeBundle: {
    productKey: 'workFromHomeBundle',
    productName: 'AI & Digital Skills Bundle',
    fileName: 'AI Digital Skills Bundle.zip',
    downloadUrl: '#',
  },
  websiteSeo: {
    productKey: 'websiteSeo',
    productName: 'Website + SEO Client Path',
    fileName: 'Website SEO Template.zip',
    downloadUrl: '#',
  },
  aiAutomation: {
    productKey: 'aiAutomation',
    productName: 'AI Automation System',
    fileName: 'AI Automation Toolkit.zip',
    downloadUrl: '#',
  },
};

function readStoredDownloads() {
  try {
    const rawDownloads = sessionStorage.getItem('purchase_downloads');
    if (rawDownloads) {
      const parsed = JSON.parse(rawDownloads);
      if (Array.isArray(parsed)) {
        return parsed as DownloadItem[];
      }
    }

    const rawKeys = sessionStorage.getItem('selected_product_keys');
    if (rawKeys) {
      const keys = JSON.parse(rawKeys);
      if (Array.isArray(keys)) {
        return keys.map((key) => fallbackProducts[key]).filter(Boolean);
      }
    }
  } catch {
    return [];
  }

  return [];
}

export default function ThankYou() {
  const { purchaseDownloads, selectedProductKeys } = useFunnel();
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
    if (purchaseDownloads.length > 0) return purchaseDownloads;
    const stored = readStoredDownloads();
    if (stored.length > 0) return stored;
    return selectedProductKeys.map((key) => fallbackProducts[key]).filter(Boolean);
  }, [purchaseDownloads, selectedProductKeys]);

  return (
    <div className="relative flex min-h-screen flex-col pb-12 pt-8">
      {confettiPieces.map((piece) => (
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
            Your selected digital product downloads are ready. Keep a copy on your computer for your records.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {downloads.length > 0 ? (
            <div className="grid gap-4">
              {downloads.map((item) => (
                <a
                  key={item.productKey}
                  href={item.downloadUrl}
                  download={item.fileName}
                  className="group flex min-h-[96px] items-center justify-between gap-5 rounded-[8px] bg-[#0f7ee8] px-6 py-5 text-white shadow-[0_16px_34px_rgba(15,126,232,0.26)] transition hover:-translate-y-0.5 hover:bg-[#1594ff]"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[8px] bg-white/16">
                      <Download size={30} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xl font-black uppercase leading-tight [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-3xl">
                        Download {item.productName}
                      </span>
                      <span className="mt-1 block truncate text-sm font-bold text-[#d7ecff]">{item.fileName}</span>
                    </span>
                  </span>
                  <span className="hidden text-4xl font-black transition group-hover:translate-x-1 sm:block">→</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-6 text-center">
              <p className="font-black text-[#07192f]">Your purchase is confirmed.</p>
              <p className="mt-2 text-sm font-semibold text-[#425d78]">
                If your download buttons do not appear, check your email receipt or refresh this page after payment finishes.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-5">
            <Sparkles className="mt-0.5 shrink-0 text-[#0f7ee8]" size={24} />
            <p className="text-sm font-semibold leading-relaxed text-[#425d78]">
              Each button is matched to the option you selected at checkout. The download is delivered through your site and backed by Cloudflare R2.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
