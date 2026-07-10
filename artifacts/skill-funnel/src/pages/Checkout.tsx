import Button from '@/components/Button';
import LeadStepCard from '@/components/LeadStepCard';
import { DownloadCloud, Mail, UserRound } from 'lucide-react';
import { useFunnel } from '@/hooks/useFunnel';

export default function Checkout() {
  const { visitorName, visitorEmail } = useFunnel();

  return (
    <div className="flex min-h-full flex-col justify-between py-8">
      <LeadStepCard
        banner="final step"
        name="Every New Opportunity Begins With One Decision"
        description="Review your details, then take the step that turns this from something you are thinking about into something you can start using today. Your digital download appears after payment is confirmed."
      >
        <div className="mx-auto grid w-full max-w-[560px] gap-3">
          <div className="flex items-center gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-4">
            <UserRound className="text-[#0f7ee8]" size={22} />
            <div>
              <div className="text-xs font-black uppercase tracking-[0.08em] text-[#7a8fa3]">Name</div>
              <div className="font-black text-[#07192f]">{visitorName || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-4">
            <Mail className="text-[#0f7ee8]" size={22} />
            <div>
              <div className="text-xs font-black uppercase tracking-[0.08em] text-[#7a8fa3]">Email</div>
              <div className="font-black text-[#07192f]">{visitorEmail || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-4">
            <DownloadCloud className="text-[#0f7ee8]" size={22} />
            <div>
              <div className="text-xs font-black uppercase tracking-[0.08em] text-[#7a8fa3]">Access</div>
              <div className="font-black text-[#07192f]">Instant digital bundle checkout</div>
            </div>
          </div>
        </div>
      </LeadStepCard>

      <Button href="/upsell" sticky>
        Yes, I Am Ready To Start Today
      </Button>
    </div>
  );
}
