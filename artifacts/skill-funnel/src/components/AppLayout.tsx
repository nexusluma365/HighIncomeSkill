import React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { useFunnelPageTracking } from '@/hooks/useFunnelPageTracking';
import ErrorBoundary from './ErrorBoundary';

const routes = [
  '/',
  '/pain',
  '/future',
  '/lesson',
  '/authority',
  '/system',
  '/value',
  '/offer',
  '/checkout',
  '/upsell',
  '/thankyou',
  '/goal',
  '/challenge',
  '/personalized',
  '/faq'
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  useFunnelPageTracking();
  
  const stepIndex = routes.indexOf(location);
  // Total steps 14 (index 1 to 14, where 14 is thankyou, 12 is checkout, 0 is hero)
  // We'll calculate progress only on steps that should have it
  // Exclude hero (0), checkout (12), upsell (13), thankyou (14) if desired, but 
  // prompt says "No progress bar on this screen" for hero & upsell, and "Actually keep progress bar since it shows they're close to done" for checkout.
  // So: Hero=0(no bar), Upsell=13(no bar). All others have a bar. ThankYou=14(no bar? prompt says "Progress = currentStep / 14. Show a thin animated bar at the top."). Let's just show it if not in [0, 13, 14].
  
  const showProgressBar = stepIndex > 0 && stepIndex <= 9;
  const progress = stepIndex > 0 ? stepIndex / 9 : 0;
  const isHome = location === '/';
  const isWideExperience = location === '/upsell' || location === '/thankyou';
  const shouldUseScreenBoundary = location !== '/checkout' && location !== '/upsell';
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
