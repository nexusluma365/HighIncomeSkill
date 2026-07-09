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
    if (visitorEmail.trim()) {
      logFunnelEvent(
        'email_submitted',
        buildFunnelTrackingPayload(funnel, {
          page: '/authority',
          status: 'submitted',
          metadata: { visitorEmail: visitorEmail.trim() },
        }),
      );
      setLocation('/system');
    }
  };

  const interestedCopy = `Perfect, ${visitorName || 'that'} tells me you may be serious about building something flexible from home. What is the best email to send your next step to?`;
  const missedCopy = `No biggie, ${visitorName || 'friend'}. That was a strong offer to pass on, but I respect that it may not be the right fit right now. What is your email so we can keep you updated with the next best skill path?`;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="send access"
        name={workFromHomeInterested ? 'Where Should I Send This?' : 'Let Me Keep You Updated'}
        description={workFromHomeInterested ? interestedCopy : missedCopy}
        points={[
          'Use the email you check most often.',
          'This lets us send your personalized next step and keep your path organized.',
        ]}
      >
        <label className="mx-auto block w-full max-w-[560px] text-left">
          <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            What is your email?
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
        Continue
      </Button>
    </form>
  );
}
