import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Pain() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="keep going"
        name="This Is Where The Shift Starts"
        description="The fact that you made it here matters. It means you are paying attention, you are open to something better, and some part of you is ready to stop letting confusion decide what happens next."
        points={[
          'You do not need to have it all figured out before you begin.',
          'You only need the next clear step and the willingness to take it.',
          'This roadmap is here to help you move with more direction, not more pressure.',
          'If that sounds like where you are right now, keep moving forward.',
        ]}
      />

      <Button href="/future" sticky>
        Yes, Keep Me Moving
      </Button>
    </div>
  );
}
