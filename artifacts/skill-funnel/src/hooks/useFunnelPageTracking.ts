import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useFunnel } from './useFunnel';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export function useFunnelPageTracking() {
  const [location] = useLocation();
  const funnel = useFunnel();

  useEffect(() => {
    logFunnelEvent(
      'page_view',
      buildFunnelTrackingPayload(funnel, {
        page: location,
        status: 'viewed',
        metadata: { route: location },
      }),
    );
  }, [location]);
}
