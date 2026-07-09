import { FormEvent } from 'react';
import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function Future() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { visitorName, setVisitorName } = funnel;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (visitorName.trim()) {
      logFunnelEvent(
        'name_submitted',
        buildFunnelTrackingPayload(funnel, {
          page: '/future',
          status: 'submitted',
          metadata: { visitorName: visitorName.trim() },
        }),
      );
      setLocation('/lesson');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="quick question"
        name="Who Am I Helping?"
        description="I can see you are ready to make a change, and that is a major first step. But before I can truly point you in the right direction, I need to know who I am helping."
        points={[
          'This helps personalize the rest of your skill path.',
          'Use the name you want us to call you inside this process.',
        ]}
      >
        <label className="mx-auto block w-full max-w-[560px] text-left">
          <span className="mb-2 block text-sm font-black uppercase tracking-[0.08em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
            What is your name?
          </span>
          <input
            value={visitorName}
            onChange={(event) => setVisitorName(event.target.value)}
            placeholder="Enter your first name"
            className="w-full rounded-[8px] border border-[#c8d9ea] bg-[#f8fbff] px-4 py-4 text-lg font-bold text-[#07192f] outline-none transition focus:border-[#0f7ee8] focus:ring-4 focus:ring-[#0f7ee8]/15"
          />
        </label>
      </LeadStepCard>

      <Button type="submit" sticky disabled={!visitorName.trim()}>
        Continue
      </Button>
    </form>
  );
}
