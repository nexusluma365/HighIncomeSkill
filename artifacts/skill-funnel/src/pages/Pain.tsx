import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Pain() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="introduction"
        name="You Made It To This Step"
        description="The fact that you made it here shows you are not like everyone else. You are paying attention, you are open to change, and some part of you knows there has to be a better way forward."
        points={[
          'You are ready to stop guessing and start moving with direction.',
          'You are willing to look at a new skill path instead of staying stuck.',
          'You are here because something in your life is ready to change.',
          'If this is you, click Yes That\'s Me.',
        ]}
      />

      <Button href="/future" sticky>
        Yes! That&apos;s Me!
      </Button>
    </div>
  );
}
