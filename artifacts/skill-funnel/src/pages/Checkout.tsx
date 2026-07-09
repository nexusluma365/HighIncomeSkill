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
        name="Review Your Digital Access"
        description="This is where your answers become a cleaner path forward. Review your details, then unlock the digital bundle and download your selected resources after payment."
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
        Get Instant Access
      </Button>
    </div>
  );
}
