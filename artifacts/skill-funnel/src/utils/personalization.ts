const goalCopy: Record<string, { label: string; reflection: string }> = {
  money: {
    label: 'more money',
    reflection:
      'You are not just looking for money. You are looking for a way to become more valuable.',
  },
  freedom: {
    label: 'more freedom',
    reflection:
      'You are not just looking for freedom. You are looking for a skill that can create choices.',
  },
  relationships: {
    label: 'better relationships',
    reflection:
      'You already understand something important: the right people can change the room you are in.',
  },
  direction: {
    label: 'clear direction',
    reflection:
      'You are not lost. You just need a simple next step that makes the path easier to see.',
  },
};

const challengeCopy: Record<string, { insight: string }> = {
  skill: {
    insight:
      'The skill matters, but only when it connects to a real problem someone wants solved.',
  },
  people: {
    insight:
      'The people matter, but the real shift happens when your conversations reveal what they need help with.',
  },
  problem: {
    insight:
      'The problem matters because valuable people notice what others are trying to fix.',
  },
  plan: {
    insight:
      'The plan matters because scattered information will not change your life. A clear sequence can.',
  },
};

const defaultGoal = goalCopy.direction;
const defaultChallenge = challengeCopy.plan;

export function getPersonalizedPath(goalId?: string, challengeId?: string) {
  const goal = goalId ? goalCopy[goalId] || defaultGoal : defaultGoal;
  const challenge = challengeId
    ? challengeCopy[challengeId] || defaultChallenge
    : defaultChallenge;

  return {
    eyebrow: `You chose ${goal.label}`,
    headline: "You're closer than you think.",
    subheadline:
      'Your answers are showing the beginning of a real gameplan.',
    body: `${goal.reflection} ${challenge.insight} The next thing to understand is this: relationships open the door, but value is what makes people remember you.`,
    bridge:
      'The Rich Relationships ebook helps you start better conversations. The Work From Anywhere Bundle helps you turn those conversations into valuable offers.',
    points: [
      'Start better conversations.',
      'Listen for the problem behind the conversation.',
      'Become valuable by learning how to build the solution.',
    ],
  };
}

export function getPersonalizedMessage(goalId?: string, challengeId?: string) {
  const path = getPersonalizedPath(goalId, challengeId);

  return {
    headline: path.headline,
    body: `${path.body} ${path.bridge}`,
  };
}
