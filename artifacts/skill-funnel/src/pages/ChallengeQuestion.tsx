import React from 'react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/hooks/useFunnel';
import QuestionCard from '@/components/QuestionCard';
import OptionCard from '@/components/OptionCard';
import { challengeOptions } from '@/data/questions';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function ChallengeQuestion() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { challengeId, setChallengeId } = funnel;

  const handleSelect = (id: string) => {
    const selectedOption = challengeOptions.find((option) => option.id === id);
    setChallengeId(id);
    logFunnelEvent(
      'challenge_selected',
      buildFunnelTrackingPayload({ ...funnel, challengeId: id }, {
        page: '/challenge',
        status: 'selected',
        metadata: { challengeId: id, challengeText: selectedOption?.text || '' },
      }),
    );
    setTimeout(() => {
      setLocation('/personalized');
    }, 300);
  };

  return (
    <QuestionCard question="What is keeping you from going live?">
      {challengeOptions.map((option) => (
        <OptionCard
          key={option.id}
          text={option.text}
          selected={challengeId === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </QuestionCard>
  );
}
