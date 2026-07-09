import React from 'react';
import SectionTitle from './SectionTitle';

interface QuestionCardProps {
  question: string;
  children: React.ReactNode;
}

export default function QuestionCard({ question, children }: QuestionCardProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center py-8">
      <div className="border border-[#d7e6f4] bg-white p-5 shadow-[0_18px_44px_rgba(6,19,34,0.18)] sm:p-8">
        <div className="mb-5 inline-flex rounded-[3px] bg-[#0f7ee8] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
          Step Check
        </div>
        <SectionTitle headline={question} />
        <div className="flex flex-col gap-3 mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
