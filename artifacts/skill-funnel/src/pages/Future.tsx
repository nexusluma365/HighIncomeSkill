import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';

export default function Future() {
  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="the hopeful picture"
        name="IMAGINE BECOMING THE PERSON PEOPLE NEED"
        description="Now picture this: you meet better people, understand what they are trying to fix, and have a digital skill that helps them move forward. That is where opportunity starts feeling real."
        points={[
          'RELATIONSHIPS — Build trust before you ask for anything.',
          'PROBLEMS — Notice what costs people time, money or opportunity.',
          'SOLUTIONS — Use digital products, websites and automations to help.',
          'FREEDOM — Create value that can travel with you.',
        ]}
      />

      <Button href="/lesson" sticky>
        SHOW ME HOW
      </Button>
    </div>
  );
}
