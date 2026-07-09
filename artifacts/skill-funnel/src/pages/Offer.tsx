import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { useFunnel } from '@/hooks/useFunnel';

export default function Offer() {
  const { visitorName, visitorEmail, workFromHomeInterested, addOnAccepted, upsellAccepted } = useFunnel();

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="instant access"
        name="Your AI & Digital Skills Bundle Is Ready"
        description={`${visitorName || 'You'}, your path is ready. The bundle gives you a clear roadmap for learning AI, website, automation, and digital service skills you can start building from home.`}
        points={[
          visitorEmail ? `We have your best email: ${visitorEmail}` : 'Your email can be added on the next screen.',
          workFromHomeInterested ? 'You showed interest in building practical digital skills from anywhere.' : 'You chose to stay updated before choosing the full AI and digital skills bundle.',
          addOnAccepted ? 'You added Website + SEO as a possible client path.' : 'You kept the path focused on the core skills roadmap.',
          upsellAccepted ? 'You added AI Automation as a leverage skill.' : 'You skipped AI Automation for now.',
        ]}
      />

      <Button href="/checkout" sticky>
        Get Instant Access
      </Button>
    </div>
  );
}
