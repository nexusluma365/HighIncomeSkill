import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function ValueStack() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { setUpsellAccepted } = funnel;

  const choose = (accepted: boolean) => {
    setUpsellAccepted(accepted);
    logFunnelEvent(
      'ai_automation_choice',
      buildFunnelTrackingPayload({ ...funnel, upsellAccepted: accepted }, {
        page: '/value',
        productKey: 'aiAutomation',
        productName: 'AI Automation System',
        status: accepted ? 'accepted' : 'declined',
        metadata: { aiAutomationAccepted: accepted },
      }),
    );
    setLocation('/offer');
  };

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="inside the roadmap"
        name="BUILD VALUE STEP BY STEP"
        description="This is where curiosity becomes a plan. The bundle gives you the tools to move from conversation to problem, from problem to solution, and from solution to offer."
        points={[
          'CHOOSE YOUR SKILL — Find one useful skill to focus on.',
          'BUILD YOUR PROOF — Create something that shows what you can do.',
          'FIND REAL PROBLEMS — Learn what businesses and customers need help with.',
          'CREATE YOUR SOLUTION — Build a digital product, website, service or automation.',
          'USE AI WITH PURPOSE — Research, write and build faster.',
          'CREATE YOUR OFFER — Turn your solution into something clear people can buy.',
          'TAKE ACTION — Follow a simple 30-day starting plan.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>SEE THE FULL OFFER</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              CONTINUE
            </Button>
          </div>
        }
      />
    </div>
  );
}
