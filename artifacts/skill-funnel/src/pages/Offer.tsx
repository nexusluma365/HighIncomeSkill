import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Offer() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="THE WORK FROM ANYWHERE ROADMAP"
        name="BUILD MORE WAYS TO EARN FROM ANYWHERE"
        description="Learn how to find the right people, solve real problems and create digital solutions businesses already pay for. Better relationships help you find opportunity. Useful skills help you create value. AI helps you move faster. The roadmap shows you how to put it together."
        points={[
          'Beginner-friendly roadmap',
          'Digital skills path',
          'Offer-building guide',
          'AI workflows',
          'Digital product tools',
          'Automation resources',
          '30-day action plan',
        ]}
      />

      <Button href="/upsell" sticky>
        YES — I AM READY TO START
      </Button>
    </div>
  );
}
