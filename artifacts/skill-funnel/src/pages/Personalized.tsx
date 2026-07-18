import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import { useFunnel } from '@/hooks/useFunnel';
import { getPersonalizedPath } from '@/utils/personalization';

export default function Personalized() {
  const { goalId, challengeId } = useFunnel();
  const path = getPersonalizedPath(goalId, challengeId);

  return (
    <div className="flex h-full flex-col justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="overflow-hidden rounded-[8px] border border-[#d7e6f4] bg-white text-center shadow-[0_24px_80px_rgba(0,72,152,0.16)]"
      >
        <div className="bg-[#f8fbff] px-6 py-7 sm:px-10">
          <div className="mx-auto mb-5 inline-flex rounded-[3px] bg-[#0f7ee8] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
            {path.eyebrow}
          </div>
          <SectionTitle
            headline={path.headline}
            subheadline={path.subheadline}
            centered={true}
          />
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-8">
          <p className="mx-auto max-w-[590px] text-base font-semibold leading-relaxed text-[#425d78] sm:text-lg">
            {path.body}
          </p>

          <p className="mx-auto mt-5 max-w-[590px] rounded-[8px] border border-[#b8d5ee] bg-[#eef7ff] p-4 text-base font-bold leading-relaxed text-[#07192f]">
            {path.bridge}
          </p>

          <div className="mx-auto my-6 h-px max-w-[420px] bg-[#82bdd6]/35" />

          <div className="mx-auto grid max-w-[590px] gap-3 text-left">
            {path.points.map((point) => (
              <div key={point} className="flex gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f7ee8]" strokeWidth={2.5} />
                <span className="text-sm font-bold leading-relaxed text-[#425d78] sm:text-base">{point}</span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-[560px] text-xs font-black uppercase leading-relaxed tracking-[0.06em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-sm">
            Click Continue to Learn how to Become Valuable In these new relationships.
          </p>
        </div>
      </motion.div>

      <Button href="/pain" sticky>
        CONTINUE
      </Button>
    </div>
  );
}
