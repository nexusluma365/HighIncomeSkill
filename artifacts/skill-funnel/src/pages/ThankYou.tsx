import { useEffect, useState } from 'react';
import { ArrowRight, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function ThankYou() {
  const [, navigate] = useLocation();
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: string; delay: number; duration: number; color: string }[]
  >([]);

  useEffect(() => {
    const pieces = Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 2.4,
      color: ['#0f7ee8', '#2458d8', '#ffffff', '#6bd1ff'][Math.floor(Math.random() * 4)],
    }));
    setConfettiPieces(pieces);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 py-8 sm:px-6">
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

      <section className="relative z-10 mx-auto w-full max-w-[980px] overflow-hidden rounded-[8px] border border-[#d7e6f4] bg-white text-center shadow-[0_22px_60px_rgba(6,19,34,0.28)]">
        <div className="bg-[#eef7ff] px-5 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#0f7ee8] text-white shadow-[0_16px_34px_rgba(15,126,232,0.3)]">
            <ShieldCheck size={42} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0f7ee8]">
            Payment Confirmed
          </p>
          <h1 className="mx-auto mt-4 max-w-[820px] text-4xl font-black uppercase leading-[0.98] tracking-[-0.03em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-6xl">
            Welcome! Your Rich Relationships Ebook Is On Its Way.
          </h1>
          <div className="mx-auto mt-6 max-w-[620px] space-y-3 text-base font-semibold leading-relaxed text-[#425d78] sm:text-lg">
            <p>We&apos;ve sent your ebook to your email.</p>
            <p>Can&apos;t find it? Check your Spam or Promotions folder.</p>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#07192f] text-white">
            <MailCheck size={34} />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[#0f7ee8]">
            One Last Step...
          </p>
          <h2 className="mx-auto mt-3 max-w-[760px] text-3xl font-black uppercase leading-tight text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
            Now That You Have The Rich Relationship Ebook
          </h2>
          <p className="mx-auto mt-5 max-w-[700px] text-xl font-black leading-relaxed text-[#07192f]">
            Learn How To Turn Your New Relationships Into Paying Customers.
          </p>
          <p className="mx-auto mt-4 max-w-[720px] text-base font-semibold leading-relaxed text-[#425d78] sm:text-lg">
            Turn conversations into clients, relationships into opportunities, and opportunities into income.
          </p>

          <button
            type="button"
            onClick={() => navigate('/training')}
            className="group mt-8 inline-flex min-h-[72px] w-full max-w-[760px] items-center justify-center gap-3 rounded-[8px] bg-[#0f7ee8] px-5 py-4 text-center text-xl font-black uppercase leading-tight tracking-[0.02em] text-white shadow-[0_16px_34px_rgba(15,126,232,0.26)] transition hover:-translate-y-0.5 hover:bg-[#1594ff] active:translate-y-0 [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-3xl"
          >
            <span>YES! SHOW ME HOW TO TURN THESE RELATIONSHIPS INTO Paying Customers</span>
            <ArrowRight className="hidden shrink-0 transition group-hover:translate-x-1 sm:block" size={34} />
          </button>

          <div className="mx-auto mt-6 flex max-w-[760px] items-start gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-5 text-left">
            <Sparkles className="mt-0.5 shrink-0 text-[#0f7ee8]" size={24} />
            <p className="text-sm font-semibold leading-relaxed text-[#425d78]">
              Watch the next video to see how relationships can become real conversations, clear offers, and paying customers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
