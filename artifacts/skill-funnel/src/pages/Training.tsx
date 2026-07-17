import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { PlayCircle } from 'lucide-react';
import Button from '@/components/Button';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

type VideoType = 'embed' | 'mp4' | 'missing';

function getTrainingVideo(url?: string): { type: VideoType; src: string } {
  const src = (url || '').trim();
  if (!src) return { type: 'missing', src: '' };

  if (/\.(mp4)(\?.*)?$/i.test(src)) {
    return { type: 'mp4', src };
  }

  if (/youtube\.com\/embed|player\.vimeo\.com\/video/i.test(src)) {
    return { type: 'embed', src };
  }

  return { type: 'embed', src };
}

function TrainingVideo() {
  const video = getTrainingVideo(import.meta.env.VITE_TRAINING_VIDEO_URL);

  if (video.type === 'missing') {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-[#2f74ad]/50 bg-black text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <div>
          <PlayCircle className="mx-auto mb-4 h-14 w-14 text-[#0f7ee8]" strokeWidth={2.2} />
          <p className="text-xl font-black uppercase tracking-[0.08em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            UPLOAD YOUR FREE TRAINING VIDEO
          </p>
        </div>
      </div>
    );
  }

  if (video.type === 'mp4') {
    return (
      <video
        src={video.src}
        controls
        playsInline
        className="aspect-video w-full bg-black"
        onPlay={() => {
          logFunnelEvent('training_video_play', {
            page: '/training',
            source: 'rich-relationships',
            status: 'played',
          });
        }}
      />
    );
  }

  return (
    <iframe
      src={video.src}
      title="Rich Relationships training"
      className="aspect-video w-full bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      onLoad={() => {
        logFunnelEvent('training_video_play', {
          page: '/training',
          source: 'rich-relationships',
          status: 'loaded',
        });
      }}
    />
  );
}

export default function Training() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();

  useEffect(() => {
    logFunnelEvent(
      'training_page_view',
      buildFunnelTrackingPayload(funnel, {
        page: '/training',
        source: 'rich-relationships',
        status: 'viewed',
      }),
    );
  }, []);

  function handleClick() {
    logFunnelEvent(
      'training_cta_click',
      buildFunnelTrackingPayload(funnel, {
        page: '/training',
        source: 'rich-relationships',
        status: 'clicked',
      }),
    );
    navigate('/upsell');
  }

  return (
    <section className="flex min-h-full flex-col justify-center py-4 sm:py-8">
      <div className="mx-auto w-full max-w-[1100px] border border-[#143a5f] bg-[#061322] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
        <header className="mb-7 flex items-center justify-center">
          <div className="rounded-[3px] border border-[#2f74ad]/60 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            Free Training
          </div>
        </header>

        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5ab8ff] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            YOUR FREE TRAINING IS READY
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-[1.04] tracking-[0.02em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
            BECOME THE PERSON{' '}
            <span className="text-[#0f7ee8]">OPPORTUNITIES LOOK FOR</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-base font-semibold leading-[1.7] text-[#c9dff2]">
            You have seen the pattern: relationships reveal problems, and useful solutions create value. This training shows how those pieces connect before the roadmap opens.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[900px] overflow-hidden border border-[#d7e6f4] bg-white p-2 shadow-[0_18px_44px_rgba(6,19,34,0.22)]">
          <TrainingVideo />
        </div>

        <div className="mx-auto mt-8 w-full max-w-[560px]">
          <Button onClick={handleClick}>
            SHOW ME THE WORK FROM ANYWHERE PATH
          </Button>
        </div>
      </div>
    </section>
  );
}
