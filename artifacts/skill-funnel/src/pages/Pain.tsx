import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Pain() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="keep going"
        name="This Is Where The Shift Starts"
        description="The fact that you made it here matters. It means you are paying attention, you are open to something better, and you are ready for a clearer way to start building skills that can change what is possible."
        points={[
          'You do not need to have it all figured out before you begin.',
          'You only need one clear next step and the willingness to take it.',
          'A focused roadmap can turn scattered ideas into something you can actually follow.',
          'Keep going and you will see the path, the pieces, and the offer that fits.',
        ]}
      />

      <Button href="/future" sticky>
        I Am Ready For The Next Step
      </Button>
    </div>
  );
}
