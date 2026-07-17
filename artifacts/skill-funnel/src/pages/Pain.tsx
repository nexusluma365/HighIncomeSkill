import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Pain() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="what changes next"
        name="THE OLD WAY IS NOT THE ONLY WAY"
        description="Most people try to change their life by working harder alone. But your answers point to something better: become valuable to the right people by solving a problem they already care about."
        points={[
          'You do not need to chase everyone.',
          'You need conversations with people who have real problems.',
          'When you can help solve the problem, you become more valuable.',
        ]}
      />

      <Button href="/future" sticky>
        CONTINUE
      </Button>
    </div>
  );
}
