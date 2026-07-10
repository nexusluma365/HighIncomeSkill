import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function SystemReveal() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { setAddOnAccepted } = funnel;

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
        name="Want To Learn How Businesses Get Found Online?"
        description="Every business wants more customers. This path shows you how websites, search visibility, and simple systems work together to help businesses grow."
        points={[
          'Build websites people actually use.',
          'Understand how customers find businesses online.',
          'Learn skills that connect to real businesses.',
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
