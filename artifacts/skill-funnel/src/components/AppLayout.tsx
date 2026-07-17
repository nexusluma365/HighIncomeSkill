import React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { useFunnelPageTracking } from '@/hooks/useFunnelPageTracking';
import ErrorBoundary from './ErrorBoundary';

const routes = [
  '/',
  '/ebook',
  '/goal',
  '/challenge',
  '/personalized',
  '/pain',
  '/future',
  '/lesson',
  '/training',
  '/upsell',
  '/thankyou',
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  useFunnelPageTracking();
  
  const stepIndex = routes.indexOf(location);
  const finalProgressStep = routes.indexOf('/training');
  const showProgressBar = stepIndex > 0 && stepIndex <= finalProgressStep;
  const progress = stepIndex > 0 ? stepIndex / finalProgressStep : 0;
  const isHome = location === '/';
  const isWideExperience = location === '/upsell' || location === '/thankyou' || location === '/training';
  const shouldUseScreenBoundary = location !== '/upsell';
  const screen = shouldUseScreenBoundary ? <ErrorBoundary key={location}>{children}</ErrorBoundary> : children;

  return (
    <div className="min-h-[100dvh] w-full bg-black text-foreground flex flex-col items-center overflow-x-hidden font-sans">
      {showProgressBar && (
        <div className="w-full fixed top-0 left-0 z-50">
          <ProgressBar progress={progress} />
        </div>
      )}
      
      <main
        className={`w-full flex-1 flex flex-col relative ${
          isHome ? 'max-w-[1440px]' : isWideExperience ? 'max-w-none' : 'max-w-[760px]'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 }}
            className={`flex-1 flex flex-col w-full h-full ${
              isHome
                ? 'px-0 py-0 pb-0'
                : isWideExperience
                  ? 'px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8'
                  : 'px-4 sm:px-8 py-6 sm:py-10 pb-32'
            }`}
          >
            {screen}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
