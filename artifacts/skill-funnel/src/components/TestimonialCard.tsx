import { motion } from 'framer-motion';

interface TestimonialCardProps {
  name: string;
  result: string;
  text: string;
  index: number;
}

export default function TestimonialCard({ name, result, text, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="p-5 rounded-[12px] bg-[#ffffff]/75 border border-[#c8e6f2]/20"
    >
      <div className="flex flex-col gap-4">
        <div className="inline-flex max-w-fit px-3 py-1 rounded-[4px] bg-[#004898] text-white text-xs font-black uppercase tracking-[0.06em]">
          {result}
        </div>
        <p className="text-[#72889a] font-semibold leading-relaxed">"{text}"</p>
        <div className="font-black text-white">{name}</div>
      </div>
    </motion.div>
  );
}
