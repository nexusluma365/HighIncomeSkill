import { useLocation } from 'wouter';
import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function Lesson() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { visitorName, setWorkFromHomeInterested } = funnel;

  const choose = (interested: boolean) => {
    setWorkFromHomeInterested(interested);
    logFunnelEvent(
      'work_from_home_choice',
      buildFunnelTrackingPayload({ ...funnel, workFromHomeInterested: interested }, {
        page: '/lesson',
        status: interested ? 'accepted' : 'declined',
        metadata: { workFromHomeInterested: interested },
      }),
    );
    setLocation('/authority');
  };

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="offer path"
        name="Add The Work From Home Package To Your Learning Plan?"
        description={`${visitorName || 'You'}, imagine having skills you can build from home, from a coffee shop, or anywhere you have a laptop and Wi-Fi. This package is designed to help you stop depending only on overtime and start learning practical digital skills businesses are already paying for.`}
        points={[
          'Learn skills businesses already pay for, including AI automation, web design, appointment booking systems, and email marketing.',
          'Build a flexible skill foundation you can use from home or anywhere you can open your laptop.',
          'Start seeing yourself as someone who can create opportunities instead of waiting for a better job to appear.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Add This To My Plan</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Not Right Now
            </Button>
          </div>
        }
      />
    </div>
  );
}
