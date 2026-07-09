import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function ValueStack() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { visitorName, setUpsellAccepted } = funnel;

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
        name="Add AI Automation To Your Learning Plan?"
        description={`${visitorName || 'You'}, imagine knowing how to use AI to save hours of work, connect simple systems, and help businesses follow up faster without doing everything manually. This is where your laptop starts feeling like leverage.`}
        points={[
          'Learn how AI tools can help complete hours of work in minutes.',
          'Understand automations for follow-up, appointment reminders, lead routing, and simple business workflows.',
          'Start seeing yourself as someone who can build systems that keep working even when you are not sitting at the screen.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Add AI Automation</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Skip Automation
            </Button>
          </div>
        }
      />
    </div>
  );
}
