import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MetricCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  index: number;
}

export default function MetricCard({ value, label, prefix = '', suffix = '', index }: MetricCardProps) {
  // Spring-driven motion value — animates smoothly to target
  const springValue = useSpring(0, { stiffness: 60, damping: 20, mass: 1 });

  const rounded = useTransform(springValue, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    // Small delay per card so they stagger nicely
    const timeout = setTimeout(() => {
      springValue.set(value);
    }, index * 150 + 300);
    return () => clearTimeout(timeout);
  }, [value, springValue, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center justify-center p-5 rounded-[12px] bg-[#f8fbff] border border-[#d7e6f4] text-center"
    >
      <div className="text-3xl font-black text-[#0f7ee8] mb-2 flex items-center gap-0.5">
        <span>{prefix}</span>
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="text-sm text-[#425d78] font-bold leading-snug">{label}</div>
    </motion.div>
  );
}
