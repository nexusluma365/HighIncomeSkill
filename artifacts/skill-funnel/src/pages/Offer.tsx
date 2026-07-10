import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Offer() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="instant access"
        name="Your Roadmap Is Ready"
        description="Everything you've selected now comes together into one clear place to start. No guessing. No jumping between random videos. Just one roadmap you can follow at your own pace."
        points={[
          'Your roadmap is ready whenever you are.',
          'Everything is organized step by step.',
          'Learn from anywhere with a laptop and a phone.',
          'Build skills you can continue growing over time.',
        ]}
      />

      <Button href="/upsell" sticky>
        Unlock My Roadmap
      </Button>
    </div>
  );
}
