import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Lesson() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="the key"
        name="OPPORTUNITY COMES THROUGH PEOPLE"
        description="This is the bridge from the ebook to the offer: relationships help you get close enough to see the problem. Digital skills help you become the person who can solve it."
        points={[
          'Meet better people.',
          'Listen for expensive problems.',
          'Build a useful solution.',
          'Turn that solution into an offer.',
          'That is how you move from learning to becoming valuable.',
        ]}
      />

      <Button href="/training" sticky>
        CONTINUE
      </Button>
    </div>
  );
}
