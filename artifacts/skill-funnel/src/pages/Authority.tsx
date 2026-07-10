import { FormEvent } from 'react';
import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function Authority() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { visitorName, visitorEmail, setVisitorEmail, workFromHomeInterested } = funnel;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedEmail = visitorEmail.trim();
    if (trimmedEmail) {
      logFunnelEvent(
        'email_submitted',
        buildFunnelTrackingPayload({ ...funnel, visitorEmail: trimmedEmail }, {
          page: '/authority',
          status: 'submitted',
          metadata: { visitorEmail: trimmedEmail },
        }),
      );
      setLocation('/system');
    }
  };

  const interestedCopy = `${visitorName ? `Good, ${visitorName}. ` : ''}So we can continue mapping out the right game plan for you, enter the email where you want your roadmap and next steps sent.`;
  const missedCopy = `${visitorName ? `Good, ${visitorName}. ` : ''}So we can keep your path organized and show you the right next step, enter the email where you want your roadmap sent.`;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="save your path"
        name="Where Should I Send Your Game Plan?"
        description={workFromHomeInterested ? interestedCopy : missedCopy}
      >
        <label className="mx-auto block w-full max-w-[560px] text-left">
          <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            What email should I use?
          </span>
          <input
            type="email"
            value={visitorEmail}
            onChange={(event) => setVisitorEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[8px] border border-[#c8d9ea] bg-[#f8fbff] px-4 py-4 text-lg font-bold text-[#07192f] outline-none transition focus:border-[#0f7ee8] focus:ring-4 focus:ring-[#0f7ee8]/15"
          />
        </label>
      </LeadStepCard>

      <Button type="submit" sticky disabled={!visitorEmail.trim()}>
        Show Me My Roadmap
      </Button>
    </form>
  );
}
