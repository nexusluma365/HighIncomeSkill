import React, { createContext, useState, ReactNode } from 'react';

interface FunnelState {
  goalId?: string;
  challengeId?: string;
  visitorName: string;
  visitorEmail: string;
  workFromHomeInterested?: boolean;
  selectedProductKeys: string[];
  purchaseDownloads: PurchaseDownload[];
  addOnAccepted: boolean;
  upsellAccepted: boolean;
  setGoalId: (id: string) => void;
  setChallengeId: (id: string) => void;
  setVisitorName: (name: string) => void;
  setVisitorEmail: (email: string) => void;
  setWorkFromHomeInterested: (interested: boolean) => void;
  setSelectedProductKeys: (keys: string[]) => void;
  setPurchaseDownloads: (downloads: PurchaseDownload[]) => void;
  setAddOnAccepted: (accepted: boolean) => void;
  setUpsellAccepted: (accepted: boolean) => void;
  reset: () => void;
}

export interface PurchaseDownload {
  productKey: string;
  productName: string;
  fileName: string;
  downloadUrl: string;
}

export const FunnelContext = createContext<FunnelState | undefined>(undefined);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [goalId, setGoalId] = useState<string>();
  const [challengeId, setChallengeId] = useState<string>();
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [workFromHomeInterested, setWorkFromHomeInterested] = useState<boolean>();
  const [selectedProductKeys, setSelectedProductKeys] = useState<string[]>([]);
  const [purchaseDownloads, setPurchaseDownloads] = useState<PurchaseDownload[]>([]);
  const [addOnAccepted, setAddOnAccepted] = useState(false);
  const [upsellAccepted, setUpsellAccepted] = useState(false);

  const reset = () => {
    setGoalId(undefined);
    setChallengeId(undefined);
    setVisitorName('');
    setVisitorEmail('');
    setWorkFromHomeInterested(undefined);
    setSelectedProductKeys([]);
    setPurchaseDownloads([]);
    setAddOnAccepted(false);
    setUpsellAccepted(false);
  };

  return (
    <FunnelContext.Provider
      value={{
        goalId,
        challengeId,
        visitorName,
        visitorEmail,
        workFromHomeInterested,
        selectedProductKeys,
        purchaseDownloads,
        addOnAccepted,
        upsellAccepted,
        setGoalId,
        setChallengeId,
        setVisitorName,
        setVisitorEmail,
        setWorkFromHomeInterested,
        setSelectedProductKeys,
        setPurchaseDownloads,
        setAddOnAccepted,
        setUpsellAccepted,
        reset
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
}
