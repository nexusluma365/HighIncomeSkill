import { cn } from '@/lib/utils';

interface SectionTitleProps {
  headline: string;
  subheadline?: string;
  centered?: boolean;
}

export default function SectionTitle({ headline, subheadline, centered = true }: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-3", centered && "text-center")}>
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.02em] text-[#07192f] leading-[1.04] [font-family:Oswald,Impact,Arial_Narrow,sans-serif]">
        {headline}
      </h1>
      {subheadline && (
        <p className="text-base sm:text-lg text-[#425d78] font-semibold leading-relaxed">
          {subheadline}
        </p>
      )}
    </div>
  );
}
