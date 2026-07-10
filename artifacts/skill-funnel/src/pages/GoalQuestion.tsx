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
    <QuestionCard
      eyebrow="Your Future"
      question="What kind of change are you hoping this creates?"
      subheadline="There is no wrong answer here. Pick the future that would make learning a new skill feel worth it."
      encouragement="The next step will show what has been getting in the way, then the roadmap can meet you there."
    >
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
