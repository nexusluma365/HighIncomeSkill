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
        banner="automation path"
        name="Want To Learn How People Get More Done In Less Time?"
        description="Automation helps remove repetitive work so people can spend more time creating, helping clients, and building new opportunities."
        points={[
          'Save time with smarter workflows.',
          'Learn practical automations.',
          'Build systems businesses already use.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Include This Path</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Keep My Core Roadmap
            </Button>
          </div>
        }
      />
    </div>
  );
}
