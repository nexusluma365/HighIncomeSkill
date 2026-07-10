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

  const interestedCopy = `Perfect, ${visitorName || 'that'} tells me you may be serious about building something flexible and useful. What is the best email to keep your next step organized?`;
  const missedCopy = `No pressure, ${visitorName || 'friend'}. Even if you are keeping the path simple right now, you can still move forward one step at a time. What is the best email to keep your next step organized?`;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="save your path"
        name={workFromHomeInterested ? 'Where Should I Send Your Next Step?' : 'Where Should I Save Your Path?'}
        description={workFromHomeInterested ? interestedCopy : missedCopy}
        points={[
          'Use the email you check most often.',
          'This keeps your personalized path connected as you move into the final recommendation.',
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
        Show Me My Recommendation
      </Button>
    </form>
  );
}
