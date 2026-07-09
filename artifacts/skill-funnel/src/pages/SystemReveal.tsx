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
        banner="recommended"
        name="Add The Website + SEO Client Path To Your Learning Plan?"
        description={`${visitorName || 'You'}, picture being able to help a real business look professional online, get found by more people, and turn visitors into leads. This path gives you a clear service businesses already understand instead of leaving you wondering what to offer first.`}
        points={[
          'Learn how websites, SEO, lead capture, and simple client systems work together.',
          'Build a service path that can help local businesses get more visibility and more leads.',
          'Start seeing yourself as someone who solves business problems, not someone waiting for permission.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Add This To My Plan</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Skip This Path
            </Button>
          </div>
        }
      />
    </div>
  );
}
