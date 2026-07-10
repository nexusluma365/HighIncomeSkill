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
        banner="personal path"
        name="Who Am I Guiding?"
        description="You have already taken the first step by deciding to look at a new direction. Before I show you the next part of the path, tell me who I am walking through this with."
        points={[
          'This helps the next steps feel more personal and less generic.',
          'Use the name you want to see as you move through this process.',
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
        Continue My Path
      </Button>
    </form>
  );
}
