import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
}

export default function OptionCard({ text, selected, onClick }: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group w-full rounded-[8px] border p-4 text-left transition-all duration-200 sm:p-5",
        "flex items-center gap-4 whitespace-pre-line text-base font-bold leading-snug sm:text-lg",
        "focus:outline-none focus:ring-4 focus:ring-[#0f7ee8]/20",
        selected 
          ? "border-[#0f7ee8] bg-[#eaf6ff] text-[#07192f] shadow-[0_14px_28px_rgba(15,126,232,0.16)] ring-2 ring-[#0f7ee8]/15" 
          : "border-[#d7e6f4] bg-white text-[#425d78] active:border-[#0f7ee8] active:bg-[#eaf6ff] md:hover:border-[#8fc7f8] md:hover:bg-[#f0f8ff] md:hover:text-[#07192f] md:hover:shadow-[0_12px_24px_rgba(15,126,232,0.1)]"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-[#0f7ee8] bg-[#0f7ee8] text-white"
            : "border-[#b8d5ee] bg-[#f8fbff] text-transparent group-active:border-[#0f7ee8] group-active:bg-[#0f7ee8] md:group-hover:border-[#0f7ee8] md:group-hover:bg-[#0f7ee8] md:group-hover:text-white",
        )}
      >
        <CheckCircle2 size={17} strokeWidth={3} />
      </span>
      <span>{text}</span>
    </motion.button>
  );
}
