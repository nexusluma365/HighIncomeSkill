import React from 'react';
import { useFunnel } from '@/hooks/useFunnel';
import { getPersonalizedMessage } from '@/utils/personalization';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

export default function Personalized() {
  const { goalId, challengeId } = useFunnel();
  const { headline, body } = getPersonalizedMessage(goalId, challengeId);

  return (
    <div className="flex flex-col h-full justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="border border-[#d7e6f4] bg-white shadow-[0_18px_44px_rgba(6,19,34,0.18)] p-6 sm:p-10 text-center shadow-[0_24px_80px_rgba(0,72,152,0.16)]"
      >
        <div className="mx-auto mb-7 inline-flex rounded-[3px] bg-[#0f7ee8] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
          Your Skill Path
        </div>
        <SectionTitle 
          headline={headline} 
          subheadline={body}
          centered={true}
        />
        <div className="mx-auto my-8 h-px max-w-[420px] bg-[#82bdd6]/35" />
        <p className="mx-auto max-w-[430px] text-sm sm:text-base font-semibold leading-relaxed text-[#425d78]">
          From here, you will see why the old path can feel so heavy, what waiting can cost, and how one clear roadmap can make your next move easier to take.
        </p>
      </motion.div>
      
      <Button href="/pain" sticky>
        Keep Going
      </Button>
    </div>
  );
}
