import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
}

export default function OptionCard({ text, selected, onClick }: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full p-5 text-left rounded-[6px] border transition-all",
        "flex items-center gap-4 text-base sm:text-lg font-bold leading-snug",
        selected 
          ? "bg-[#eef7ff] border-[#0f7ee8] text-[#07192f] shadow-[0_14px_28px_rgba(15,126,232,0.14)]" 
          : "bg-[#f8fbff] border-[#d7e6f4] text-[#425d78] hover:bg-[#eef7ff] hover:border-[#9cc8f2]"
      )}
    >
      {text}
    </motion.button>
  );
}
