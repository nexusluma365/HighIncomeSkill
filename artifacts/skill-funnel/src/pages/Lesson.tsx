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
        banner="flexible path"
        name="Is A Flexible Path What You Want?"
        description={`${visitorName ? `Alright, ${visitorName}. ` : ''}If you want skills you can build from home, on your schedule, with a laptop and a phone, this is the direction. Choose this path if you want your roadmap focused on flexibility and building from anywhere.`}
        points={[
          'Learn at your own pace.',
          'Build wherever life takes you.',
          'Follow one clear roadmap.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, That's What I Want</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Show Me Another Path
            </Button>
          </div>
        }
      />
    </div>
  );
}
