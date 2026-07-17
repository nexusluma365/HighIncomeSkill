import { Link } from 'wouter';
import { ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react';

const ebookBullets = [
  'Learn how to start conversations without sounding fake or desperate.',
  'Know what to say when you meet someone who could open a door.',
  'Position yourself as useful, memorable, and worth referring.',
];

const transformationPoints = [
  'Build better relationships',
  'Solve real problems',
  'Work from anywhere',
];

function CtaButton({ children, href = '/ebook' }: { children: string; href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[64px] w-full items-center justify-center gap-5 rounded-[4px] border border-[#0b4c93] border-t-white/25 border-b-[#05264d] bg-[#3a86e8] px-8 py-5 text-center text-lg font-black uppercase leading-tight tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(58,134,232,0.38)] transition hover:-translate-y-0.5 hover:bg-[#4598ff] hover:shadow-[0_12px_30px_rgba(58,134,232,0.5)] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
    >
      <LockKeyhole size={20} strokeWidth={2.6} />
      {children}
      <ArrowRight size={22} strokeWidth={2.8} />
    </Link>
  );
}

export default function Hero() {
  return (
    <main className="min-h-screen overflow-hidden bg-black px-5 py-8 text-white sm:px-8 lg:px-12 lg:py-6">
      <section className="mx-auto max-w-[1120px] pt-2 text-center sm:pt-4">
        <h1 className="mx-auto max-w-[1000px] text-[2.4rem] font-black uppercase leading-[1.05] tracking-[0.02em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-[4rem]">
          BUILD MORE WAYS TO
          <br />
          <span className="text-[#67b4ff]">EARN FROM ANYWHERE</span>
        </h1>

        <div className="mx-auto mt-5 flex max-w-[760px] flex-col items-center justify-center gap-3 text-center sm:flex-row sm:flex-wrap sm:gap-x-6">
          {transformationPoints.map((point) => (
            <div key={point} className="flex items-center justify-center gap-2">
              <CheckCircle2 className="shrink-0 text-[#22c55e]" size={17} strokeWidth={3} />
              <p className="whitespace-nowrap text-xs font-black uppercase leading-none tracking-[0.05em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-sm">
                {point}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-[780px] text-base font-semibold leading-[1.75] text-[#d6e7f6]">
          More money does not always start with more hours. It starts with finding people who need help, solving a real problem, and creating something valuable. Learn how better relationships, useful digital skills and AI can help you begin.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1480px] items-center gap-8 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 lg:py-12">
        <div className="flex justify-center lg:justify-end">
          <img
            src="/assets/rich-relationships-ebook.png"
            alt="Rich Relationships ebook"
            className="w-full max-w-[820px] drop-shadow-[0_30px_78px_rgba(15,126,232,0.22)]"
          />
        </div>

        <div className="mx-auto w-full max-w-[640px] text-center lg:mx-0 lg:text-left">
          <h2 className="text-[2.2rem] font-black leading-[1.04] tracking-[0.01em] text-white [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-[3.1rem] lg:text-[3.85rem]">
            By Building Better
            <br />
            Relationships With
            <br />
            <span className="text-[#67b4ff]">High Value People</span>
          </h2>

          <p className="mt-6 max-w-[640px] text-base font-bold leading-[1.7] text-[#d6e7f6] sm:text-lg">
            This practical ebook shows you how to become valuable before you ask for anything, start better conversations, and turn everyday interactions into trust, referrals, introductions, and opportunity.
          </p>

          <div className="mt-8 space-y-5">
            {ebookBullets.map((item) => (
              <div key={item} className="flex items-start gap-4 text-left">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3a86e8] text-white shadow-[0_10px_24px_rgba(58,134,232,0.42)]">
                  <CheckCircle2 size={23} strokeWidth={3} />
                </span>
                <p className="text-lg font-black leading-[1.45] text-white sm:text-xl">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <CtaButton>UNLOCK ACCESS</CtaButton>
          </div>

          <p className="mt-5 text-center text-sm font-bold tracking-[0.04em] text-[#90a7bb] lg:text-left">
            Educational content only. Results depend on your action, market, skill, and execution.
          </p>
        </div>
      </section>

    </main>
  );
}
