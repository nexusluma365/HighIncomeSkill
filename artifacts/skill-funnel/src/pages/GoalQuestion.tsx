import React from 'react';
import { useLocation } from 'wouter';
import { useFunnel } from '@/hooks/useFunnel';
import QuestionCard from '@/components/QuestionCard';
import OptionCard from '@/components/OptionCard';
import { goalOptions } from '@/data/questions';
import { buildFunnelTrackingPayload, logFunnelEvent } from '@/utils/funnelTracking';

export default function GoalQuestion() {
  const [, setLocation] = useLocation();
  const funnel = useFunnel();
  const { goalId, setGoalId } = funnel;

  const handleSelect = (id: string) => {
    const selectedOption = goalOptions.find((option) => option.id === id);
    setGoalId(id);
    logFunnelEvent(
      'goal_selected',
      buildFunnelTrackingPayload({ ...funnel, goalId: id }, {
        page: '/goal',
        status: 'selected',
        metadata: { goalId: id, goalText: selectedOption?.text || '' },
      }),
    );
    setTimeout(() => {
      setLocation('/challenge');
    }, 300);
  };

  return (
    <QuestionCard question="What do you want this challenge to unlock?">
      {goalOptions.map((option) => (
        <OptionCard
          key={option.id}
          text={option.text}
          selected={goalId === option.id}
          onClick={() => handleSelect(option.id)}
        />
      ))}
    </QuestionCard>
  );
}
