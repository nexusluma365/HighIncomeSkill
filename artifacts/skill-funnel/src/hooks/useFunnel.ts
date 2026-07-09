import { useContext } from 'react';
import { FunnelContext } from '../context/FunnelContext';

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (context === undefined) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
}
