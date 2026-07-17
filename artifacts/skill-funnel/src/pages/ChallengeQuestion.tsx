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
    <QuestionCard
      eyebrow="Your Starting Point"
      question="WHAT FEELS LIKE THE BIGGEST THING HOLDING YOU BACK?"
      subheadline="Choose the one that feels closest. Each answer helps map out a gameplan for you."
      encouragement="Once you name the obstacle, the roadmap can show you what to do next."
    >
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
