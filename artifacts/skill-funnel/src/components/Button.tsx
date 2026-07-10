import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps {
  href?: string;
  sticky?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  href, 
  sticky, 
  variant = 'primary', 
  className,
  ...props 
}: ButtonProps) {
  const baseClasses = cn(
    "relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[4px] px-8 py-5 text-center text-lg font-black uppercase tracking-[0.06em] outline-none transition-all duration-200 ease-out [font-family:Oswald,Impact,Arial_Narrow,sans-serif]",
    "hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60",
    variant === 'primary' && "border border-[#0b4c93] border-t-white/25 border-b-[#05264d] bg-[#0f7ee8] text-white shadow-[0_8px_24px_rgba(15,126,232,0.35)] hover:bg-[#1594ff] hover:text-white hover:shadow-[0_12px_30px_rgba(15,126,232,0.48)]",
    variant === 'secondary' && "border border-[#9cc8f2] bg-white text-[#0b4c93] shadow-[0_8px_20px_rgba(6,19,34,0.12)] hover:border-[#0f7ee8] hover:bg-[#eef7ff] hover:text-[#07192f]",
    className
  );

  const content = (
    <span className="relative z-10">{children}</span>
  );

  const wrapperClasses = cn(
    "w-full",
    sticky && "fixed bottom-0 left-0 right-0 p-5 bg-black z-40 md:relative md:bg-transparent md:p-0"
  );

  if (href) {
    return (
      <div className={wrapperClasses}>
        <div className="max-w-[520px] mx-auto w-full">
          <Link href={href} className={baseClasses}>
            {content}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div className="max-w-[520px] mx-auto w-full">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className={baseClasses} 
          {...props}
        >
          {content}
        </motion.button>
      </div>
    </div>
  );
}
