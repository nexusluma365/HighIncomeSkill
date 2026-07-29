import { FormEvent, useState } from 'react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/hooks/useFunnel';
import { useToast } from '@/hooks/use-toast';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function RichRelationships() {
  const [, navigate] = useLocation();
  const funnel = useFunnel();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(funnel.visitorName || '');
  const [email, setEmail] = useState(funnel.visitorEmail || '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const cleanFirstName = firstName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFirstName || !isValidEmail(cleanEmail)) {
      toast({
        title: 'Check your info',
        description: 'First name and a valid email address are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    logFunnelEvent(
      'lead_form_submit',
      buildFunnelTrackingPayload(funnel, {
        page: '/ebook',
        source: 'rich-relationships',
        status: 'submitted',
        metadata: { firstName: cleanFirstName, phone: cleanPhone },
      }),
    );

    funnel.setVisitorName(cleanFirstName);
    funnel.setVisitorEmail(cleanEmail);
    logFunnelEvent(
      'lead_form_success',
      buildFunnelTrackingPayload({ ...funnel, visitorName: cleanFirstName, visitorEmail: cleanEmail }, {
        page: '/ebook',
        source: 'rich-relationships',
        status: 'checkout_redirect',
        metadata: { phone: cleanPhone },
      }),
    );
    setIsSubmitting(false);
    navigate('/ebook-checkout');
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-8">
      <form
        onSubmit={handleSubmit}
        className="border border-[#d7e6f4] bg-white p-6 text-left shadow-[0_18px_44px_rgba(6,19,34,0.18)] sm:p-8"
      >
        <div className="text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-[#0f7ee8] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            Rich Relationships Ebook
          </p>
          <h1 className="text-4xl font-black uppercase leading-none text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
            GET THE EBOOK
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-base font-semibold leading-relaxed text-[#425d78]">
            Learn how better relationships can improve your life and create new opportunities.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              First name
            </span>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-14 w-full rounded-[4px] border border-[#bfd5ea] bg-[#f7fbff] px-4 font-semibold text-[#07192f] outline-none transition focus:border-[#0f7ee8] focus:ring-4 focus:ring-[#0f7ee8]/15"
              autoComplete="given-name"
              maxLength={80}
              required
              disabled={isSubmitting}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 w-full rounded-[4px] border border-[#bfd5ea] bg-[#f7fbff] px-4 font-semibold text-[#07192f] outline-none transition focus:border-[#0f7ee8] focus:ring-4 focus:ring-[#0f7ee8]/15"
              autoComplete="email"
              inputMode="email"
              maxLength={160}
              required
              disabled={isSubmitting}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
              Phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-14 w-full rounded-[4px] border border-[#bfd5ea] bg-[#f7fbff] px-4 font-semibold text-[#07192f] outline-none transition focus:border-[#0f7ee8] focus:ring-4 focus:ring-[#0f7ee8]/15"
              autoComplete="tel"
              maxLength={40}
              disabled={isSubmitting}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex min-h-[64px] w-full items-center justify-center rounded-[4px] border border-[#0b4c93] border-t-white/25 border-b-[#05264d] bg-[#0f7ee8] px-6 py-4 text-center text-lg font-black uppercase tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(15,126,232,0.35)] transition hover:bg-[#1594ff] disabled:pointer-events-none disabled:opacity-60 [font-family:Oswald,Impact,Arial_Narrow,sans-serif]"
        >
          {isSubmitting ? 'SENDING YOUR EBOOK...' : 'SEND THE EBOOK TO MY EMAIL'}
        </button>

        <p className="mt-5 text-center text-sm font-semibold leading-relaxed text-[#5a7088]">
          Continue to secure checkout to complete your ebook purchase.
        </p>
      </form>
    </div>
  );
}
