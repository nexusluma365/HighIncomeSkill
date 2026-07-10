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
        name="Do You Want The AI Automation Path Included?"
        description={`${visitorName || 'You'}, automation is how digital work starts to gain leverage. Imagine using AI, prompts, and simple systems to save time, follow up faster, deliver more consistently, and create workflows that keep moving even when you are not doing every step by hand.`}
        points={[
          'Learn how AI tools can help turn repeated tasks into faster workflows.',
          'Understand automations for follow-up, appointment reminders, lead routing, and simple business systems.',
          'Choose this path if you want to see how people create leverage beyond trading every hour for money.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Include AI Automation</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Keep Guiding Me
            </Button>
          </div>
        }
      />
    </div>
  );
}
