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
        banner="your next step"
        name="NOW TURN THE IDEA INTO SOMETHING USEFUL"
        description="You have the relationship foundation. Now the roadmap shows what to build when someone has a problem: choose a useful skill, create proof, shape the solution, and begin helping real people."
        points={[
          'Choose the useful skill that matches the problem.',
          'Create proof that shows you can help.',
          'Build the offer around the outcome they want.',
          'Start becoming valuable through real solutions.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>SHOW ME WHAT IS INSIDE</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              CONTINUE
            </Button>
          </div>
        }
      />
    </div>
  );
}
