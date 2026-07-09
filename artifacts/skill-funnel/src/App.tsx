import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { FunnelProvider } from '@/context/FunnelContext';
import AppLayout from '@/components/AppLayout';

// Pages
import Hero from '@/pages/Hero';
import GoalQuestion from '@/pages/GoalQuestion';
import ChallengeQuestion from '@/pages/ChallengeQuestion';
import Personalized from '@/pages/Personalized';
import Pain from '@/pages/Pain';
import Future from '@/pages/Future';
import Lesson from '@/pages/Lesson';
import Authority from '@/pages/Authority';
import SystemReveal from '@/pages/SystemReveal';
import ValueStack from '@/pages/ValueStack';
import FAQ from '@/pages/FAQ';
import Offer from '@/pages/Offer';
import Checkout from '@/pages/Checkout';
import Upsell from '@/pages/Upsell';
import ThankYou from '@/pages/ThankYou';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <FunnelProvider>
      <AppLayout>
        <Switch>
          <Route path="/" component={Hero} />
          <Route path="/goal" component={GoalQuestion} />
          <Route path="/challenge" component={ChallengeQuestion} />
          <Route path="/personalized" component={Personalized} />
          <Route path="/pain" component={Pain} />
          <Route path="/future" component={Future} />
          <Route path="/lesson" component={Lesson} />
          <Route path="/authority" component={Authority} />
          <Route path="/system" component={SystemReveal} />
          <Route path="/value" component={ValueStack} />
          <Route path="/faq" component={FAQ} />
          <Route path="/offer" component={Offer} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/upsell" component={Upsell} />
          <Route path="/thankyou" component={ThankYou} />
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </FunnelProvider>
  );
}

function App() {
  return (
    <div className="dark">
      <div className="starfield-container" aria-hidden="true">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <div />
      </div>
      <div className="relative z-10">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
