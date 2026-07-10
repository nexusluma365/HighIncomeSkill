import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function SystemReveal() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { visitorName, setAddOnAccepted } = funnel;

  const choose = (accepted: boolean) => {
    setAddOnAccepted(accepted);
    logFunnelEvent(
      'website_seo_choice',
      buildFunnelTrackingPayload({ ...funnel, addOnAccepted: accepted }, {
        page: '/system',
        productKey: 'websiteSeo',
        productName: 'Website + SEO Client Path',
        status: accepted ? 'accepted' : 'declined',
        metadata: { websiteSeoAccepted: accepted },
      }),
    );
    setLocation('/value');
  };

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="client path"
        name="Do You Want The Website + SEO Path Included?"
        description={`${visitorName || 'You'}, websites are digital real estate. They help businesses get found, explain their offer, capture attention, and turn visitors into leads. This path shows you a service people already understand, so you can connect your digital skills to a real business problem.`}
        points={[
          'Learn how websites, SEO, lead capture, and simple client systems help businesses get discovered online.',
          'Build a skill path you can use from anywhere with a laptop, internet access, and a clear offer.',
          'Choose this path if you want to understand how visibility, attention, and client opportunities connect.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Include Website + SEO</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Keep Guiding Me
            </Button>
          </div>
        }
      />
    </div>
  );
}
