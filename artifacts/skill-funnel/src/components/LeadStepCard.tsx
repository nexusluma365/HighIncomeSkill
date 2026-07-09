import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadStepCardProps {
  banner?: string;
  name: string;
  description: string;
  points?: string[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function LeadStepCard({
  banner = 'next step',
  name,
  description,
  points = [],
  children,
  footer,
  className,
}: LeadStepCardProps) {
  return (
    <div
      className={cn(
        'relative mx-auto mt-8 flex w-full max-w-[760px] flex-col rounded-[12px] border-2 border-[#0f7ee8] bg-white px-5 pb-5 pt-9 shadow-[0_24px_70px_rgba(6,19,34,0.22)] sm:px-9 sm:pb-8 sm:pt-11',
        className,
      )}
    >
      <div className="absolute left-0 right-0 top-[-1.05rem] flex justify-center">
        <span className="flex min-h-7 items-center justify-center rounded-full bg-[#0f7ee8] px-4 py-1 text-xs font-black uppercase leading-none tracking-[0.12em] text-white shadow-[0_10px_22px_rgba(15,126,232,0.28)]">
          {banner}
        </span>
      </div>

      <div className="mb-3 text-center text-3xl font-black uppercase leading-[1.04] tracking-[0.02em] text-[#07192f] [font-family:Oswald,Impact,Arial_Narrow,sans-serif] sm:text-5xl">
        {name}
      </div>

      <p className="mx-auto mb-8 max-w-[640px] text-center text-base font-semibold leading-[1.75] text-[#425d78] sm:text-lg">
        {description}
      </p>

      {points.length > 0 && (
        <div className="mb-8 space-y-3">
          {points.map((point) => (
            <div key={point} className="flex gap-3 rounded-[8px] border border-[#d7e6f4] bg-[#f8fbff] p-4">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#0f7ee8]" strokeWidth={2.5} />
              <span className="font-bold leading-relaxed text-[#425d78]">{point}</span>
            </div>
          ))}
        </div>
      )}

      {children}

      {footer && <div className="mt-auto flex flex-col gap-5 pt-8">{footer}</div>}
    </div>
  );
}
