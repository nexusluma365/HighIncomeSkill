import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';

export default function Offer() {
  const { visitorName, visitorEmail, workFromHomeInterested, addOnAccepted, upsellAccepted } = useFunnel();

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="instant access"
        name="Your Roadmap Is Ready"
        description={`${visitorName || 'You'}, this is the moment where the path gets simple. Digital skills are how people build offers, products, websites, automations, and income paths that can work from anywhere. You have chosen the support that fits you, and now you can start with one clear roadmap instead of trying to piece everything together alone.`}
        points={[
          visitorEmail ? `We have your best email: ${visitorEmail}` : 'Your email can be added on the next screen.',
          workFromHomeInterested ? 'You said flexibility and freedom matter to you.' : 'You kept your path simple while still moving forward.',
          addOnAccepted ? 'Website + SEO is included so you can understand online visibility, lead capture, and client value.' : 'Website + SEO will stay optional while your core digital skills roadmap stays clear.',
          upsellAccepted ? 'AI Automation is included so you can understand leverage, workflows, and systems that save time.' : 'AI Automation will stay optional while your core digital skills roadmap stays clear.',
        ]}
      />

      <Button href="/upsell" sticky>
        Yes, Take Me To My Roadmap
      </Button>
    </div>
  );
}
