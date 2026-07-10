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
        name="Do You Want A Path You Can Build From Anywhere?"
        description={`${visitorName || 'You'}, digital skills can travel with you. People use them to build offers, create digital products, help businesses, work from home, travel, and create opportunities that are not locked to one location. This is where the idea starts to feel possible instead of far away.`}
        points={[
          'Learn practical skills connected to websites, content, digital products, AI tools, and online business.',
          'Build a flexible foundation with a laptop, a phone, internet access, and the willingness to practice.',
          'Choose this if you want the rest of the path focused on freedom, flexibility, and real momentum.',
        ]}
        footer={
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => choose(true)}>Yes, Show Me That Path</Button>
            <Button onClick={() => choose(false)} variant="secondary">
              Keep My Base Path
            </Button>
          </div>
        }
      />
    </div>
  );
}
