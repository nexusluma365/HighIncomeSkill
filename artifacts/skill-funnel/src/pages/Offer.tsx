import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Offer() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="instant access"
        name="Your Roadmap Is Ready"
        description="Your choices now come together in one clear place to start. No guessing. No jumping between random videos. Just one roadmap you can unlock and follow at your own pace."
        points={[
          'Your roadmap is ready to unlock.',
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
