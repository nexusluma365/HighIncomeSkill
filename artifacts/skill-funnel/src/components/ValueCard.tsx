import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ValueCardProps {
  title: string;
  description: string;
  value: number;
  index: number;
}

export default function ValueCard({ title, description, value, index }: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="p-5 rounded-[12px] bg-[#f8fbff] border border-[#d7e6f4] flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-black text-[#07192f]">{title}</h3>
        <span className="text-sm font-black text-[#0f7ee8]">Value ${value}</span>
      </div>
      <p className="text-[#425d78] font-semibold leading-relaxed">{description}</p>
    </motion.div>
  );
}
