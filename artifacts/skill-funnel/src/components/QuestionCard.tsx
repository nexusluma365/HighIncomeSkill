import React from 'react';
import SectionTitle from './SectionTitle';

interface QuestionCardProps {
  question: string;
  eyebrow?: string;
  subheadline?: string;
  encouragement?: string;
  children: React.ReactNode;
}

export default function QuestionCard({ question, eyebrow = 'Step Check', subheadline, encouragement, children }: QuestionCardProps) {
  return (
    <div className="flex h-full w-full flex-col justify-center py-6">
      <div className="overflow-hidden rounded-[8px] border border-[#d7e6f4] bg-white shadow-[0_18px_44px_rgba(6,19,34,0.16)]">
        <div className="border-b border-[#e6eef6] bg-[#f8fbff] px-5 py-5 text-center sm:px-8 sm:py-6">
          <div className="mb-4 inline-flex rounded-[3px] bg-[#0f7ee8] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
            {eyebrow}
          </div>
          <SectionTitle headline={question} subheadline={subheadline} />
        </div>

        <div className="flex flex-col gap-3 p-5 sm:p-8">
          {children}
          {encouragement && (
            <p className="mx-auto mt-4 max-w-[520px] text-center text-sm font-semibold leading-relaxed text-[#5a7088]">
              {encouragement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
